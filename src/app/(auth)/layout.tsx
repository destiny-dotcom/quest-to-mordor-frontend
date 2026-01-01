export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center px-4 py-8 safe-area-pb">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gold">Quest to Mordor</h1>
          <p className="mt-2 text-sm sm:text-base text-text-secondary">
            Track your journey from the Shire to Mount Doom
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
