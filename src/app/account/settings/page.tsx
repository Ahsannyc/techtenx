import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-semibold text-2xl">TechTenX</Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <a href="/api/auth/logout" className="text-red-400 hover:text-red-300 text-sm">
              Logout
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your TechTenX account</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sticky top-32">
                <nav className="space-y-2">
                  {[
                    { label: 'Profile', href: '#profile' },
                    { label: 'Security', href: '#security' },
                    { label: 'Billing', href: '#billing' },
                    { label: 'Team', href: '#team' },
                    { label: 'Integrations', href: '#integrations' },
                    { label: 'Danger Zone', href: '#danger' }
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Profile Section */}
              <section id="profile" className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Profile</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue={user.name || ''}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email || ''}
                      disabled
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      placeholder="Your company"
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all">
                    Save Changes
                  </button>
                </div>
              </section>

              {/* Security Section */}
              <section id="security" className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Security</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5">
                      Setup
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-gray-400">Manage your login sessions</p>
                    </div>
                    <button className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5">
                      View
                    </button>
                  </div>
                </div>
              </section>

              {/* Billing Section */}
              <section id="billing" className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Billing</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-gray-400">Starter - $29/month</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                      Upgrade
                    </button>
                  </div>
                  <div>
                    <p className="font-medium mb-3">Payment Method</p>
                    <div className="flex gap-3">
                      <div className="p-4 bg-zinc-800/50 rounded-lg flex-1">
                        <p className="text-sm text-gray-400">Visa ending in</p>
                        <p className="font-medium">•••• 4242</p>
                      </div>
                      <button className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section id="danger" className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-6 text-red-400">Danger Zone</h2>
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all">
                  Delete Account
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  Permanently delete your account and all data. This cannot be undone.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
