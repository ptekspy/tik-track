export interface FormErrorProps {
  error?: string | string[];
  className?: string;
}

/**
 * FormError Component
 * 
 * Displays validation errors in a consistent format.
 * Can handle single error string or array of errors.
 */
export function FormError({ error, className = '' }: FormErrorProps) {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];

  if (errors.length === 0) return null;

  return (
    <div className={`text-sm text-red-600 dark:text-red-400 mt-2 ${className}`} role="alert">
      {errors.length === 1 ? (
        <p className="flex items-center space-x-1">
          <span className="inline-block w-1 h-4 bg-red-500 rounded-full"></span>
          <span>{errors[0]}</span>
        </p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {errors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
