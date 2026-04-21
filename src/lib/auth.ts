import { getSession } from '@auth0/nextjs-auth0';

export async function getAuth() {
  try {
    const session = await getSession();
    return session;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated() {
  const session = await getAuth();
  return !!session;
}
