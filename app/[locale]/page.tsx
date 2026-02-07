import { auth, signIn, signOut } from '@/auth';
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ToolCard } from '@/components/ToolCard';
import { Fingerprint, UserCircle, FileText, Database, Zap, Layers, List } from 'lucide-react';

// ツールデータの定義
const dataGenTools = [
  {
    title: 'ダミーユーザー作成',
    description: '氏名、住所、電話番号などのプロフィールをランダム生成。',
    icon: UserCircle,
    href: '/tools/dummy-user',
    category: 'Data Generation'
  },
  {
    title: 'UUID/CUID 生成',
    description: 'テストデータとして必要なUUID(v4)やCUIDを一括生成。',
    icon: Fingerprint,
    href: '/tools/id-gen',
    category: 'Data Generation'
  },
  /*
  {
    title: '大量テキスト生成',
    description: 'レイアウト崩れ確認用のダミーテキストを生成。',
    icon: FileText,
    href: '/tools/bulk-text',
    category: 'Data Generation'
  },
  {
    title: 'JSON/SQL ダミー生成',
    description: 'スキーマに従ったDB挿入用データを生成。',
    icon: Database,
    href: '/tools/schema-gen',
    category: 'Data Generation'
  }
  */
];

// テスト管理ツール
const managementTools = [
{
    title: 'カテゴリ管理マスタ',
    description: '【ADMIN専用】テスト因子の登録・編集・削除を行います。',
    icon: Layers,
    href: '/tools/categories', // 管理者用ページ
    category: 'Test Management'
  },
  {
    title: 'カテゴリ一覧',
    description: '登録されているテスト因子と水準を参照します（閲覧のみ）。',
    icon: List,
    href: '/tools/category-list', // ★今回追加した閲覧用ページ
    category: 'Test Management'
  }
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');  
  const session = await auth();

  // 管理者権限チェック
  const isAdmin = session?.user?.role === 'ADMIN';

  // 表示する管理ツールをフィルタリング
  const visibleManagementTools = managementTools.filter((tool) => {
    // カテゴリ管理マスタ (/tools/categories) は管理者のみ表示
    if (tool.href === '/tools/categories') {
      return isAdmin;
    }
    // それ以外（カテゴリ一覧表など）は全員に表示
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ヒーローセクション */}
      <div className="relative flex min-h-[70vh] flex-col items-center justify-center bg-accent/10 pt-20 pb-10">
        <header className="absolute top-0 flex w-full max-w-7xl items-center justify-between p-6">
          {/* ブランド名ロゴ部分 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white">4</div>
            <h1 className="text-2xl font-bold tracking-tight py-1 leading-normal">4Testing</h1>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <div>
              {session?.user ? (
                <form action={async () => { "use server"; await signOut(); }}>
                  <button className="text-sm font-medium hover:text-accent transition-colors">
                    {t('logout')} ({session.user.name})
                  </button>
                </form>
              ) : (
                <form action={async () => { "use server"; await signIn("google"); }}>
                  <button className="rounded-full bg-white/10 px-6 py-2 hover:bg-white/20 transition-all">
                    {t('login')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </header>

        <div className="text-center px-6">
          <h2 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent py-2 leading-tight">
            Engineers' Toolbox
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            テスト業務を加速させる、データ生成・テスト設計補助ツール集。
          </p>
        </div>

        {/* --- セクション 1: データ生成 --- */}
        <section className="w-full max-w-7xl mx-auto mt-12 px-6">
          <div className="flex items-center gap-2 mb-8">
            <Zap className="text-yellow-400" size={20} />
            <h3 className="text-xl font-semibold">データ生成ツール</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataGenTools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </section>
        {/* --- セクション 2: テスト管理 --- */}
        {/* 表示できるツールが1つでもある場合のみセクションを表示 */}
        {visibleManagementTools.length > 0 && (
          <section className="w-full max-w-7xl mx-auto mt-16 px-6">
            <div className="flex items-center gap-2 mb-8">
              <Layers className="text-accent" size={20} />
              <h3 className="text-xl font-semibold">テスト管理・設計</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleManagementTools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </section>
        )}

      </div>
      <footer className="border-t border-accent/20 py-8 text-center text-gray-500 mt-20">
        <p>&copy; 2026 4Testing - Engineers' Toolbox</p>
      </footer>
    </main>
  );
}