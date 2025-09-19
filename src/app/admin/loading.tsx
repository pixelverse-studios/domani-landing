export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="space-y-4">
        {/* Skeleton loader for admin dashboard */}
        <div className="animate-pulse space-y-4">
          {/* Header skeleton */}
          <div className="h-16 bg-white dark:bg-gray-800 shadow rounded-lg w-[800px]"></div>

          {/* Content skeleton */}
          <div className="grid grid-cols-4 gap-4">
            {/* Sidebar skeleton */}
            <div className="col-span-1 space-y-2">
              <div className="h-10 bg-white dark:bg-gray-800 rounded-lg"></div>
              <div className="h-10 bg-white dark:bg-gray-800 rounded-lg"></div>
              <div className="h-10 bg-white dark:bg-gray-800 rounded-lg"></div>
              <div className="h-10 bg-white dark:bg-gray-800 rounded-lg"></div>
            </div>

            {/* Main content skeleton */}
            <div className="col-span-3 space-y-4">
              <div className="h-32 bg-white dark:bg-gray-800 rounded-lg"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-white dark:bg-gray-800 rounded-lg"></div>
                <div className="h-24 bg-white dark:bg-gray-800 rounded-lg"></div>
              </div>
              <div className="h-64 bg-white dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    </div>
  )
}