import { getSession } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAILS = ['admin@techtenx.com'];

export default async function UsersPage() {
  const session = await getSession();

  if (!session || !ADMIN_EMAILS.includes(session.user.email || '')) {
    redirect('/admin');
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-semibold text-2xl">TechTenX</Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-blue-400">Admin</Link>
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <a href="/api/auth/logout" className="text-red-400 hover:text-red-300 text-sm">Logout</a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Users Management</h1>
            <p className="text-gray-400">View and manage user accounts</p>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4 mb-8">
            <input
              type="search"
              placeholder="Search users by email..."
              className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
            <select className="bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none">
              <option>All Plans</option>
              <option>Free</option>
              <option>Starter</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-zinc-800/50">
                    <th className="text-left py-4 px-6 font-medium text-gray-400">User</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Plan</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Joined</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { email: 'john@example.com', plan: 'Pro', joined: 'Mar 15, 2026', status: 'Active' },
                    { email: 'jane@example.com', plan: 'Starter', joined: 'Mar 10, 2026', status: 'Active' },
                    { email: 'bob@example.com', plan: 'Free', joined: 'Mar 5, 2026', status: 'Inactive' },
                  ].map((user) => (
                    <tr key={user.email} className="border-b border-white/10 hover:bg-zinc-800/30">
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">
                          {user.plan}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400">{user.joined}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          user.status === 'Active'
                            ? 'bg-green-900/30 text-green-300'
                            : 'bg-gray-900/30 text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? 'bg-blue-600'
                    : 'border border-white/10 hover:bg-white/5'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
