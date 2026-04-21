import { getSession } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// TODO: Replace with actual admin check
const ADMIN_EMAILS = ['admin@techtenx.com'];

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Check if user is admin
  const isAdmin = ADMIN_EMAILS.includes(session.user.email || '');

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black text-white">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-semibold text-2xl">TechTenX</Link>
            <a href="/api/auth/logout" className="text-red-400 hover:text-red-300 text-sm">Logout</a>
          </div>
        </nav>
        <div className="pt-32 pb-20 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have admin access</p>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            Go to Dashboard →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-semibold text-2xl">TechTenX</Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-blue-400">Admin</Link>
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <a href="/api/auth/logout" className="text-red-400 hover:text-red-300 text-sm">
              Logout
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users, revenue, and system settings</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Users', value: '0', change: '+0%', icon: '👥' },
              { label: 'Monthly Revenue', value: '$0', change: '+0%', icon: '💰' },
              { label: 'Active Subscriptions', value: '0', change: '+0%', icon: '🔄' },
              { label: 'Churn Rate', value: '0%', change: '-0%', icon: '📉' }
            ].map((metric, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">{metric.label}</p>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <p className="text-3xl font-bold mb-2">{metric.value}</p>
                <p className="text-sm text-green-400">{metric.change} from last month</p>
              </div>
            ))}
          </div>

          {/* Admin Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: 'Users Management',
                desc: 'View, edit, and manage user accounts',
                icon: '👥',
                href: '/admin/users'
              },
              {
                title: 'Revenue & Billing',
                desc: 'View revenue, subscriptions, and invoices',
                icon: '💳',
                href: '/admin/billing'
              },
              {
                title: 'System Health',
                desc: 'Monitor API health and error logs',
                icon: '🏥',
                href: '/admin/health'
              },
              {
                title: 'Settings',
                desc: 'Configure system-wide settings',
                icon: '⚙️',
                href: '/admin/settings'
              }
            ].map((section, i) => (
              <Link
                key={i}
                href={section.href}
                className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all group"
              >
                <div className="text-4xl mb-4">{section.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-400 text-sm">{section.desc}</p>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { event: 'New signup', user: 'john@example.com', time: '2 minutes ago' },
                { event: 'Subscription upgraded', user: 'jane@example.com', time: '1 hour ago' },
                { event: 'Payment failed', user: 'bob@example.com', time: '3 hours ago' },
                { event: 'Subscription canceled', user: 'alice@example.com', time: '5 hours ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.event}</p>
                    <p className="text-sm text-gray-400">{item.user}</p>
                  </div>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
