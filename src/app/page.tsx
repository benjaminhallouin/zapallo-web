import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Zapallo Backoffice</h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your trading card exchanges, users, and inventory all in one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/exchanges"
          className="block p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors"
        >
          <div className="text-4xl mb-3">🏪</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Exchanges</h2>
          <p className="text-gray-600">
            Manage trading platforms and marketplaces where cards are bought and sold.
          </p>
        </Link>

        <Link
          href="/exchange-users"
          className="block p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors"
        >
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Exchange Users</h2>
          <p className="text-gray-600">
            Manage sellers and buyers active on various trading platforms.
          </p>
        </Link>

        <Link
          href="/exchange-cards"
          className="block p-6 bg-purple-50 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors"
        >
          <div className="text-4xl mb-3">🃏</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Exchange Cards</h2>
          <p className="text-gray-600">
            Manage cards listed for sale or trade across different exchanges.
          </p>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Getting Started</h3>
        <p className="text-gray-600">
          Use the navigation menu on the left or the cards above to start managing your resources.
          Each section provides full CRUD operations for its respective entity.
        </p>
      </div>
    </div>
  );
}
