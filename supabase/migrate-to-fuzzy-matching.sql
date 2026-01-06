-- Migration pour ajouter le fuzzy matching à une base existante
-- Si tu as déjà des données et ne veux pas tout effacer

-- 1. Ajouter la colonne match_score si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'matches' AND column_name = 'match_score'
    ) THEN
        ALTER TABLE matches ADD COLUMN match_score FLOAT DEFAULT 1.0;
    END IF;
END $$;

-- 2. Activer l'extension pour la similarité
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 3. Créer la fonction de calcul de similarité
CREATE OR REPLACE FUNCTION calculate_person_similarity(
  first_name_1 TEXT,
  last_name_1 TEXT,
  country_1 TEXT,
  first_name_2 TEXT,
  last_name_2 TEXT,
  country_2 TEXT
)
RETURNS FLOAT
LANGUAGE plpgsql
AS $$
DECLARE
  first_name_score FLOAT;
  last_name_score FLOAT;
  country_match BOOLEAN;
  final_score FLOAT;
  normalized_first_1 TEXT;
  normalized_first_2 TEXT;
  normalized_last_1 TEXT;
  normalized_last_2 TEXT;
BEGIN
  -- Le pays doit être exactement le même
  country_match := LOWER(TRIM(country_1)) = LOWER(TRIM(country_2));
  
  IF NOT country_match THEN
    RETURN 0.0;
  END IF;
  
  -- Normalisation
  normalized_first_1 := LOWER(TRIM(REGEXP_REPLACE(first_name_1, '\s+', ' ', 'g')));
  normalized_first_2 := LOWER(TRIM(REGEXP_REPLACE(first_name_2, '\s+', ' ', 'g')));
  normalized_last_1 := LOWER(TRIM(REGEXP_REPLACE(last_name_1, '\s+', ' ', 'g')));
  normalized_last_2 := LOWER(TRIM(REGEXP_REPLACE(last_name_2, '\s+', ' ', 'g')));
  
  -- Calcul de similarité (trigram)
  first_name_score := similarity(normalized_first_1, normalized_first_2);
  last_name_score := similarity(normalized_last_1, normalized_last_2);
  
  -- Score final = moyenne pondérée
  final_score := (first_name_score * 0.4) + (last_name_score * 0.6);
  
  RETURN final_score;
END;
$$;

-- 4. Recréer le trigger avec fuzzy matching
DROP TRIGGER IF EXISTS after_declaration_insert ON declarations;

CREATE OR REPLACE FUNCTION check_for_matches()
RETURNS TRIGGER AS $$
DECLARE
  potential_match RECORD;
  match_score FLOAT;
  threshold FLOAT := 0.70;
BEGIN
  FOR potential_match IN
    SELECT id, user_id, first_name, last_name, country, person_hash
    FROM declarations
    WHERE user_id != NEW.user_id
      AND is_active = true
      AND LOWER(TRIM(country)) = LOWER(TRIM(NEW.country))
      AND id != NEW.id
  LOOP
    match_score := calculate_person_similarity(
      NEW.first_name,
      NEW.last_name,
      NEW.country,
      potential_match.first_name,
      potential_match.last_name,
      potential_match.country
    );
    
    IF match_score >= threshold THEN
      INSERT INTO matches (
        declaration_id_1,
        declaration_id_2,
        person_hash,
        match_score
      )
      VALUES (
        NEW.id,
        potential_match.id,
        NEW.person_hash,
        match_score
      )
      ON CONFLICT (declaration_id_1, declaration_id_2) DO NOTHING;
      
      RAISE NOTICE 'Match trouvé ! Score: % entre "% %" et "% %"',
        ROUND(match_score::numeric, 2),
        NEW.first_name, NEW.last_name,
        potential_match.first_name, potential_match.last_name;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_declaration_insert
  AFTER INSERT ON declarations
  FOR EACH ROW
  EXECUTE FUNCTION check_for_matches();

-- 5. Vérifier l'installation
SELECT '✅ Fuzzy matching installé avec succès !' AS status;
SELECT 'Extension pg_trgm activée' AS check
WHERE EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm');

-- Test de similarité
SELECT 
  'Marie' AS nom1,
  'Marie-Anne' AS nom2,
  similarity('marie', 'marie-anne') AS score,
  CASE 
    WHEN similarity('marie', 'marie-anne') >= 0.7 THEN '✅ Match'
    ELSE '❌ No match'
  END AS resultat;
