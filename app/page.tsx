"use client"

import { useSearchParams } from "next/navigation"
import PokemonList from "@/components/pokemon-list"
import PokemonTypeFilter from "@/components/pokemon-type-filter"
import Pagination from "@/components/pagination"
import LoadingSpinner from "@/components/loading-spinner"
import { usePokemonList } from "@/hooks/use-pokemon"
import { API_CONFIG } from "@/constants/api"

export default function Home() {
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1
  const selectedType = searchParams.get("type") || ""

  // Use SWR hook to fetch Pokemon data
  const { pokemon, count, isLoading, isError } = usePokemonList(page, selectedType)

  // Calculate pagination values
  const pageSize = API_CONFIG.PAGINATION.LIMIT
  const totalPages = Math.ceil(count / pageSize)

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50 px-4 py-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-700 drop-shadow-md">Pokémon Explorer</h1>
        <p className="text-center mb-8 text-blue-600">Gotta catch 'em all!</p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <PokemonTypeFilter selectedType={selectedType} />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/80 rounded-xl shadow-lg">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-lg font-medium text-blue-700 animate-pulse">Catching Pokémon...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-10 bg-white/80 rounded-xl shadow-lg">
            <p className="text-xl text-red-500">Error loading Pokémon. Please try again later.</p>
          </div>
        ) : (
          <PokemonList pokemon={pokemon} />
        )}

        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages || 1} selectedType={selectedType} />
        </div>
      </div>
    </main>
  )
}

