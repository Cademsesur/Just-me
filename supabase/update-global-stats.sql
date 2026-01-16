-- ========================================
-- MISE À JOUR STATS GLOBALES (BOOST RÉALISTE)
-- ========================================
-- Utilisateurs: +1000
-- Déclarations: +500
-- Matchs: +100

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS get_global_stats();

-- Créer la fonction avec boost réaliste
CREATE OR REPLACE FUNCTION get_global_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_declarations BIGINT,
  total_matches BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (COUNT(DISTINCT p.id) + 1000)::BIGINT as total_users,
    (COUNT(DISTINCT d.id) + 500)::BIGINT as total_declarations,
    (COUNT(DISTINCT m.id) + 100)::BIGINT as total_matches
  FROM public.profiles p
  LEFT JOIN public.declarations d ON TRUE
  LEFT JOIN public.matches m ON TRUE;
END;
$$;

-- Tester la fonction
SELECT * FROM get_global_stats();

SELECT '✅ Stats boostées: Utilisateurs +1000, Déclarations +500, Matchs +100' as status;
