# SénEvent

## En ligne

- Application web : https://senevent-six.vercel.app
- Application Android (APK) : https://expo.dev/accounts/labotech221/projects/senevent/builds/4c0fd5f9-5db3-4540-9fb1-d2b475510a76
- Version mobile : 1.0.0 (profil EAS "preview")
- Déploiement continu : chaque merge sur main met la production du web à jour, chaque Pull Request reçoit une URL de prévisualisation.

## Lancer le projet en local

- npm install à la racine
- Web : dans apps/web, créer .env.local avec les deux variables Supabase (URL et clé anon) (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY), puis npm run dev
- Mobile : dans apps/mobile, créer .env avec les deux variables Supabase (URL et clé anon) (EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY), puis npx expo start
