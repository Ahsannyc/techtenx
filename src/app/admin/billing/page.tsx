import { getSession } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAILS = ['admin@techtenx.com'];

export default async function BillingPage() {
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
            <h1 className="text-4xl font-bold mb-2">Revenue & Billing</h1>
            <p className="text-gray-400">Monitor subscriptions, payments, and revenue</p>
          </div>

          {/* Revenue Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Monthly Recurring Revenue', value: '$0', change: '+0%' },
              { label: 'Total Subscriptions', value: '0', change: '+0%' },
              { label: 'Churn Rate', value: '0%', change: '-0%' }
            ].map((metric, i) => (
              <div key={i} className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                <p className="text-3xl font-bold mb-2">{metric.value}</p>
                <p className="text-sm text-green-400">{metric.change} from last month</p>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { customer: 'john@example.com', plan: 'Pro', amount: '$99.00', date: 'Mar 21, 2026', status: 'Completed' },
                    { customer: 'jane@example.com', plan: 'Starter', amount: '$29.00', date: 'Mar 20, 2026', status: 'Completed' },
                    { customer: 'bob@example.com', plan: 'Starter', amount: '$29.00', date: 'Mar 19, 2026', status: 'Failed' },
                  ].map((tx) => (
                    <tr key={tx.customer} className="border-b border-white/10 hover:bg-zinc-800/30">
                      <td className="py-3 px-4 text-sm">{tx.customer}</td>
                      <td className="py-3 px-4 text-sm">{tx.plan}</td>
                      <td className="py-3 px-4 font-semibold">{tx.amount}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">{tx.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'Completed'
                            ? 'bg-green-900/30 text-green-300'
                            : 'bg-red-900/30 text-red-300'
                        }`}>
                          {tx.status}
                        </span>
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
