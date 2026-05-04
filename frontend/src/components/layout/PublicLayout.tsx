import type { ReactNode } from 'react';

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-900 text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Apulse</h1>
          <span className="text-sm text-blue-200">Feedback 360° interne</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="bg-gray-100 py-4 px-6 text-center text-sm text-gray-600">
        © 2026 Apulse · Projet de préparation alternance AXA France
      </footer>
    </div>
  );
}