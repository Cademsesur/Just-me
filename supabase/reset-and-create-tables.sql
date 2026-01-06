-- Script de reconstruction complète de la base de données
-- ⚠️ ATTENTION : Ce script supprime et recrée toutes les tables !
-- ⚠️ Toutes les données existantes seront perdues !
-- 
-- À exécuter dans le SQL Editor de Supabase

-- =======================================================================================
-- 1. SUPPRESSION DES TABLES EXISTANTES (dans le bon ordre pour éviter les erreurs de FK)
-- =======================================================================================

DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS declarations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Supprimer les fonctions si elles existent
DROP FUNCTION IF EXISTS generate_person_hash(TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_global_stats() CASCADE;

-- =============================================================================
-- 2. CRÉATION DE LA TABLE PROFILES
-- =============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  last_sign_in_at TIMESTAMPTZ,
  total_declarations INTEGER DEFAULT 0,
  total_alerts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_profiles_email ON profiles(email);

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, provider, last_sign_in_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'provider',
    NEW.last_sign_in_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 3. CRÉATION DE LA TABLE DECLARATIONS
-- =============================================================================

CREATE TABLE declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country TEXT NOT NULL,
  person_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contrainte : Un utilisateur ne peut pas déclarer la même personne deux fois
  CONSTRAINT unique_user_person UNIQUE (user_id, person_hash)
);

-- Index pour améliorer les performances
CREATE INDEX idx_declarations_user_id ON declarations(user_id);
CREATE INDEX idx_declarations_person_hash ON declarations(person_hash);
CREATE INDEX idx_declarations_is_active ON declarations(is_active);

-- Activer RLS
ALTER TABLE declarations ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour declarations
CREATE POLICY "Users can view their own declarations"
ON declarations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own declarations"
ON declarations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own declarations"
ON declarations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own declarations"
ON declarations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================================================
-- 4. CRÉATION DE LA TABLE MATCHES
-- =============================================================================

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id_1 UUID NOT NULL REFERENCES declarations(id) ON DELETE CASCADE,
  declaration_id_2 UUID NOT NULL REFERENCES declarations(id) ON DELETE CASCADE,
  person_hash TEXT NOT NULL,
  user_1_notified BOOLEAN DEFAULT FALSE,
  user_2_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contrainte : Éviter les doublons de matches
  CONSTRAINT unique_match UNIQUE (declaration_id_1, declaration_id_2),
  -- Contrainte : Les deux déclarations doivent être différentes
  CONSTRAINT different_declarations CHECK (declaration_id_1 != declaration_id_2)
);

-- Index pour améliorer les performances
CREATE INDEX idx_matches_declaration_1 ON matches(declaration_id_1);
CREATE INDEX idx_matches_declaration_2 ON matches(declaration_id_2);
CREATE INDEX idx_matches_person_hash ON matches(person_hash);

-- Activer RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour matches
-- Les utilisateurs peuvent voir les matches concernant leurs déclarations
CREATE POLICY "Users can view their own matches"
ON matches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM declarations
    WHERE (declarations.id = matches.declaration_id_1 OR declarations.id = matches.declaration_id_2)
    AND declarations.user_id = auth.uid()
  )
);

-- Politique pour mettre à jour le statut de notification
CREATE POLICY "Users can update notification status"
ON matches
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM declarations
    WHERE (declarations.id = matches.declaration_id_1 OR declarations.id = matches.declaration_id_2)
    AND declarations.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM declarations
    WHERE (declarations.id = matches.declaration_id_1 OR declarations.id = matches.declaration_id_2)
    AND declarations.user_id = auth.uid()
  )
);

-- =============================================================================
-- 5. FONCTION POUR GÉNÉRER LE HASH D'UNE PERSONNE
-- =============================================================================

CREATE OR REPLACE FUNCTION generate_person_hash(
  p_first_name TEXT,
  p_last_name TEXT,
  p_country TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  normalized_first TEXT;
  normalized_last TEXT;
  normalized_country TEXT;
  combined TEXT;
  hash_result TEXT;
BEGIN
  -- Normalise les données : lowercase, trim
  normalized_first := LOWER(TRIM(p_first_name));
  normalized_last := LOWER(TRIM(p_last_name));
  normalized_country := LOWER(TRIM(p_country));
  
  -- Supprime les accents (utilise unaccent si disponible)
  BEGIN
    normalized_first := unaccent(normalized_first);
    normalized_last := unaccent(normalized_last);
    normalized_country := unaccent(normalized_country);
  EXCEPTION WHEN undefined_function THEN
    -- Si unaccent n'est pas disponible, on continue sans
    NULL;
  END;
  
  -- Combine les données avec un séparateur
  combined := normalized_first || '|' || normalized_last || '|' || normalized_country;
  
  -- Génère le hash SHA-256
  hash_result := encode(digest(combined, 'sha256'), 'hex');
  
  RETURN hash_result;
END;
$$;

-- Permissions pour la fonction
GRANT EXECUTE ON FUNCTION generate_person_hash(TEXT, TEXT, TEXT) TO anon, authenticated;

-- =============================================================================
-- 6. FONCTION POUR OBTENIR LES STATISTIQUES GLOBALES
-- =============================================================================

CREATE OR REPLACE FUNCTION get_global_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_declarations BIGINT,
  total_matches BIGINT
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM profiles)::BIGINT,
    (SELECT COUNT(*) FROM declarations WHERE is_active = true)::BIGINT,
    (SELECT COUNT(*) FROM matches)::BIGINT;
END;
$$;

-- Permissions pour la fonction
GRANT EXECUTE ON FUNCTION get_global_stats() TO anon, authenticated;

-- =============================================================================
-- 7. TRIGGER POUR DÉTECTER AUTOMATIQUEMENT LES MATCHES
-- =============================================================================

CREATE OR REPLACE FUNCTION check_for_matches()
RETURNS TRIGGER AS $$
DECLARE
  matching_declaration_id UUID;
BEGIN
  -- Chercher une autre déclaration active avec le même person_hash
  -- mais d'un utilisateur différent
  SELECT id INTO matching_declaration_id
  FROM declarations
  WHERE person_hash = NEW.person_hash
    AND user_id != NEW.user_id
    AND is_active = true
    AND id != NEW.id
  LIMIT 1;

  -- Si on trouve un match, créer l'entrée dans la table matches
  IF matching_declaration_id IS NOT NULL THEN
    INSERT INTO matches (declaration_id_1, declaration_id_2, person_hash)
    VALUES (NEW.id, matching_declaration_id, NEW.person_hash)
    ON CONFLICT DO NOTHING; -- Éviter les doublons
    
    -- On pourrait aussi inverser l'ordre pour être sûr
    INSERT INTO matches (declaration_id_1, declaration_id_2, person_hash)
    VALUES (matching_declaration_id, NEW.id, NEW.person_hash)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'exécute après l'insertion d'une déclaration
DROP TRIGGER IF EXISTS after_declaration_insert ON declarations;
CREATE TRIGGER after_declaration_insert
  AFTER INSERT ON declarations
  FOR EACH ROW
  EXECUTE FUNCTION check_for_matches();

-- =============================================================================
-- 8. FONCTION POUR METTRE À JOUR LES COMPTEURS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le nombre de déclarations
  UPDATE profiles
  SET total_declarations = (
    SELECT COUNT(*)
    FROM declarations
    WHERE user_id = profiles.id AND is_active = true
  )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour les stats automatiquement
DROP TRIGGER IF EXISTS update_declaration_count ON declarations;
CREATE TRIGGER update_declaration_count
  AFTER INSERT OR UPDATE OR DELETE ON declarations
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- =============================================================================
-- 9. VÉRIFICATION DE LA CONFIGURATION
-- =============================================================================

-- Vérifier que toutes les tables existent
SELECT 'Tables créées:' AS status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'declarations', 'matches')
ORDER BY table_name;

-- Vérifier que les politiques RLS sont actives
SELECT 'Politiques RLS:' AS status;
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Vérifier que les fonctions existent
SELECT 'Fonctions créées:' AS status;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN ('generate_person_hash', 'get_global_stats', 'handle_new_user', 'check_for_matches', 'update_user_stats')
ORDER BY routine_name;

-- Message de succès
SELECT '✅ Base de données reconstruite avec succès !' AS status;
