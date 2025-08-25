import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnBusinessSetup = nextUrl.pathname.startsWith('/business-setup')
      
      if (isOnDashboard || isOnBusinessSetup) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      return true
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig