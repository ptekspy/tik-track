export default function VideoDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
