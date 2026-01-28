export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-[#fe2c55]/20 to-[#7c3aed]/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-[#25f4ee]/20 to-[#fe2c55]/20 rounded-full blur-3xl animate-pulse-slow-delayed" />
      </div>

      <div className="relative w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
