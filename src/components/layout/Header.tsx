'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
          Zapallo Backoffice
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/exchanges" className="hover:text-blue-200 transition-colors font-medium">
                Exchanges
              </Link>
            </li>
            <li>
              <Link
                href="/exchange-users"
                className="hover:text-blue-200 transition-colors font-medium"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/exchange-cards"
                className="hover:text-blue-200 transition-colors font-medium"
              >
                Cards
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
