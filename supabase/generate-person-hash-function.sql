-- Fonction pour générer un hash de personne pour le matching anonyme
-- À exécuter dans le SQL Editor de Supabase (optionnel, le hash se fait maintenant côté client)

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
  
  -- Supprime les accents (utilise unaccent si disponible, sinon fait de son mieux)
  -- Note: Nécessite l'extension unaccent: CREATE EXTENSION IF NOT EXISTS unaccent;
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

-- Accorde les permissions d'exécution
GRANT EXECUTE ON FUNCTION generate_person_hash(TEXT, TEXT, TEXT) TO anon, authenticated;

-- Exemple d'utilisation:
-- SELECT generate_person_hash('Marie', 'Dupont', 'France');
