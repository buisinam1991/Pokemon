import LoadingPokemon from "@/components/loading-pokemon"

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50 px-4 py-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-700 drop-shadow-md">Pokémon Explorer</h1>
        <p className="text-center mb-8 text-blue-600">Gotta catch 'em all!</p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>

        <LoadingPokemon />

        <div className="flex justify-center items-center space-x-2 my-8 mt-8">
          <div className="animate-pulse flex space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

