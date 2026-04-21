'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function UserProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
        <a href="/api/auth/logout" className="text-sm text-blue-400 hover:text-blue-300">
          Sign Out
        </a>
      </div>
    );
  }

  return (
    <Link href="/api/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold">
      Sign In
    </Link>
  );
}
