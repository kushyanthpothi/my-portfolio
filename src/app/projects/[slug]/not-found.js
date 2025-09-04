import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">The project you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
