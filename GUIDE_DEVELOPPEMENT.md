# Guide de Développement - SSPE Monorepo

## 🏗️ Structure du Projet

```
sspe_monorepo/
├── apps/
│   ├── backend/          # API Express + TypeORM
│   └── frontend/         # React + Vite + TailwindCSS
├── libs/                 # Bibliothèques partagées
└── tools/               # Outils de développement
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- pnpm 8+
- MySQL/MariaDB

### Installation

```bash
# Installer les dépendances
pnpm install

# Démarrer les deux applications
pnpm dev

# Ou séparément
pnpm dev:frontend
pnpm dev:backend
```

### Configuration Backend

1. Copier `.env.example` vers `.env` dans `apps/backend/`
2. Configurer la base de données dans `ormconfig.json`
3. Lancer les migrations si nécessaire

## 📦 Stack Technique

### Backend
- **Express 5** - Framework web
- **TypeORM** - ORM pour MySQL
- **TypeScript** - Typage statique
- **Multer** - Upload de fichiers

### Frontend
- **React 19** - Bibliothèque UI
- **Vite** - Build tool
- **TanStack Query** - Gestion d'état serveur
- **Zustand** - Gestion d'état local
- **TailwindCSS** - Styling
- **shadcn/ui** - Composants UI
- **Recharts** - Graphiques
- **Lucide React** - Icônes

## 🔌 API Endpoints

### Teachers
```
GET    /api/teachers              - Liste des enseignants
GET    /api/teachers/:id          - Détails d'un enseignant
POST   /api/teachers              - Créer un enseignant
PUT    /api/teachers/:id          - Modifier un enseignant
PUT    /api/teachers/archive/:id  - Archiver un enseignant
DELETE /api/teachers/:id          - Supprimer un enseignant
POST   /api/teachers/upload       - Upload document enseignant
```

### Institutions
```
GET    /api/institutions          - Liste des institutions
GET    /api/institutions/:id      - Détails d'une institution
POST   /api/institutions          - Créer une institution
PUT    /api/institutions/:id      - Modifier une institution
DELETE /api/institutions/:id      - Supprimer une institution
```

### Advancements
```
GET    /api/advancements          - Liste des avancements
GET    /api/advancements/:id      - Détails d'un avancement
POST   /api/advancements          - Créer un avancement
PUT    /api/advancements/:id      - Modifier un avancement
DELETE /api/advancements/:id      - Supprimer un avancement
```

### Impediments
```
GET    /api/impediments           - Liste des empêchements
GET    /api/impediments/:id       - Détails d'un empêchement
POST   /api/impediments           - Créer un empêchement
PUT    /api/impediments/:id       - Modifier un empêchement
DELETE /api/impediments/:id       - Supprimer un empêchement
```

### Notes
```
GET    /api/notes                 - Liste des notes
POST   /api/notes                 - Créer une note
PUT    /api/notes/:id             - Modifier une note
DELETE /api/notes/:id             - Supprimer une note
```

### Documents
```
GET    /api/docs                  - Liste des documents
POST   /api/docs                  - Upload un document
DELETE /api/docs/:id              - Supprimer un document
```

## 🎨 Composants UI Principaux

### Graphiques
- `TeacherBarChart` - Répartition par grade et institution
- `SchoolPieChart` - Répartition dans les écoles
- `FacultyPieChart` - Répartition dans les facultés

### Forms
- `TeacherForm` - Formulaire enseignant
- `InstitutionForm` - Formulaire institution
- `ImpedimentForm` - Formulaire empêchement
- `NoteForm` - Formulaire note

### Navigation
- `AppSidebar` - Menu latéral
- `Header` - En-tête avec breadcrumb

## 🔄 Hooks Personnalisés

### Data Fetching
```typescript
// Enseignants
const { Teachers, isLoading, addTeacher, updateTeacher, deleteTeacher } = useTeachers();

// Institutions
const { Institutions, isLoading, addInstitution, updateInstitution } = useInstitutions();

// Avancements
const { Advancements, isLoading, addAdvancement } = useAdvancements();

// Empêchements
const { Impediments, isLoading, addImpediment } = useImpediments();

// Notes
const { Notes, isLoading, addNote } = useNotes();
```

### Stores Zustand
```typescript
// Actions utilisateur
const addAction = useActionsStore((state) => state.addAction);
const todayActions = useActionsStore((state) => state.getTodayActions());

// Période d'avancement
const { period, setPeriod } = useAdvancementPeriodStore();

// Navigation
const { pathname, setPathname } = usePathname();
```

## 📝 Ajouter le Tracking d'Actions

Pour traquer une action utilisateur:

```typescript
import { useActionsStore } from "@/stores/useActionsStore";
import { FaUserPlus } from "react-icons/fa6";

const addAction = useActionsStore((state) => state.addAction);

// Dans votre mutation
onSuccess: () => {
  addAction({
    name: "Enseignant ajouté",
    icon: FaUserPlus,
  });
}
```

## 🎯 Conventions de Code

### Naming
- **Components**: PascalCase (ex: `TeacherForm.tsx`)
- **Hooks**: camelCase avec préfixe `use` (ex: `useTeachers.ts`)
- **Stores**: camelCase avec préfixe `use` et suffixe `Store` (ex: `useActionsStore.ts`)
- **Types**: PascalCase (ex: `Teacher`, `Institution`)

### File Organization
```
src/
├── app/              # Configuration de l'app
├── components/       # Composants réutilisables
├── hooks/           # Hooks personnalisés
├── interfaces/      # Types TypeScript
├── lib/             # Utilitaires
├── pages/           # Pages de l'application
├── sections/        # Sections de pages
└── stores/          # Stores Zustand
```

### Imports
```typescript
// Externe d'abord
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Puis interne avec alias @/
import { Button } from "@/components/ui/button";
import { useTeachers } from "@/hooks/useTeachers";
```

## 🧪 Testing

```bash
# Tests unitaires (à configurer)
pnpm test

# Tests E2E (à configurer)
pnpm test:e2e
```

## 📦 Build & Deploy

```bash
# Build tout
pnpm build

# Build frontend uniquement
cd apps/frontend && pnpm build

# Build backend uniquement
cd apps/backend && pnpm build
```

## 🐛 Debugging

### Backend
- Logs dans la console
- Utiliser `console.log()` dans les controllers
- Vérifier les erreurs dans `errorMiddleware.ts`

### Frontend
- React DevTools
- TanStack Query DevTools (à activer)
- Console du navigateur

## 🔐 Sécurité

### Backend
- ✅ Validation des données d'entrée
- ⚠️ TODO: Authentification JWT
- ⚠️ TODO: Autorisation basée sur les rôles
- ⚠️ TODO: Rate limiting

### Frontend
- ✅ Validation des formulaires
- ✅ Sanitization des entrées
- ⚠️ TODO: Protection CSRF

## 📚 Ressources

- [React Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query)
- [TypeORM](https://typeorm.io)
- [shadcn/ui](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com)

## 🤝 Contributing

1. Créer une branche feature
2. Faire les modifications
3. Tester localement
4. Créer une Pull Request
5. Attendre la review

## 📞 Support

Pour toute question, contacter l'équipe de développement.
