# SSPE — Suivi des Statuts Professionnels des Enseignants

Application web de gestion de carrière des enseignants de l'Université de Ngaoundéré : suivi des avancements, gestion des dossiers administratifs, et génération de documents PDF.

## ✨ Fonctionnalités

- Gestion des profils enseignants et de leur progression de carrière
- Tableau de bord avec indicateurs et graphiques
- Génération de rapports et documents au format PDF
- Formulaires de saisie et de mise à jour des dossiers

## 🛠️ Stack technique

- **Monorepo** géré avec [Turborepo](https://turbo.build/) et **pnpm workspaces**
- **TypeScript** sur l'ensemble du projet
- Bibliothèque UI partagée (`libs/ui`)

## 📁 Structure du projet

```
sspe_monorepo/
├── apps/           # Applications (frontend, backend...)
├── libs/
│   └── ui/         # Composants UI partagés
├── docs/           # Notes techniques et guides de développement
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 🚀 Installation

Prérequis : Node.js ≥ 18 et [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/Bryand237/sspe_monorepo.git
cd sspe_monorepo
pnpm install
```

## ▶️ Lancer le projet en développement

```bash
pnpm dev
```

## 🧪 Tests

```bash
pnpm test
```

## 📄 Documentation

Les notes de développement détaillées (guide de développement, correctifs, historique des améliorations) se trouvent dans le dossier [`/docs`](./docs).

## 👤 Auteur

Djounkam Pandong Géraud Bryand — [@Bryand237](https://github.com/Bryand237)
