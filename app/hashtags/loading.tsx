export default function HashtagsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Search/Filter Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="h-10 w-full max-w-md bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 mb-4 pb-4 border-b">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 py-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
