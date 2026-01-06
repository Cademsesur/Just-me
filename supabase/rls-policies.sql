-- Politiques RLS pour la table declarations
-- À exécuter dans le SQL Editor de Supabase

-- Active RLS sur la table declarations (si pas déjà fait)
ALTER TABLE declarations ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leurs propres déclarations
CREATE POLICY "Users can view their own declarations"
ON declarations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent créer leurs propres déclarations
CREATE POLICY "Users can create their own declarations"
ON declarations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres déclarations
CREATE POLICY "Users can update their own declarations"
ON declarations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres déclarations
CREATE POLICY "Users can delete their own declarations"
ON declarations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Vérifier que les politiques sont bien créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'declarations';
