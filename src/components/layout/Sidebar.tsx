'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/exchanges', label: 'Exchanges', icon: '🏪' },
    { href: '/exchange-users', label: 'Exchange Users', icon: '👥' },
    { href: '/exchange-cards', label: 'Exchange Cards', icon: '🃏' },
  ];

  return (
    <nav className="w-64 bg-gray-100 min-h-screen p-4 border-r border-gray-200">
      <ul className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
