// API Base URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://pokeapi.co/api/v2"

// API Endpoints
export const API_ENDPOINTS = {
  // Pokemon endpoints
  POKEMON: {
    LIST: `${API_BASE_URL}/pokemon`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/pokemon/${id}`,
    TYPE: (type: string) => `${API_BASE_URL}/type/${type.toLowerCase()}`,
    TYPES_LIST: `${API_BASE_URL}/type`,
  },

  // Other endpoints can be added here as the app grows
  SPECIES: {
    DETAIL: (id: string | number) => `${API_BASE_URL}/pokemon-species/${id}`,
  },

  EVOLUTION: {
    CHAIN: (id: string | number) => `${API_BASE_URL}/evolution-chain/${id}`,
  },

  GENERATION: {
    LIST: `${API_BASE_URL}/generation`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/generation/${id}`,
  },
}

// API Configuration
export const API_CONFIG = {
  CACHE_DURATION: 86400, // 24 hours in seconds
  PAGINATION: {
    LIMIT: 20,
    DEFAULT_PAGE: 1,
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_BACKOFF: 1000, // 1 second
  },
}

