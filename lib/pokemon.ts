import type { Pokemon } from "@/types/pokemon"
import { API_ENDPOINTS, API_CONFIG } from "@/constants/api"

const { LIMIT } = API_CONFIG.PAGINATION
const { MAX_ATTEMPTS, INITIAL_BACKOFF } = API_CONFIG.RETRY

// Cache for Pokemon data to reduce API calls
const CACHE: Record<string, any> = {}

// Helper function to add delay between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to fetch with retry logic and better error handling
export async function fetchWithRetry(url: string, retries = MAX_ATTEMPTS, backoff = INITIAL_BACKOFF) {
  const cacheKey = url

  // Check cache first
  if (CACHE[cacheKey]) {
    return CACHE[cacheKey]
  }

  try {
    const response = await fetch(url, {
      cache: "force-cache", // Use cache-first strategy
    })

    // Handle rate limiting
    if (response.status === 429) {
      console.log(`Rate limited on ${url}, retrying after ${backoff}ms...`)

      if (retries > 0) {
        await delay(backoff)
        return fetchWithRetry(url, retries - 1, backoff * 2)
      } else {
        throw new Error(`Rate limit exceeded for ${url}, max retries reached`)
      }
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`)
    }

    // Get the response text first
    const text = await response.text()

    // Try to parse as JSON
    try {
      const data = JSON.parse(text)

      // Store in cache
      CACHE[cacheKey] = data

      return data
    } catch (parseError) {
      console.error(`Error parsing JSON from ${url}:`, text.substring(0, 100))
      throw new Error(`Invalid JSON response from ${url}`)
    }
  } catch (error) {
    if (retries > 0) {
      console.log(`Error fetching ${url}, retrying after ${backoff}ms...`, error)
      await delay(backoff)
      return fetchWithRetry(url, retries - 1, backoff * 2)
    }
    throw error
  }
}

/**
 * Creates a placeholder Pokemon with minimal data when API calls fail
 */
export function createPlaceholderPokemon(name: string, url: string): Pokemon {
  // Extract ID from URL
  const idMatch = url.match(/\/pokemon\/(\d+)\//)
  const id = idMatch ? Number.parseInt(idMatch[1]) : 0

  return {
    id,
    name,
    image: `/placeholder.svg?height=200&width=200&text=${name}`,
    types: ["unknown"],
    height: 0,
    weight: 0,
    abilities: ["unknown"],
    stats: [
      { name: "hp", value: 0 },
      { name: "attack", value: 0 },
      { name: "defense", value: 0 },
      { name: "special-attack", value: 0 },
      { name: "special-defense", value: 0 },
      { name: "speed", value: 0 },
    ],
  }
}

/**
 * Provides fallback Pokemon data when API calls fail
 */
export function getFallbackPokemonList(page = 1): { results: Pokemon[]; count: number } {
  // Generate placeholder Pokemon for the current page
  const offset = (page - 1) * LIMIT
  const placeholders: Pokemon[] = []

  for (let i = 0; i < LIMIT; i++) {
    const id = offset + i + 1
    placeholders.push({
      id,
      name: `pokemon-${id}`,
      image: `/placeholder.svg?height=200&width=200&text=Pokemon ${id}`,
      types: ["unknown"],
      height: 0,
      weight: 0,
      abilities: ["unknown"],
      stats: [
        { name: "hp", value: 0 },
        { name: "attack", value: 0 },
        { name: "defense", value: 0 },
        { name: "special-attack", value: 0 },
        { name: "special-defense", value: 0 },
        { name: "speed", value: 0 },
      ],
    })
  }

  return {
    results: placeholders,
    count: 1000, // Arbitrary count for pagination
  }
}

// Server-side functions for initial data loading
export async function getPokemonList(page = 1, type = ""): Promise<{ results: Pokemon[]; count: number }> {
  try {
    if (type) {
      return await getPokemonByType(type, page)
    } else {
      const offset = (page - 1) * LIMIT
      const url = `${API_ENDPOINTS.POKEMON.LIST}?limit=${LIMIT}&offset=${offset}`
      const data = await fetchWithRetry(url)

      const pokemonDetails: Pokemon[] = []

      for (const pokemon of data.results) {
        try {
          await delay(300)
          const details = await fetchWithRetry(pokemon.url)
          pokemonDetails.push({
            id: details.id,
            name: details.name,
            image:
              details.sprites.other["official-artwork"]?.front_default ||
              details.sprites.front_default ||
              `/placeholder.svg?height=200&width=200&text=${details.name}`,
            types: details.types.map((t: any) => t.type.name),
            height: details.height,
            weight: details.weight,
            abilities: details.abilities.map((a: any) => a.ability.name),
            stats: details.stats.map((s: any) => ({
              name: s.stat.name,
              value: s.base_stat,
            })),
          })
        } catch (error) {
          console.error(`Error fetching details for ${pokemon.name}:`, error)
          pokemonDetails.push(createPlaceholderPokemon(pokemon.name, pokemon.url))
        }
      }

      return {
        results: pokemonDetails,
        count: data.count,
      }
    }
  } catch (error) {
    console.error("Error fetching Pokemon list:", error)
    return getFallbackPokemonList(page)
  }
}

async function getPokemonByType(type: string, page: number): Promise<{ results: Pokemon[]; count: number }> {
  try {
    const url = API_ENDPOINTS.POKEMON.TYPE(type)
    const data = await fetchWithRetry(url)

    const pokemonUrls = data.pokemon.map((p: any) => p.pokemon.url)
    const count = pokemonUrls.length

    const offset = (page - 1) * LIMIT
    const paginatedUrls = pokemonUrls.slice(offset, offset + LIMIT)

    const pokemonDetails: Pokemon[] = []

    for (const url of paginatedUrls) {
      try {
        await delay(300)
        const details = await fetchWithRetry(url)
        pokemonDetails.push({
          id: details.id,
          name: details.name,
          image:
            details.sprites.other["official-artwork"]?.front_default ||
            details.sprites.front_default ||
            `/placeholder.svg?height=200&width=200&text=${details.name}`,
          types: details.types.map((t: any) => t.type.name),
          height: details.height,
          weight: details.weight,
          abilities: details.abilities.map((a: any) => a.ability.name),
          stats: details.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
        })
      } catch (error) {
        console.error(`Error fetching details for ${url}:`, error)
        pokemonDetails.push(createPlaceholderPokemon("unknown", url))
      }
    }

    return {
      results: pokemonDetails,
      count,
    }
  } catch (error) {
    console.error(`Error fetching Pokemon of type ${type}:`, error)
    return getFallbackPokemonList(page)
  }
}

export async function getPokemonById(id: string | number): Promise<Pokemon | null> {
  try {
    const url = API_ENDPOINTS.POKEMON.DETAIL(id)
    const data = await fetchWithRetry(url)

    return {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other["official-artwork"]?.front_default ||
        data.sprites.front_default ||
        `/placeholder.svg?height=200&width=200&text=${data.name}`,
      types: data.types.map((type: { type: { name: string } }) => type.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
      stats: data.stats.map((stat: { base_stat: number; stat: { name: string } }) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
    }
  } catch (error) {
    console.error(`Error fetching Pokemon with ID ${id}:`, error)
    return null
  }
}

export async function getPokemonTypes(): Promise<string[]> {
  const cachedTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ]

  try {
    const url = API_ENDPOINTS.POKEMON.TYPES_LIST
    const data = await fetchWithRetry(url)

    return data.results
      .map((type: { name: string }) => type.name)
      .filter((type: string) => !["unknown", "shadow"].includes(type))
  } catch (error) {
    console.error("Error fetching Pokemon types, using cached types:", error)
    return cachedTypes
  }
}

