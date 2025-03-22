"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Pokemon } from "@/types/pokemon"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoadingSpinner from "./loading-spinner"
import { usePokemonDetail } from "@/hooks/use-pokemon"

interface PokemonDetailDialogProps {
  pokemon: Pokemon | null
  isOpen: boolean
  onClose: () => void
}

export default function PokemonDetailDialog({ pokemon, isOpen, onClose }: PokemonDetailDialogProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  // If we only have basic Pokemon data, fetch the full details
  const { pokemon: fullPokemonData, isLoading: isLoadingDetails } = usePokemonDetail(
    pokemon && (!pokemon.types || pokemon.types.length === 0) ? pokemon.id : null,
  )

  // Combine the data - use fullPokemonData if available, otherwise use the passed pokemon
  const pokemonData = fullPokemonData || pokemon

  // Reset image loaded state when pokemon changes
  useEffect(() => {
    setImageLoaded(false)
  }, [pokemon])

  if (!pokemon) return null

  const isLoadingFullDetails = isLoadingDetails || !pokemonData?.types || pokemonData.types.length === 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-100 border-2 border-yellow-400">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold capitalize flex items-center gap-2 text-blue-800">
            {pokemonData?.name}
            <span className="text-gray-500 text-lg">#{pokemonData?.id.toString().padStart(3, "0")}</span>
          </DialogTitle>
        </DialogHeader>

        {isLoadingFullDetails ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-blue-700">Loading Pokémon details...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col items-center">
                <div className="relative w-full h-48 md:h-64 bg-white/50 rounded-lg p-2">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingSpinner size="large" />
                    </div>
                  )}
                  <Image
                    src={pokemonData.image || "/placeholder.svg"}
                    alt={pokemonData.name}
                    fill
                    className={`object-contain transition-opacity duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>

                <div className="flex gap-2 mt-4 justify-center">
                  {pokemonData.types.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full text-white text-sm font-medium shadow-sm"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 bg-white/50 p-3 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-blue-700">Details</h3>
                  <p>
                    <span className="font-medium">Height:</span> {pokemonData.height / 10}m
                  </p>
                  <p>
                    <span className="font-medium">Weight:</span> {pokemonData.weight / 10}kg
                  </p>
                </div>

                <div className="mb-4 bg-white/50 p-3 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-blue-700">Abilities</h3>
                  <ul className="list-disc pl-5">
                    {pokemonData.abilities.map((ability) => (
                      <li key={ability} className="capitalize">
                        {ability.replace("-", " ")}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Stats</h3>
              <div className="space-y-3">
                {pokemonData.stats.map((stat) => (
                  <div key={stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize font-medium">{stat.name.replace("-", " ")}</span>
                      <span className="font-bold">{stat.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(100, (stat.value / 255) * 100)}%`,
                          backgroundColor: getStatColor(stat.name, stat.value),
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
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
    unknown: "#777777",
  }

  return typeColors[type.toLowerCase()] || "#777777"
}

// Helper function to get color based on stat value
function getStatColor(statName: string, value: number): string {
  // Different colors based on stat type
  const baseColors: Record<string, string> = {
    hp: "#FF5959",
    attack: "#F5AC78",
    defense: "#FAE078",
    "special-attack": "#9DB7F5",
    "special-defense": "#A7DB8D",
    speed: "#FA92B2",
  }

  // Default to blue if stat name not found
  return baseColors[statName] || "#6890F0"
}

