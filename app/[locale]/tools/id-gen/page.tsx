'use client';

import React, { useState, useEffect } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { Copy, RefreshCw, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function IdGenPage() {
  const [count, setCount] = useState(10);
  const [idType, setIdType] = useState<'uuid' | 'cuid'>('uuid');
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // ID生成ロジック
  const generateIds = () => {
    const newIds = Array.from({ length: count }).map(() => {
      return idType === 'uuid' ? crypto.randomUUID() : createId();
    });
    setGeneratedIds(newIds);
  };

  // 初回レンダリング時に生成
  useEffect(() => {
    generateIds();
  }, [idType, count]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(generatedIds.join('\n'));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-accent mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          ツール一覧に戻る
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            UUID / CUID 生成ツール
          </h1>
          <p className="text-gray-400">
            テストに必要なユニークIDを素早く生成します。UUID(v4)とCUIDに対応。
          </p>
        </header>

        {/* コントロールパネル */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              IDタイプ
            </label>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              {(['uuid', 'cuid'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setIdType(type)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    idType === type ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="w-32">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              生成数 (最大100)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, parseInt(e.target.value) || 1))}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2 px-4 text-center text-accent font-bold focus:outline-none focus:border-accent"
            />
          </div>

          <button
            onClick={generateIds}
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all group"
            title="再生成"
          >
            <RefreshCw size={20} className="group-active:rotate-180 transition-transform duration-500" />
          </button>

          <button
            onClick={copyAll}
            className="bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-xl font-bold transition-all"
          >
            すべてコピー
          </button>
        </div>

        {/* 生成結果リスト */}
        <div className="space-y-3">
          {generatedIds.map((id, index) => (
            <div
              key={index}
              className="group flex items-center justify-between bg-white/5 border border-white/5 hover:border-accent/30 rounded-xl px-6 py-4 transition-all"
            >
              <code className="text-sm md:text-base font-mono text-gray-300 group-hover:text-white transition-colors">
                {id}
              </code>
              <button
                onClick={() => copyToClipboard(id, index)}
                className="text-gray-500 hover:text-accent transition-colors p-2"
                title="コピー"
              >
                {copiedIndex === index ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}