import { getCategories } from '@/app/actions/category';
import { LocalizedText } from '@/components/LocalizedText';
import { List, ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';

export default async function CategoryListPage() {
  // 認証チェックなしでデータを取得（未ログインでもOK）
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-accent mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          ホームに戻る
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent flex items-center gap-3">
            <List /> テストカテゴリ一覧表
          </h1>
          <p className="text-gray-400">
            現在定義されているテスト因子と水準の一覧です。テスト設計の参照用としてご利用ください。
          </p>
        </header>

        {/* カテゴリ一覧グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full hover:border-accent/30 transition-colors">
              
              {/* カテゴリヘッダー */}
              <div className="p-4 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-accent/20 text-accent text-[10px] px-2 py-0.5 rounded font-mono">
                    {category.slug}
                  </span>
                  <h3 className="font-bold text-lg text-white">
                    <LocalizedText names={category.names} />
                  </h3>
                </div>
              </div>

              {/* 項目リスト */}
              <div className="p-4 flex-1">
                {category.items.length === 0 ? (
                  <p className="text-gray-600 text-sm italic">項目がありません</p>
                ) : (
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item.id} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0"></span>
                        <div>
                          <span className="text-xs text-gray-500 font-mono mr-2">{item.slug}</span>
                          <LocalizedText names={item.names} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}