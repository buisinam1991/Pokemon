# Pokémon Explorer

A Next.js application that displays a list of Pokémon with pagination and type filtering using the [PokéAPI](https://pokeapi.co/).

## Features

- Display a list of Pokémon with pagination
- Filter Pokémon by type
- Responsive design
- Server and Client Components properly implemented
- TypeScript for type safety

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PokéAPI

## Server vs Client Components

This project demonstrates the proper use of Server and Client Components in Next.js:

### Server Components
- `app/page.tsx` - Main page component that fetches data
- `components/pokemon-list.tsx` - Displays the list of Pokémon
- `app/pokemon/[id]/page.tsx` - Individual Pokémon detail page
- `lib/pokemon.ts` - API integration functions

### Client Components
- `components/pokemon-type-filter.tsx` - Interactive filter for Pokémon types
- `components/pagination.tsx` - Client-side pagination controls

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
