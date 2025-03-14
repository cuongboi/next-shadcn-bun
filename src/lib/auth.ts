import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';
import { Redis } from '@upstash/redis';
import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { cookies } from 'next/headers';

import jwt from '@/lib/jwt';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      emailVerified?: Date | null;
    } & DefaultSession['user'];
  }
}

export type SessionUser = Required<NonNullable<DefaultSession['user']>>;

/**
 * Singleton redis to avoid multiple instantiations.
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthConfig = {
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
  },
  adapter: UpstashRedisAdapter(redis),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  jwt: {
    async encode({ token }) {
      return jwt.sign(token ?? {}, String(process.env.AUTH_SECRET));
    },
    async decode({ token }) {
      return jwt.verify(String(token ?? ''), String(process.env.AUTH_SECRET));
    },
  },
  cookies: {
    sessionToken: { name: 'accessToken' },
    callbackUrl: { name: 'callback-url', options: { path: '/' } },
    csrfToken: { name: 'csrf-token', options: { path: '/' } },
  },
  pages: { signIn: '/login' },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

export const getCookieUser = async () => {
  const cookieStore = await cookies();
  const user = await jwt.verify<SessionUser>(
    cookieStore.get('accessToken')?.value ?? 'x.x.x',
    String(process.env.AUTH_SECRET),
  );

  return user;
};
