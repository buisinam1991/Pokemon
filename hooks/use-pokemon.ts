import useSWR from "swr"
import { API_ENDPOINTS, API_CONFIG } from "@/constants/api"
import type { Pokemon } from "@/types/pokemon"
import { fetchWithRetry, createPlaceholderPokemon, getFallbackPokemonList } from "@/lib/pokemon"

// SWR fetcher function
const fetcher = async (url: string) => {
  try {
    return await fetchWithRetry(url)
  } catch (error) {
    console.error(`SWR fetcher error for ${url}:`, error)
    throw error
  }
}

interface PokemonListOptions {
  fallbackData?: Pokemon[]
  fallbackCount?: number
}

/**
 * Hook for fetching a paginated list of Pokemon with optional type filtering
 */
export function usePokemonList(page = 1, type = "", options?: PokemonListOptions) {
  const { LIMIT } = API_CONFIG.PAGINATION

  // Create the appropriate key based on whether we're filtering by type
  const getKey = () => {
    if (type) {
      return `pokemon-type-${type}-page-${page}`
    }
    const offset = (page - 1) * LIMIT
    return `${API_ENDPOINTS.POKEMON.LIST}?limit=${LIMIT}&offset=${offset}`
  }

  // Use SWR to fetch the basic list data
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    getKey(),
    async () => {
      try {
        if (type) {
          // If filtering by type, we need to fetch the type data first
          const typeData = await fetcher(API_ENDPOINTS.POKEMON.TYPE(type))
          const pokemonUrls = typeData.pokemon.map((p: any) => p.pokemon.url)
          const count = pokemonUrls.length

          // Calculate pagination
          const offset = (page - 1) * LIMIT
          const paginatedUrls = pokemonUrls.slice(offset, offset + LIMIT)

          // Create basic Pokemon list with minimal data
          const basicPokemonList = paginatedUrls.map((url: string) => {
            // Extract ID from URL
            const idMatch = url.match(/\/pokemon\/(\d+)\//)
            const id = idMatch ? Number.parseInt(idMatch[1]) : 0
            const name = url.split("/").filter(Boolean).pop() || "unknown"

            return {
              id,
              name,
              url,
              isLoading: true,
            }
          })

          return {
            results: basicPokemonList,
            count,
          }
        } else {
          // Standard pagination without type filtering
          const data = await fetcher(getKey())

          // Create basic Pokemon list with minimal data
          const basicPokemonList = data.results.map((pokemon: any) => {
            // Extract ID from URL
            const idMatch = pokemon.url.match(/\/pokemon\/(\d+)\//)
            const id = idMatch ? Number.parseInt(idMatch[1]) : 0

            return {
              id,
              name: pokemon.name,
              url: pokemon.url,
              isLoading: true,
            }
          })

          return {
            results: basicPokemonList,
            count: data.count,
          }
        }
      } catch (error) {
        console.error("Error in usePokemonList:", error)
        return getFallbackPokemonList(page)
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      fallbackData: options?.fallbackData
        ? { results: options.fallbackData, count: options.fallbackCount || 0 }
        : undefined,
    },
  )

  // Use a separate SWR call to fetch details for each Pokemon
  const { data: detailedPokemon, isLoading: isLoadingDetails } = useSWR(
    data ? `pokemon-details-${page}-${type}` : null,
    async () => {
      // If we have fallback data with complete details, use it
      if (
        options?.fallbackData &&
        options.fallbackData.length > 0 &&
        options.fallbackData[0].types &&
        options.fallbackData[0].types.length > 0
      ) {
        return options.fallbackData
      }

      if (!data?.results) return []

      const pokemonDetails: Pokemon[] = []

      // Create a copy of the basic list
      const basicList = [...data.results]

      // Process Pokemon in batches to avoid overwhelming the API
      const batchSize = 3
      for (let i = 0; i < basicList.length; i += batchSize) {
        const batch = basicList.slice(i, i + batchSize)

        // Fetch details for each Pokemon in the batch concurrently
        await Promise.all(
          batch.map(async (pokemon: any) => {
            try {
              const details = await fetcher(pokemon.url)
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
          }),
        )
      }

      // Sort by ID to maintain order
      return pokemonDetails.sort((a, b) => a.id - b.id)
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      fallbackData:
        options?.fallbackData && options.fallbackData[0]?.types?.length > 0 ? options.fallbackData : undefined,
    },
  )

  // Combine basic list with detailed data
  const combinedPokemonList = () => {
    if (!data?.results) return []

    if (detailedPokemon && detailedPokemon.length > 0) {
      // If we have detailed data, use it
      return detailedPokemon
    } else {
      // Otherwise, return basic list with placeholder images
      return data.results.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        image: `/placeholder.svg?height=200&width=200&text=${pokemon.name}`,
        types: [],
        height: 0,
        weight: 0,
        abilities: [],
        stats: [],
        isLoading: true,
      }))
    }
  }

  return {
    pokemon: combinedPokemonList(),
    count: data?.count || 0,
    isLoading,
    isLoadingDetails,
    isError: !!error,
    isValidating,
    mutate,
  }
}

/**
 * Hook for fetching a single Pokemon by ID
 */
export function usePokemonDetail(id: string | number, initialData?: Pokemon) {
  const { data, error, isLoading } = useSWR(
    id ? `pokemon-${id}` : null,
    async () => {
      try {
        const data = await fetcher(API_ENDPOINTS.POKEMON.DETAIL(id))

        return {
          id: data.id,
          name: data.name,
          image:
            data.sprites.other["official-artwork"]?.front_default ||
            data.sprites.front_default ||
            `/placeholder.svg?height=200&width=200&text=${data.name}`,
          types: data.types.map((t: any) => t.type.name),
          height: data.height,
          weight: data.weight,
          abilities: data.abilities.map((a: any) => a.ability.name),
          stats: data.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
        }
      } catch (error) {
        console.error(`Error fetching Pokemon with ID ${id}:`, error)
        throw error
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
      errorRetryCount: 3,
      fallbackData: initialData,
    },
  )

  return {
    pokemon: data,
    isLoading,
    isError: !!error,
  }
}

/**
 * Hook for fetching all Pokemon types
 */
export function usePokemonTypes(initialTypes?: string[]) {
  // Cached types as fallback
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

  const { data, error, isLoading } = useSWR(
    "pokemon-types",
    async () => {
      try {
        const data = await fetcher(API_ENDPOINTS.POKEMON.TYPES_LIST)

        // Filter out special types like 'unknown' and 'shadow'
        return data.results
          .map((type: { name: string }) => type.name)
          .filter((type: string) => !["unknown", "shadow"].includes(type))
      } catch (error) {
        console.error("Error fetching Pokemon types:", error)
        return cachedTypes
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 86400000, // 24 hours
      fallbackData: initialTypes || cachedTypes,
    },
  )

  return {
    types: data || cachedTypes,
    isLoading,
    isError: !!error,
  }
}

