import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-yellow-400 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">404 - Not Found</h1>
        <p className="text-xl mb-8 text-gray-700">The Pokémon you're looking for doesn't exist or has fled!</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors font-medium"
        >
          Return to Pokédex
        </Link>
      </div>
    </div>
  )
}

