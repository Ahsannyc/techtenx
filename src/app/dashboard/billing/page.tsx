import { getSession } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function BillingPage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-gray-400">Manage your plan and billing details</p>
          </div>

          {/* Current Plan */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Current Plan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Free', price: '$0', features: ['1 AI Agent', '50 tasks/month', 'Community support'], current: false },
                { name: 'Starter', price: '$29', features: ['5 AI Agents', '1000 tasks/month', 'Email support', 'Custom domain'], current: true },
                { name: 'Pro', price: '$99', features: ['Unlimited Agents', 'Unlimited tasks', 'Priority support', 'Team collaboration'], current: false }
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`p-6 rounded-xl border-2 ${
                    plan.current
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-white/10 bg-zinc-800/30'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold mb-6">
                    {plan.price}
                    <span className="text-lg text-gray-400">/month</span>
                  </p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.current ? (
                    <button className="w-full px-4 py-2 border border-blue-500 rounded-lg font-semibold text-blue-400">
                      Current Plan
                    </button>
                  ) : (
                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                      Upgrade
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Billing History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'Mar 21, 2026', desc: 'Starter Plan', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
                    { date: 'Feb 21, 2026', desc: 'Starter Plan', amount: '$29.00', status: 'Paid', invoice: 'INV-000' },
                  ].map((row) => (
                    <tr key={row.invoice} className="border-b border-white/10 hover:bg-zinc-800/50">
                      <td className="py-3 px-4">{row.date}</td>
                      <td className="py-3 px-4">{row.desc}</td>
                      <td className="py-3 px-4 font-semibold">{row.amount}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
