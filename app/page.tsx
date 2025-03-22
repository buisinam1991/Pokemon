import { Suspense } from "react"
import PokemonList from "@/components/pokemon-list-server"
import PokemonTypeFilter from "@/components/pokemon-type-filter"
import Pagination from "@/components/pagination-server"
import { getPokemonList, getPokemonTypes } from "@/lib/pokemon"
import { API_CONFIG } from "@/constants/api"
import LoadingPokemon from "@/components/loading-pokemon"

// Set revalidation time to 1 hour
export const revalidate = 3600

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; type?: string }
}) {
  // Get page and type from search params
  const page = Number(searchParams.page) || 1
  const selectedType = searchParams.type || ""

  // Fetch initial data on the server with caching
  const { results: pokemon, count } = await getPokemonList(page, selectedType)
  const types = await getPokemonTypes()

  // Calculate pagination values
  const pageSize = API_CONFIG.PAGINATION.LIMIT
  const totalPages = Math.ceil(count / pageSize)

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50 px-4 py-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-700 drop-shadow-md">Pokémon Explorer</h1>
        <p className="text-center mb-8 text-blue-600">Gotta catch 'em all!</p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <Suspense fallback={<div>Loading types...</div>}>
            <PokemonTypeFilter selectedType={selectedType} initialTypes={types} />
          </Suspense>
        </div>

        <Suspense fallback={<LoadingPokemon />}>
          <PokemonList pokemon={pokemon} />
        </Suspense>

        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages || 1} selectedType={selectedType} />
        </div>
      </div>
    </main>
  )
}

