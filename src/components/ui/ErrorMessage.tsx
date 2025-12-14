/**
 * ErrorMessage component - displays error messages with a friendly UI
 */

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" role="alert">
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg max-w-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Error</h3>
            <div className="mt-2 text-sm">
              <p>{message}</p>
            </div>
            {onRetry && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onRetry}
                  className="bg-red-100 text-red-800 px-3 py-2 text-sm font-medium rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
