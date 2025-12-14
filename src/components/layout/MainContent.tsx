import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 p-8 bg-white overflow-auto">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
}
