-- Algorithme de matching flou avec score de similarité
-- Cette approche détecte les matches même avec des variations de noms

-- Extension nécessaire pour la similarité de texte
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Fonction pour calculer le score de similarité entre deux personnes
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
BEGIN
  -- Le pays doit être exactement le même
  country_match := LOWER(TRIM(country_1)) = LOWER(TRIM(country_2));
  
  IF NOT country_match THEN
    RETURN 0.0;
  END IF;
  
  -- Calcul de similarité pour les prénoms (trigram)
  first_name_score := similarity(
    LOWER(TRIM(first_name_1)),
    LOWER(TRIM(first_name_2))
  );
  
  -- Calcul de similarité pour les noms
  last_name_score := similarity(
    LOWER(TRIM(last_name_1)),
    LOWER(TRIM(last_name_2))
  );
  
  -- Score final = moyenne pondérée (nom de famille plus important)
  final_score := (first_name_score * 0.4) + (last_name_score * 0.6);
  
  RETURN final_score;
END;
$$;

-- Fonction pour détecter les matches avec seuil de similarité
CREATE OR REPLACE FUNCTION check_for_fuzzy_matches()
RETURNS TRIGGER AS $$
DECLARE
  potential_match RECORD;
  match_score FLOAT;
  threshold FLOAT := 0.7; -- 70% de similarité minimum
BEGIN
  -- Chercher toutes les déclarations d'autres utilisateurs dans le même pays
  FOR potential_match IN
    SELECT id, user_id, first_name, last_name, country
    FROM declarations
    WHERE user_id != NEW.user_id
      AND is_active = true
      AND LOWER(TRIM(country)) = LOWER(TRIM(NEW.country))
  LOOP
    -- Calculer le score de similarité
    match_score := calculate_person_similarity(
      NEW.first_name,
      NEW.last_name,
      NEW.country,
      potential_match.first_name,
      potential_match.last_name,
      potential_match.country
    );
    
    -- Si le score dépasse le seuil, créer un match
    IF match_score >= threshold THEN
      -- Créer le match avec le score
      INSERT INTO matches (
        declaration_id_1,
        declaration_id_2,
        person_hash, -- On stocke le score ici temporairement
        match_score,
        created_at
      )
      VALUES (
        NEW.id,
        potential_match.id,
        NEW.person_hash, -- Hash de la nouvelle déclaration
        match_score,
        NOW()
      )
      ON CONFLICT DO NOTHING;
      
      -- Log pour debug
      RAISE NOTICE 'Match trouvé ! Score: % entre "% %" et "% %"',
        match_score,
        NEW.first_name, NEW.last_name,
        potential_match.first_name, potential_match.last_name;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemples de scores :
-- "Marie" vs "Marie" = 1.0 (100%)
-- "Marie" vs "Marie-Anne" = 0.6-0.7 (60-70%)
-- "Marie" vs "Anne" = 0.0-0.2 (0-20%)
-- "Dupont" vs "Dupond" = 0.83 (83%)
-- "Dupont" vs "Durant" = 0.33 (33%)
