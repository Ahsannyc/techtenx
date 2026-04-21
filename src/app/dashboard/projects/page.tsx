import { getSession } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProjectsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-semibold text-2xl">TechTenX</Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link href="/account/settings" className="hover:text-blue-400">Settings</Link>
            <a href="/api/auth/logout" className="text-red-400 hover:text-red-300 text-sm">
              Logout
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Projects</h1>
              <p className="text-gray-400">Manage your AI agents, automations, and websites</p>
            </div>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all">
              + New Project
            </button>
          </div>

          {/* Project Filters */}
          <div className="flex gap-3 mb-8">
            {['All', 'AI Agents', 'Automations', 'Websites'].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm"
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Empty State */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold mb-2">No projects yet</h2>
            <p className="text-gray-400 mb-6">Create your first AI agent, automation, or website</p>
            <div className="flex gap-3 justify-center">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                Create AI Agent
              </button>
              <button className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5">
                Create Automation
              </button>
            </div>
          </div>

          {/* Project Grid (for when user has projects) */}
          {/* This will be populated once projects exist */}
        </div>
      </div>
    </main>
  );
}
