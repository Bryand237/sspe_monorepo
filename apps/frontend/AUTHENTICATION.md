# Système d'Authentification - SSPE

## Vue d'ensemble

Le système d'authentification protège toutes les routes de l'application et nécessite que les utilisateurs se connectent avant d'accéder au contenu.

## Architecture

### 1. **AuthContext** (`/src/contexts/AuthContext.tsx`)
Contexte React qui gère l'état d'authentification global :
- Stockage de l'utilisateur connecté
- Vérification de session au chargement
- Gestion de la connexion/déconnexion
- Persistance dans localStorage
- Note: La navigation après déconnexion est gérée par les composants individuels

### 2. **useAuth Hook** (`/src/hooks/useAuth.ts`)
Hook personnalisé pour accéder facilement au contexte d'authentification :
```typescript
const { user, isAuthenticated, login, logout, isLoading } = useAuth();
```

### 3. **ProtectedRoute** (`/src/components/ProtectedRoute.tsx`)
Composant wrapper qui :
- Vérifie l'authentification avant d'afficher une route
- Redirige vers `/login` si non authentifié
- Affiche un loader pendant la vérification
- Préserve l'URL de destination pour redirection après login

### 4. **Login Page** (`/src/pages/Login.tsx`)
Page de connexion avec :
- Formulaire validé par react-hook-form
- Interface moderne et responsive
- Gestion des erreurs
- Redirection automatique après connexion

## Utilisation

### Identifiants de test
```
Username: admin
Password: admin
```

### Protection des routes
Les routes sont protégées dans `App.tsx` :
```tsx
<ProtectedRoute>
  <Layout />
</ProtectedRoute>
```

### Accès à l'authentification dans les composants
```tsx
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div>
      {user && <p>Bonjour {user.username}</p>}
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}
```

## Bouton de déconnexion

Le bouton de déconnexion se trouve dans le Header (coin supérieur droit) :
- Affiche le nom d'utilisateur
- Menu déroulant avec option de déconnexion
- Redirige automatiquement vers `/login` après déconnexion

## Workflow

1. **Utilisateur non connecté** → Redirigé vers `/login`
2. **Connexion réussie** → Token stocké dans localStorage
3. **Navigation** → Accès complet à toutes les routes
4. **Déconnexion** → Token supprimé, redirigé vers `/login`
5. **Rechargement page** → Session restaurée depuis localStorage

## Intégration Backend (TODO)

Pour connecter à une vraie API :

1. Modifier `AuthContext.tsx` ligne 41-51 :
```typescript
const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await ky.post('auth/login', {
      json: { username, password }
    }).json<{ user: User; token: string }>();
    
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    return true;
  } catch (error) {
    return false;
  }
};
```

2. Ajouter l'intercepteur de token dans `ky.ts` :
```typescript
const api = ky.create({
  prefixUrl: BASE_URL,
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ]
  }
});
```

## Sécurité

- ✅ Toutes les routes protégées par défaut
- ✅ Session persistante (localStorage)
- ✅ Redirection automatique si non authentifié
- ⚠️ TODO: Implémenter vérification token avec backend
- ⚠️ TODO: Ajouter refresh token
- ⚠️ TODO: Gérer expiration de session
