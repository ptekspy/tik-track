export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl animate-pulse mb-3" />
        <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 border border-white/20">
            <div className="h-5 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse mb-3" />
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Action Button Skeleton */}
      <div className="mb-8">
        <div className="h-12 w-48 bg-gradient-to-r from-[#fe2c55]/30 to-[#7c3aed]/30 rounded-xl animate-pulse" />
      </div>

      {/* Videos Grid Skeleton */}
      <div className="glass rounded-2xl p-6 border border-white/20">
        <div className="h-7 w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl animate-pulse mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 border border-white/20">
              <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse mb-4" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
