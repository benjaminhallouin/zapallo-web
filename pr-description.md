# Add Mandatory Exchange Filter and Sorting UI

## 🎯 Objectif
Modifier la page de liste des ExchangeUsers pour exiger un filtre exchange obligatoire et ajouter des contrôles de tri côté UI.

## 🔧 Changements

### API Client (`lib/api/exchangeUsers.ts`)
- Ajout de l'interface `GetExchangeUsersParams` avec support de `exchange_id`, `sort_by`, `sort_order`
- Modification de `getExchangeUsers()` pour accepter des paramètres optionnels
- Construction dynamique de la query string avec URLSearchParams

### Page Liste (`app/exchange-users/page.tsx`)
- **Filtre Exchange Obligatoire**: L'utilisateur doit sélectionner un exchange avant de voir les users
- **Auto-sélection**: Le premier exchange est auto-sélectionné si disponible
- **Contrôles de Tri**:
  - Sort By: name, external_user_id, created_at, updated_at
  - Sort Order: asc, desc
- **États de Chargement Séparés**:
  - `loading` pour exchanges
  - `loadingUsers` pour users
- **Message d'invite**: "Please select an exchange to view users" quand aucun exchange sélectionné
- **Désactivation des contrôles**: Sort disabled si pas d'exchange sélectionné

## 📋 Comportement
1. Au chargement: Récupération des exchanges, auto-sélection du premier
2. Sélection exchange: Récupération des users avec tri par défaut (created_at desc)
3. Changement de tri: Nouvelle récupération des users avec les nouveaux paramètres
4. Pas d'exchange sélectionné: Liste vide, message d'invite

## 🔗 Liens
- Epic: EPIC-003 - ExchangeUser Management
- Related PR (API): https://github.com/benjaminhallouin/zapallo/pull/100
