import Link from 'next/link';

export default function VideoNotFound() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Video Not Found
        </h2>

        <p className="text-gray-600 mb-6">
          The video you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
