export interface Pokemon {
  id: number
  name: string
  image: string
  types: string[]
  height: number
  weight: number
  abilities: string[]
  stats: {
    name: string
    value: number
  }[]
  isLoading?: boolean
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: {
    name: string
    url: string
  }[]
}

export interface PokemonTypeResponse {
  id: number
  name: string
  pokemon: {
    pokemon: {
      name: string
      url: string
    }
    slot: number
  }[]
}

export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy"

