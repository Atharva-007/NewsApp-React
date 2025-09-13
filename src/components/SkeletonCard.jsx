const SkeletonCard = () => (
    <div className="rounded-xl overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg animate-pulse">
        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600" />
        <div className="p-6 space-y-3">
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex gap-3 pt-2">
                <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
        </div>
    </div>
)

export default SkeletonCard
