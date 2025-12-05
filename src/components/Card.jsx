export default function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl shadow-sm dark:shadow-lg border border-gray-100 dark:border-gray-900 transition-all hover:shadow-md dark:hover:shadow-xl">
      {title && (
        <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-4">
          {title}
        </h2>
      )}
      <div className="text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}