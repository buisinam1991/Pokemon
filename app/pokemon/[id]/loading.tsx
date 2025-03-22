import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function LoadingPokemonDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50 px-4 py-8">
      <div className="container mx-auto">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors mb-6"
        >
          &larr; Back to Pokédex
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-yellow-400">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
            <Skeleton className="h-8 w-48 bg-blue-400/50" />
            <Skeleton className="h-6 w-24 mt-2 bg-blue-400/50" />
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center">
              <Skeleton className="w-64 h-64 rounded-lg mb-6 md:mb-0" />

              <div className="md:ml-8 w-full">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full" />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
              <Skeleton className="h-6 w-24 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

