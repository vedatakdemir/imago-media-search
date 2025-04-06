# Imago Media Search

## Overview

This is a full-stack media search application that queries an existing Elasticsearch index and presents the data through a responsive and user-friendly interface. It is optimized for fast keyword-based search, pagination, sorting, and ease of use — all while gracefully handling unstructured data.

The backend serves as a lightweight API to the Elasticsearch server, and the frontend consumes this API to deliver a smooth user experience.

---

## Features

- Keyword-based media search
- Sort by date (ascending/descending)
- Pagination with 48 items per page
- Handles missing/unstructured fields gracefully
- Built-in loading and error states
- Clean and responsive Ant Design-based UI
- Docker-ready (or run locally)
- Unit tests for key states: loading, success, error, empty, pagination

---

## Technologies Used

### Backend

- Node.js + Express.js
- `node-fetch` for Elasticsearch calls
- Dotenv for config
- Basic Auth for secured Elasticsearch access

### Frontend

- React + TypeScript + Vite
- Ant Design components
- React Query (API state/cache)
- React Router (for query params)

### Testing

- Jest
- React Testing Library
- `user-event` for interaction simulation

### DevOps

- Docker & Docker Compose

---

## Getting Started

### Local Development

#### Backend

```bash
cd backend
npm install
npm run dev
```

Runs at: `http://localhost:3001`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

Make sure the frontend uses:

```ts
baseURL: "http://localhost:3001/search";
```

---

### Dockerized Setup

```bash
docker-compose up --build
```

Runs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

To stop and clean:

```bash
docker-compose down -v
```

---

## API Reference

### Endpoint: `/search`

**Method:** `GET`

#### Query Parameters:

- `q`: keyword (optional)
- `from`: pagination offset
- `size`: results per page (default 48)
- `sort`: `asc` or `desc` (by date)

#### Example:

```
/search?q=cycling&from=0&size=48&sort=desc
```

---

## Data Mapping & Normalization

### Sample Elasticsearch Record

```json
{
  "bildnummer": "1041956464",
  "datum": "2024-03-05T00:00:00.000Z",
  "suchtext": "Paris Nice 2024 Stage 3...",
  "fotografen": "Photo News",
  "db": "sport"
}
```

### Current Mapping:

- `id`: mapped from `bildnummer`
- `title`: mapped from `suchtext`
- `photographer`: from `fotografen`
- `date`: from `datum`
- `imageUrl`: constructed via custom logic

### Image URL Format:

```
https://www.imago-images.de/bild/{DB}/{MEDIA_ID_PADDED}/s.jpg
```

### Graceful Fallbacks:

- Missing fields default to `""`
- `suchtext` used as a catch-all for title/description
- Frontend UI handles empty or broken data gracefully

### Suggested Improvements:

- Use NLP or regex to extract structured fields from `suchtext`
- Improve Elasticsearch mappings with analyzed fields
- Add autocomplete and synonym support

---

## Testing

Tests are located in:

- `frontend/src/App.test.tsx`
- `frontend/components/MediaCard.test.tsx`

### Covered Cases:

- Spinner during loading
- API error shows fallback message
- Results render properly
- Pagination triggers new results
- Empty search shows "No results"

### Run:

```bash
cd frontend
npm test
```

---

## Problem Identification & Solution Proposal

### Problem

- The Elasticsearch data doesn't return separate structured fields like `title` or `description`
- Instead, there's a single field called `suchtext`, which is a large unstructured blob — it contains lots of details mashed together
- Because of this, we can’t do very precise or field-specific searching
- For example, searching by keyword might return lots of loosely relevant results just because the word appeared somewhere in `suchtext`

### Impact

- Users may not always find exactly what they’re looking for
- The UI can become cluttered with extra or unrelated results
- The backend has to search a large, unstructured field, which is less efficient and puts more load on Elasticsearch

### Solution:

- **Preprocessing**: Clean `suchtext` before indexing (split into fields)
- **Mappings**: Define custom field mappings + analyzers in Elasticsearch
- **Caching**: Introduce Redis cache for repeated queries
- **Rate Limiting**: Add middleware like `express-rate-limit`

---

## Scalability & Maintainability

### Scalability:

- `from` + `size` pagination is already optimized for shallow paging
- Elasticsearch query supports fuzzy logic + sorting
- Future ideas:
  - Use `search_after` or `scroll` for deep paging
  - Redis cache for common or slow queries
  - Lazy load images to reduce DOM load

### Maintainability

- The frontend is cleanly separated into modular components like `App`, `MediaCard`, and `api.ts`
- The backend keeps things organized: routing, Elasticsearch query building, and response transformation are handled in different parts of the codebase
- **External Provider Support**:
  - In the future, more image providers might be added — and each might return data in different formats
  - To keep things maintainable, we suggest normalizing all incoming provider data to a **common internal format** before sending it to the frontend
  - This normalization can happen with small adapter/transformer functions for each provider on the backend
  - For example: one provider might call the date field `publishedAt`, another might call it `created`, but we always map it to `date` internally
  - `.env` config allows credentials, host URLs, and other provider-specific settings to stay separate
  - If we need to query multiple indexes, we can extend the backend to:
    - search multiple indices in a single request (via ES multi-index search)
    - or filter the data source using a `provider` flag and route the query accordingly

## Design Considerations

- **Focus on frontend usability**: clean UI, consistent spacing, responsive layout
- **Minimal backend**: just enough to securely call Elasticsearch and format results
- **Modular code**: media card, API helpers, pagination logic are reusable
- **Configurable**: API URLs and Elasticsearch credentials are environment-based
- **Dev experience**: Docker makes it easy to spin up for reviewers

---

## Limitations

- While Elasticsearch is secured with Basic Auth, the API endpoint itself is publicly accessible without authentication or rate limiting.
- Elasticsearch query is basic (no fuzzy logic)

---

## Author

**Vedat Akdemir**  
[vedatakdemir17@gmail.com](mailto:vedatakdemir17@gmail.com)  
Berlin, Germany
