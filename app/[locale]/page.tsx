import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
//import { uploadImage } from '@/app/actions/uploadImage'; // 画像アップロードアクションをインポート
//import { generateImage } from '@/app/actions/generateImage'; // AI画像生成アクションをインポート
//import { editImage } from '@/app/actions/editImage';  // AI画像編集（image2image）アクションをインポート
import Link from "next/link";
//import ImageGallery from '@/components/ImageGallery';
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher'

// 1. 型定義を Promise<{...}> に変更
// 2. await params でアンラップしてから中身を取り出す
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 翻訳関数の初期化 (jp.json/en.json の HomePage セクションを指定)
  const t = await getTranslations('HomePage');  
  const session = await auth();
  
  //管理者権限を持っているかチェック (ADMINの場合のみ true)
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ヒーローセクション */}
      <div className="relative flex min-h-[60vh] flex-col items-center justify-center bg-[#165E83]/10 pt-20 pb-10">
        <header className="absolute top-0 flex w-full max-w-7xl items-center justify-between p-6">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
            <div className="flex items-center gap-4"> {/* ← gap-4で間隔をあける */}
            {/* 言語切り替えボタン */}
            <LanguageSwitcher locale={locale} />
            {/* ログイン/ログアウトボタン */}
            <div>
              {session?.user ? (
                <form action={async () => { "use server"; await signOut(); }}>
                  <button className="text-sm font-medium hover:text-[#165E83]">{t('logout')} ({session.user.name})</button>
                </form>
              ) : (
                <form action={async () => { "use server"; await signIn("google"); }}>
                  <button className="rounded-full bg-white/10 px-6 py-2 hover:bg-white/20">{t('login')}</button>
                </form>
              )}
            </div>
          </div>
        </header>

        <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-[#165E83] to-[#2D9BA8] bg-clip-text text-transparent py-2 leading-tight">
          {t('welcomeTitle')}
        </h2>
        
      </div>
    </main>
  );
}