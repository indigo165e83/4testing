'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Shuffle, Copy, Check, Table2 } from 'lucide-react';
import Link from 'next/link';
import { generatePairwise, countTotalPairs, Parameter } from '@/lib/pairwise-algorithm';

interface ParamInput {
  id: string;
  name: string;
  values: string[];
  draft: string;
}

function makeId() {
  return Math.random().toString(36).slice(2);
}

const INITIAL_PARAMS: ParamInput[] = [
  { id: makeId(), name: 'OS', values: ['Windows', 'Mac', 'Linux'], draft: '' },
  { id: makeId(), name: 'ブラウザ', values: ['Chrome', 'Firefox', 'Safari'], draft: '' },
  { id: makeId(), name: 'ログイン状態', values: ['ログイン済み', '未ログイン'], draft: '' },
];

export default function PairwiseGeneratorPage() {
  const [params, setParams] = useState<ParamInput[]>(INITIAL_PARAMS);
  const [testCases, setTestCases] = useState<string[][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const update = (id: string, patch: Partial<ParamInput>) =>
    setParams(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));

  const addValue = (id: string) => {
    const param = params.find(p => p.id === id);
    if (!param) return;
    const v = param.draft.trim();
    if (!v || param.values.includes(v)) {
      update(id, { draft: '' });
      return;
    }
    update(id, { values: [...param.values, v], draft: '' });
  };

  const removeValue = (id: string, value: string) =>
    update(id, { values: params.find(p => p.id === id)!.values.filter(v => v !== value) });

  const addParam = () =>
    setParams(prev => [...prev, { id: makeId(), name: `パラメータ${prev.length + 1}`, values: [], draft: '' }]);

  const removeParam = (id: string) => setParams(prev => prev.filter(p => p.id !== id));

  const validParams: Parameter[] = params
    .filter(p => p.name.trim() && p.values.length > 0)
    .map(p => ({ name: p.name.trim(), values: p.values }));

  const handleGenerate = () => {
    setError(null);
    if (validParams.length < 2) {
      setError('値が設定されたパラメータを2つ以上追加してください。');
      return;
    }
    setTestCases(generatePairwise(validParams));
  };

  const copyAsCSV = () => {
    if (!testCases) return;
    const header = ['No.', ...validParams.map(p => p.name)].join(',');
    const rows = testCases.map((tc, i) => [i + 1, ...tc].join(','));
    navigator.clipboard.writeText([header, ...rows].join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPairs = validParams.length >= 2 ? countTotalPairs(validParams) : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-400 hover:text-accent mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          ツール一覧に戻る
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent flex items-center gap-3">
            <Shuffle size={32} className="text-accent" />
            オールペア（ペアワイズ）テスト生成
          </h1>
          <p className="text-gray-400 max-w-2xl">
            パラメータとその値を設定し、任意の2つのパラメータの全値の組み合わせが少なくとも1回登場する最小テストケース群を生成します。
          </p>
        </header>

        {/* Parameter inputs */}
        <div className="space-y-4 mb-6">
          {params.map((param, idx) => (
            <div key={param.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 w-8">
                  P{idx + 1}
                </span>
                <input
                  type="text"
                  value={param.name}
                  onChange={e => update(param.id, { name: e.target.value })}
                  placeholder="パラメータ名"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-accent"
                />
                <button
                  onClick={() => removeParam(param.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors p-2"
                  aria-label="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 ml-11">
                {param.values.map(v => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 bg-accent/20 border border-accent/30 text-accent-light text-sm rounded-full px-3 py-1"
                  >
                    {v}
                    <button
                      onClick={() => removeValue(param.id, v)}
                      className="hover:text-red-400 transition-colors leading-none"
                      aria-label={`${v}を削除`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={param.draft}
                    onChange={e => update(param.id, { draft: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && addValue(param.id)}
                    placeholder="値を追加…"
                    className="bg-black/40 border border-white/10 rounded-full px-3 py-1 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-accent w-32"
                  />
                  <button
                    onClick={() => addValue(param.id)}
                    className="text-accent hover:text-accent-light transition-colors p-1"
                    aria-label="値を追加"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addParam}
            className="w-full border border-dashed border-white/20 hover:border-accent/40 rounded-2xl py-4 text-gray-500 hover:text-accent transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} />
            パラメータを追加
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <button
            onClick={handleGenerate}
            className="bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <Shuffle size={18} />
            テストケースを生成
          </button>
          {totalPairs > 0 && (
            <span className="text-sm text-gray-500">
              カバー対象ペア数:{' '}
              <span className="text-accent font-semibold">{totalPairs}</span>
            </span>
          )}
        </div>

        {/* Results */}
        {testCases && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Table2 size={18} className="text-accent" />
                テストケース一覧
                <span className="text-sm font-normal text-gray-400">
                  ({testCases.length}件)
                </span>
              </h2>
              <button
                onClick={copyAsCSV}
                className="text-sm text-gray-400 hover:text-accent flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} />
                )}
                CSVコピー
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/10 border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 w-12">
                      No.
                    </th>
                    {validParams.map(p => (
                      <th
                        key={p.name}
                        className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400"
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {testCases.map((tc, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-600 font-mono">{i + 1}</td>
                      {tc.map((val, j) => (
                        <td key={j} className="px-4 py-3 text-gray-300">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
