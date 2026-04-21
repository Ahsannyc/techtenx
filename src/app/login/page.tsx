import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-semibold text-2xl">TechTenX</Link>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-blue-400">Home</Link>
            <Link href="/pricing" className="hover:text-blue-400">Pricing</Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-gray-400">Sign in to access your TechTenX dashboard</p>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <a href="/api/auth/login" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all block text-center">
              Sign In with Auth0
            </a>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <a href="/api/auth/login?connection=google-oauth2" className="w-full border border-white/10 hover:bg-white/5 text-white font-semibold py-3 rounded-lg transition-all block text-center">
              Google
            </a>

            <a href="/api/auth/login?connection=github" className="w-full border border-white/10 hover:bg-white/5 text-white font-semibold py-3 rounded-lg transition-all block text-center">
              GitHub
            </a>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <a href="/api/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
