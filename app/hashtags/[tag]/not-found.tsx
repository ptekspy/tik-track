import Link from 'next/link';

export default function HashtagNotFound() {
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
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Hashtag Not Found
        </h2>

        <p className="text-gray-600 mb-6">
          The hashtag you&apos;re looking for doesn&apos;t exist or hasn&apos;t been used yet.
        </p>

        <Link
          href="/hashtags"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          View All Hashtags
        </Link>
      </div>
    </div>
  );
}
