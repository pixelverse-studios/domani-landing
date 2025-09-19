export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="relative">
        {/* Loading spinner */}
        <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>

        {/* Loading text */}
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Loading login...
          </p>
        </div>
      </div>
    </div>
  )
}