import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingPokemon() {
  // Create an array of 12 items for the skeleton
  const skeletonItems = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {skeletonItems.map((index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden p-4 flex flex-col items-center">
          <Skeleton className="w-40 h-40 rounded-lg mb-4" />
          <Skeleton className="w-32 h-6 rounded-md mb-4" />
          <div className="flex gap-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
          <Skeleton className="w-full h-8 rounded-b-lg mt-4" />
        </div>
      ))}
    </div>
  )
}

