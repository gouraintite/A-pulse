# AXA-pulse

plateforme interne de feedback 360deg pour collaborateurs

> projet visant a mimer un produit potentiel de la direction IT, équipe functions supports de chez AXA France, Stack utilisé: TypeScript, React 19 | C# .NET, ASP NET 8 core, Docker, CI/CD, test units et integrations, SQL et bonne pratique  d'ingénierie.

## Ojectif

AXA-pulse permet à des managers ou RH de lancer des campagne de feedback 360deg sur un collaborateur afin de recolte les avis de ses N+1 et N-1, de façon anonyme, sécurisé et aidé d'un dashboard de suivi

## Architecture

\`\`\`
axa-pulse/
|-- backend/ -> ASP Net 8 core (C# .Net)
|-- Frontend/ -> SPA React 19 (TypeScript)
|-- Docker/ -> Dockerfiles and dockercompose
|-- docs/  -> Documentation technique 
|-- .github/ -> Versionning, workflow CI/CD github action
\`\`\`

\`\`\`
axa-pulse/
├── backend/        → API ASP.NET Core 8 (C#)
├── frontend/       → SPA React 19 + TypeScript
├── docker/         → Dockerfiles et docker-compose
├── docs/           → Documentation technique
└── .github/        → Workflows CI/CD GitHub Actions
\`\`\`

##Stack technique

### Backend
- ASP Net core 8 for REST API
- Entity framework core 8 (ORM)
- SQL server 2022 pour BD
- JWT pout l'authentification
- xUnit + Moq pour les test unitaires 
- Swagger et OpenAPI pour la documentation d'API

### Frontend
- React 19 avec Typescript pour la base
- Tailwind css pour le styling
- React router pour le routing
- Axios pour le fetching avec l'api
- Vite comme bundler
- Vitest + React testing library pour les tests 	

### Devops
- Docker + dockercompose
- github action + CI/CD


## Bonne Pratiques d'ingénierie appliqués
- application du TDD
- code review sur soi même et bonne pratique clean code
- Documentation automatique avec Swagger 
- Pipeline CI/CD pour tester et deployer automatiquement
- Contenarisation complète back, front, BD

##  Roadmap

- Étape 1 — Setup & architecture du projet
- Étape 2 — Backend ASP.NET Core (squelette + premiers endpoints)
- Étape 3 — Authentification JWT + SSO
- Étape 4 — Frontend React 19 + TypeScript
- Étape 5 — Connexion front ↔ back, première feature complète
- Étape 6 — Tests unitaires et d'intégration
- Étape 7 — Dockerisation
- Étape 8 — CI/CD GitHub Actions

##  Auteur

**Rainsong Ngoutsop** — [Portfolio](https://rainsong-n.vercel.app) · [GitHub](https://github.com/gouraintite) · [LinkedIn](https://linkedin.com/in/rainsong-ngoutsop)
