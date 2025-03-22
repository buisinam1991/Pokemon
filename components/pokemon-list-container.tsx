"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import PokemonList from "@/components/pokemon-list"
import Pagination from "@/components/pagination"
import LoadingSpinner from "@/components/loading-spinner"
import { usePokemonList } from "@/hooks/use-pokemon"
import type { Pokemon } from "@/types/pokemon"

interface PokemonListContainerProps {
  initialPokemon: Pokemon[]
  initialCount: number
  currentPage: number
  totalPages: number
  selectedType: string
}

export default function PokemonListContainer({
  initialPokemon,
  initialCount,
  currentPage,
  totalPages,
  selectedType,
}: PokemonListContainerProps) {
  const searchParams = useSearchParams()
  const [isClientNavigation, setIsClientNavigation] = useState(false)

  // Track if we've navigated away from the initial SSR page
  useEffect(() => {
    setIsClientNavigation(true)
  }, [])

  // For client-side navigation, use SWR
  const {
    pokemon: clientPokemon,
    count: clientCount,
    isLoading,
    isLoadingDetails,
    isError,
  } = usePokemonList(
    currentPage,
    selectedType,
    // Only provide fallback data for the initial SSR render
    !isClientNavigation ? { fallbackData: initialPokemon, fallbackCount: initialCount } : undefined,
  )

  // Use SSR data for initial render, then client data for subsequent renders
  const pokemon = !isClientNavigation ? initialPokemon : clientPokemon
  const count = !isClientNavigation ? initialCount : clientCount

  return (
    <>
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
        <>
          <PokemonList pokemon={pokemon} />

          {isLoadingDetails && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
              <LoadingSpinner size="small" />
              <span className="ml-2">Loading details...</span>
            </div>
          )}
        </>
      )}

      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} selectedType={selectedType} />
      </div>
    </>
  )
}

