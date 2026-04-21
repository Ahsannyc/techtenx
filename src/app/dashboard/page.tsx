import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
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
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">Dashboard</Link>
            <Link href="/dashboard/projects" className="hover:text-blue-400">Projects</Link>
            <Link href="/dashboard/billing" className="hover:text-blue-400">Billing</Link>
            <Link href="/account/settings" className="hover:text-blue-400">Settings</Link>
            <a href="/api/auth/logout" className="text-red-400 hover:text-red-300 text-sm">
              Logout
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Welcome, {user.name?.split(' ')[0]}! 👋</h1>
            <p className="text-xl text-gray-400">Here's your TechTenX dashboard</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Active Agents', value: '0', icon: '🤖' },
              { label: 'Automations', value: '0', icon: '⚙️' },
              { label: 'Websites', value: '0', icon: '🌐' },
              { label: 'Credits Used', value: '0%', icon: '💳' }
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: 'Create AI Agent',
                desc: 'Build a new AI agent for your workflow',
                icon: '🤖',
                color: 'from-blue-600'
              },
              {
                title: 'Build Automation',
                desc: 'Connect tools and automate tasks',
                icon: '⚙️',
                color: 'from-purple-600'
              },
              {
                title: 'Generate Website',
                desc: 'Create an AI-powered website',
                icon: '🌐',
                color: 'from-pink-600'
              }
            ].map((action, i) => (
              <button key={i} className={`bg-gradient-to-br ${action.color} to-transparent border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all text-left`}>
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                <p className="text-gray-300 text-sm">{action.desc}</p>
              </button>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
            <div className="text-center py-12 text-gray-400">
              <p className="mb-4">No activity yet</p>
              <p className="text-sm">Create your first AI agent or automation to get started</p>
            </div>
          </div>

          {/* Settings Link */}
          <div className="mt-12 text-center">
            <Link href="/account/settings" className="text-blue-400 hover:text-blue-300 font-semibold">
              Go to Account Settings →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
