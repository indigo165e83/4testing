'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Copy, Check, ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export default function TimestampPage() {
  // --- Unix -> Date ---
  const [unixInput, setUnixInput] = useState<string>('');
  const [unixResult, setUnixResult] = useState<{ utc: string, jst: string } | null>(null);
  
  // --- Date -> Unix ---
  const [dateInput, setDateInput] = useState<string>('');
  const [inputType, setInputType] = useState<'JST' | 'UTC'>('JST');
  const [dateResult, setDateResult] = useState<{ seconds: number, millis: number } | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  // 初期値設定 (現在時刻)
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    setUnixInput(now.toString());
    handleUnixChange(now.toString());
    
    // 日付入力の初期値 (JST)
    const nowJst = new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).format(new Date()).replace(/\//g, '-');
    setDateInput(nowJst);
    handleDateChange(nowJst, 'JST');
  }, []);

  // Unix -> Date 変換ロジック
  const handleUnixChange = (val: string) => {
    setUnixInput(val);
    if (!val || isNaN(Number(val))) {
      setUnixResult(null);
      return;
    }

    let num = Number(val);
    // 11桁以上ならミリ秒とみなす、それ以下なら秒とみなして1000倍
    // (例: 1700000000 -> 秒, 1700000000000 -> ミリ秒)
    const date = new Date(val.length >= 12 ? num : num * 1000);

    if (isNaN(date.getTime())) {
      setUnixResult(null);
      return;
    }

    setUnixResult({
      utc: date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ''),
      jst: new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      }).format(date) // yyyy/mm/dd hh:mm:ss
    });
  };

  // Date -> Unix 変換ロジック
  const handleDateChange = (val: string, type: 'JST' | 'UTC') => {
    setDateInput(val);
    setInputType(type);
    
    // 入力が不完全な場合はスキップ
    if (val.length < 10) {
      setDateResult(null);
      return;
    }

    // ハイフンやスラッシュを統一してパースしやすくする
    let formatted = val.replace(/\//g, '-').replace(' ', 'T');
    if (!formatted.includes('T') && formatted.length > 10) {
        // "2023-01-01 10:00:00" -> "2023-01-01T10:00:00"
        formatted = formatted.replace(' ', 'T');
    }

    let date: Date;
    if (type === 'UTC') {
      date = new Date(formatted + (formatted.endsWith('Z') ? '' : 'Z'));
    } else {
      // JST (+09:00) として解釈
      date = new Date(formatted + '+09:00');
    }

    if (isNaN(date.getTime())) {
      setDateResult(null);
      return;
    }

    const millis = date.getTime();
    setDateResult({
      seconds: Math.floor(millis / 1000),
      millis: millis
    });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-accent mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          ツール一覧に戻る
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent flex items-center gap-3">
            <Clock /> Unix Timestamp 変換
          </h1>
          <p className="text-gray-400">
            Unix Timestamp と 日付(JST/UTC) を相互に変換します。
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {/* --- Unix to Date --- */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
            <h2 className="text-lg font-bold mb-4 text-accent flex items-center gap-2">
              <ArrowDown size={18} /> Unix Timestamp <span className="text-gray-500 text-sm">→</span> 日付
            </h2>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 mb-2 block">Unix Timestamp (秒 / ミリ秒)</label>
              <input
                type="text"
                value={unixInput}
                onChange={(e) => handleUnixChange(e.target.value)}
                placeholder="1700000000"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono focus:border-accent outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2 text-right">
                {unixInput.length >= 12 ? 'ミリ秒として判定' : '秒として判定'}
              </p>
            </div>

            <div className="mt-auto space-y-3">
              {['JST', 'utc'].map((tz) => (
                <div key={tz} className="bg-black/20 rounded-xl p-3 border border-white/5 flex justify-between items-center group">
                  <div>
                    <span className="text-xs font-bold text-gray-500 block mb-1 uppercase">{tz}</span>
                    <span className="font-mono text-gray-200">
                        {unixResult ? (tz === 'JST' ? unixResult.jst : unixResult.utc) : '-'}
                    </span>
                  </div>
                  {unixResult && (
                    <button
                      onClick={() => copyToClipboard(tz === 'JST' ? unixResult.jst : unixResult.utc, `u-${tz}`)}
                      className="text-gray-500 hover:text-accent p-2 transition-colors"
                    >
                      {copied === `u-${tz}` ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* --- Date to Unix --- */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
             <h2 className="text-lg font-bold mb-4 text-accent flex items-center gap-2">
              <ArrowUp size={18} /> 日付 <span className="text-gray-500 text-sm">→</span> Unix Timestamp
            </h2>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 mb-2 block">日付文字列 (YYYY-MM-DD HH:mm:ss)</label>
              <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={dateInput}
                    onChange={(e) => handleDateChange(e.target.value, inputType)}
                    placeholder="2023-01-01 09:00:00"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-accent outline-none transition-colors"
                />
              </div>
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 w-fit">
                {(['JST', 'UTC'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleDateChange(dateInput, t)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${inputType === t ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {t} として入力
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex justify-between items-center group">
                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-1">秒 (Seconds)</span>
                  <span className="font-mono text-gray-200">{dateResult ? dateResult.seconds : '-'}</span>
                </div>
                {dateResult && (
                  <button
                    onClick={() => copyToClipboard(dateResult.seconds.toString(), 'd-sec')}
                    className="text-gray-500 hover:text-accent p-2 transition-colors"
                  >
                    {copied === 'd-sec' ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                  </button>
                )}
              </div>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex justify-between items-center group">
                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-1">ミリ秒 (Millis)</span>
                  <span className="font-mono text-gray-200">{dateResult ? dateResult.millis : '-'}</span>
                </div>
                {dateResult && (
                  <button
                    onClick={() => copyToClipboard(dateResult.millis.toString(), 'd-ms')}
                    className="text-gray-500 hover:text-accent p-2 transition-colors"
                  >
                    {copied === 'd-ms' ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}