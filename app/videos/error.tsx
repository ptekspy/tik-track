'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function VideosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Videos error:', error);
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Video Error
        </h2>

        <p className="text-gray-600 mb-6">
          {error.message || 'Failed to load video data'}
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
