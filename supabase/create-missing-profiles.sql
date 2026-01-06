-- Script pour créer les profils manquants pour les utilisateurs existants
-- À exécuter dans le SQL Editor de Supabase

-- Créer les profils pour tous les utilisateurs qui n'en ont pas encore
INSERT INTO public.profiles (id, email, full_name, avatar_url, provider, last_sign_in_at)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name',
  au.raw_user_meta_data->>'avatar_url',
  au.raw_user_meta_data->>'provider',
  au.last_sign_in_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- Vérifier que ton profil existe maintenant
SELECT id, email, full_name, created_at 
FROM profiles
ORDER BY created_at DESC;

-- Message de succès
SELECT '✅ Profils créés pour tous les utilisateurs existants !' AS status;
