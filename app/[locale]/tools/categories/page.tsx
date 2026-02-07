import { getCategories, createCategory, deleteCategory, addItem, deleteItem } from '@/app/actions/category';
import { LocalizedText } from '@/components/LocalizedText';
import { Layers, Plus, Trash2, ArrowLeft, Globe, Hash } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function CategoriesPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN'; // 管理者かどうか判定    
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
            <Layers /> カテゴリ管理マスタ
          </h1>
          <p className="text-gray-400">
            テスト条件の因子（OS, ブラウザ等）と水準を多言語で定義します。
          </p>
        </header>

{/* --- カテゴリ追加フォーム (ADMINのみ表示) --- */}
        {isAdmin && (
          <div className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="text-accent" size={20} /> 新しいカテゴリを作成
            </h2>
            <form action={createCategory} className="flex flex-wrap gap-4 items-end">
              <div className="w-32">
                <label className="text-xs font-bold text-gray-500 mb-1 block">Slug (必須)</label>
                <input name="slug" placeholder="color" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-accent outline-none" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-bold text-gray-500 mb-1 block">日本語名 (必須)</label>
                <input name="nameJa" placeholder="色" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-accent outline-none" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-bold text-gray-500 mb-1 block">英語名 (任意)</label>
                <input name="nameEn" placeholder="Color" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-accent outline-none" />
              </div>
              <button type="submit" className="bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-xl font-bold transition-all">
                作成
              </button>
            </form>
          </div>
        )}

        {/* --- カテゴリ一覧 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              
              {/* カテゴリヘッダー */}
              <div className="p-5 bg-white/5 border-b border-white/5 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-accent/20 text-accent text-[10px] px-2 py-0.5 rounded font-mono">
                      {category.slug}
                    </span>
                    <h3 className="font-bold text-xl text-white">
                      <LocalizedText names={category.names} />
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    {JSON.stringify(category.names).replace(/"/g, '').replace(/,/g, ', ')}
                  </p>
                </div>
                {/* 削除ボタン (ADMINのみ) */}
                {isAdmin && (
                  <form action={deleteCategory.bind(null, category.id)}>
                    <button className="text-gray-600 hover:text-red-400 p-2 transition-colors" title="カテゴリ削除">
                      <Trash2 size={18} />
                    </button>
                  </form>
                )}
              </div>

              {/* 項目追加フォーム (ADMINのみ表示) */}
              {isAdmin && (
                <div className="px-5 py-4 bg-black/20 border-b border-white/5">
                  <form action={addItem} className="flex gap-2 items-center">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <input name="slug" placeholder="Slug (red)" required className="w-24 bg-transparent border-b border-white/20 px-2 py-1 text-xs text-gray-300 focus:border-accent outline-none" />
                    <input name="nameJa" placeholder="日本語 (赤)" required className="flex-1 bg-transparent border-b border-white/20 px-2 py-1 text-xs text-gray-300 focus:border-accent outline-none" />
                    <input name="nameEn" placeholder="英語 (Red)" className="flex-1 bg-transparent border-b border-white/20 px-2 py-1 text-xs text-gray-300 focus:border-accent outline-none" />
                    <button type="submit" className="text-accent hover:text-white p-1">
                      <Plus size={18} />
                    </button>
                  </form>
                </div>
              )}

              {/* 項目リスト */}
              <div className="p-2 flex-1 overflow-y-auto max-h-[300px]">
                {category.items.length === 0 ? (
                  <p className="text-center text-gray-600 text-sm py-8">項目がありません</p>
                ) : (
                  <ul className="space-y-1">
                    {category.items.map((item) => (
                      <li key={item.id} className="group flex items-center justify-between hover:bg-white/5 px-3 py-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent"></span>
                          <span className="text-xs text-gray-500 font-mono w-16 truncate">{item.slug}</span>
                          <span className="text-sm text-gray-200">
                            <LocalizedText names={item.names} />
                          </span>
                        </div>
                        {/* 削除ボタン (ADMINのみ) */}
                        {isAdmin && (
                          <form action={deleteItem.bind(null, item.id)}>
                            <button className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
                              <Trash2 size={14} />
                            </button>
                          </form>
                        )}
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