'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function HashtagsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Hashtags error:', error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg
            className="mx-auto h-12 w-12"
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
          Hashtag Error
        </h2>

        <p className="text-gray-600 mb-6">
          {error.message || 'Failed to load hashtag data'}
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Try Again
          </button>

          <Link
            href="/hashtags"
            className="block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium"
          >
            Back to Hashtags
          </Link>
        </div>
      </div>
    </div>
  );
}
