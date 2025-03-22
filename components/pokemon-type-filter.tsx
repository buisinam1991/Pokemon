"use client"

import { useRouter } from "next/navigation"
import { usePokemonTypes } from "@/hooks/use-pokemon"
import LoadingSpinner from "./loading-spinner"

interface PokemonTypeFilterProps {
  selectedType: string
}

export default function PokemonTypeFilter({ selectedType }: PokemonTypeFilterProps) {
  const router = useRouter()
  const { types, isLoading } = usePokemonTypes()

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams()

    if (type) {
      params.set("type", type)
    }

    // Reset to page 1 when changing type
    params.set("page", "1")

    router.push(`/?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
        <span className="ml-2">Loading types...</span>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 text-blue-700">Filter by Type</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTypeChange("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedType === ""
              ? "bg-blue-600 text-white shadow-md transform scale-105"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          All Types
        </button>

        {types.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedType === type ? "shadow-md transform scale-105" : "opacity-85 hover:opacity-100"
            }`}
            style={{
              backgroundColor: getTypeColor(type),
              color: "white",
            }}
          >
            {type}
          </button>
        ))}
      </div>
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

