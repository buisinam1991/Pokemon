"use client"

import { useState } from "react"
import Image from "next/image"
import type { Pokemon } from "@/types/pokemon"
import { Skeleton } from "@/components/ui/skeleton"
import PokemonDetailDialog from "./pokemon-detail-dialog"
import LoadingSpinner from "./loading-spinner"

interface PokemonListProps {
  pokemon: Pokemon[]
}

export default function PokemonList({ pokemon }: PokemonListProps) {
  // Track loading state for each Pokemon image
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({})
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (pokemon.length === 0) {
    return (
      <div className="text-center py-10 bg-white/80 rounded-xl shadow-lg">
        <p className="text-xl">No Pokémon found. Try a different filter.</p>
      </div>
    )
  }

  const handleImageLoad = (id: number) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemon.map((pokemon) => (
          <div
            key={pokemon.id}
            className="relative bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
            onClick={() => handlePokemonClick(pokemon)}
          >
            {/* Card border effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>

            {/* Pokemon ID badge */}
            <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow-md">
              #{pokemon.id.toString().padStart(3, "0")}
            </div>

            <div className="p-4 flex flex-col items-center">
              <div className="relative w-40 h-40 mb-2">
                {(!imagesLoaded[pokemon.id] || pokemon.isLoading) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="medium" />
                  </div>
                )}
                <Image
                  src={pokemon.image || `/placeholder.svg?height=200&width=200&text=${pokemon.name}`}
                  alt={pokemon.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-contain transition-opacity duration-300 ${
                    imagesLoaded[pokemon.id] && !pokemon.isLoading ? "opacity-100" : "opacity-0"
                  }`}
                  priority={pokemon.id <= 8}
                  onLoad={() => handleImageLoad(pokemon.id)}
                />
              </div>

              <h2 className="text-xl font-bold mt-2 capitalize text-blue-800">{pokemon.name}</h2>

              <div className="flex gap-2 mt-3 mb-1 min-h-[28px]">
                {pokemon.types && pokemon.types.length > 0 ? (
                  pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      {type}
                    </span>
                  ))
                ) : pokemon.isLoading ? (
                  <div className="flex gap-2">
                    <Skeleton className="w-16 h-6 rounded-full" />
                    <Skeleton className="w-16 h-6 rounded-full" />
                  </div>
                ) : null}
              </div>
            </div>

            {/* View details button */}
            <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium group-hover:bg-blue-700 transition-colors">
              View Details
            </div>
          </div>
        ))}
      </div>

      <PokemonDetailDialog pokemon={selectedPokemon} isOpen={dialogOpen} onClose={handleCloseDialog} />
    </>
  )
}

// Helper function to get color based on Pokemon type
function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  }

  return typeColors[type.toLowerCase()] || "#777777"
}

