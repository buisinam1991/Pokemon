"use client"

import { useState } from "react"
import Image from "next/image"
import { usePokemonDetail } from "@/hooks/use-pokemon"
import LoadingSpinner from "@/components/loading-spinner"
import type { Pokemon } from "@/types/pokemon"

interface PokemonDetailClientProps {
  initialPokemon: Pokemon
}

export default function PokemonDetailClient({ initialPokemon }: PokemonDetailClientProps) {
  // Use the hook with initial data to avoid refetching
  const { pokemon } = usePokemonDetail(initialPokemon.id, initialPokemon)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-yellow-400">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
        <p className="text-yellow-300 font-bold">#{pokemon.id.toString().padStart(3, "0")}</p>
      </div>

      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center">
          <PokemonImage src={pokemon.image || "/placeholder.svg"} alt={pokemon.name} />

          <div className="md:ml-8 w-full">
            <div className="flex flex-wrap gap-2 mb-6">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="px-4 py-2 rounded-full text-white text-sm font-bold shadow-sm"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <h2 className="text-lg font-bold mb-3 text-blue-700">Details</h2>
                <p className="mb-2">
                  <span className="font-bold text-gray-700">Height:</span>
                  <span className="ml-2 text-blue-800">{pokemon.height / 10}m</span>
                </p>
                <p>
                  <span className="font-bold text-gray-700">Weight:</span>
                  <span className="ml-2 text-blue-800">{pokemon.weight / 10}kg</span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <h2 className="text-lg font-bold mb-3 text-blue-700">Abilities</h2>
                <ul className="space-y-1">
                  {pokemon.abilities.map((ability) => (
                    <li key={ability} className="capitalize flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      <span className="text-blue-800">{ability.replace("-", " ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pokemon.stats.map((stat) => (
              <div key={stat.name}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize font-medium text-gray-700">{stat.name.replace("-", " ")}</span>
                  <span className="font-bold text-blue-800">{stat.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
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
      </div>
    </div>
  )
}

// Client component for image with loading state
function PokemonImage({ src, alt }: { src: string; alt: string }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative w-64 h-64 mb-6 md:mb-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 shadow-inner">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      )}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className={`object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        priority
        onLoad={() => setImageLoaded(true)}
      />
    </div>
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

