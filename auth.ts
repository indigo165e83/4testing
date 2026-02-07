import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // 修正: create new... ではなく import する
// import { PrismaClient } from "@prisma/client"

// Initialize Prisma Client
// const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Connect Auth.js to your database
  adapter: PrismaAdapter(prisma), // importしたprismaを使う
  session: { strategy: "jwt" }, // JWTセッションを使用
  // Configure one or more authentication providers
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // ...add more providers here if you want
  ],
  // Callbacks are used to control what happens when an action is performed.
  callbacks: {
    // ユーザー情報をJWTトークンに保存
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    // JWTトークンの情報をセッションに渡す
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;  // ID割り当て
        session.user.role = token.role as string;  // role の値を、セッションにもコピーする
      }
      return session
    },
  },
})