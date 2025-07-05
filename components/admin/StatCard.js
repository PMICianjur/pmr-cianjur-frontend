// components/admin/StatCard.js

export default function StatCard({ title, value, icon, isLoading }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                {isLoading ? (
                    // Ini adalah skeleton loading
                    <div className="mt-1 h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                )}
            </div>
            <div className="text-4xl text-red-500 bg-red-100 p-3 rounded-full">
                {icon}
            </div>
        </div>
    );
}