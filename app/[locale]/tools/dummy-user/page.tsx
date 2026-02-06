'use client';

import React, { useState, useEffect } from 'react';
import { fakerJA, fakerEN } from '@faker-js/faker';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  RefreshCw, Copy, Check, ArrowLeft, Download 
} from 'lucide-react';
import Link from 'next/link';

interface DummyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
  gender: string;
}

export default function DummyUserPage() {
  const [count, setCount] = useState(5);
  const [dataLocale, setDataLocale] = useState<'ja' | 'en'>('ja');
  const [users, setUsers] = useState<DummyUser[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateUsers = () => {
    const faker = dataLocale === 'ja' ? fakerJA : fakerEN;
    const newUsers = Array.from({ length: count }).map(() => ({
      id: crypto.randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: `${faker.location.state()} ${faker.location.city()} ${faker.location.streetAddress()}`,
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toLocaleDateString(dataLocale === 'ja' ? 'ja-JP' : 'en-US'),
      gender: faker.person.sex(),
    }));
    setUsers(newUsers);
  };

  useEffect(() => {
    generateUsers();
  }, [dataLocale, count]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dummy-users-${dataLocale}.json`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-accent mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          ツール一覧に戻る
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            ダミーユーザー作成ツール
          </h1>
          <p className="text-gray-400">
            テスト用のアカウント情報をランダムに生成します。
          </p>
        </header>

        {/* 設定パネル */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">生成データの言語</label>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setDataLocale('ja')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${dataLocale === 'ja' ? 'bg-accent text-white' : 'text-gray-400'}`}
              >日本語</button>
              <button
                onClick={() => setDataLocale('en')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${dataLocale === 'en' ? 'bg-accent text-white' : 'text-gray-400'}`}
              >English</button>
            </div>
          </div>

          <div className="w-32">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">生成数</label>
            <input
              type="number" min="1" max="50" value={count}
              onChange={(e) => setCount(Math.min(50, parseInt(e.target.value) || 1))}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2 px-4 text-center text-accent font-bold focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={generateUsers} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all">
              <RefreshCw size={20} />
            </button>
            <button onClick={downloadJson} className="bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
              <Download size={18} /> JSON保存
            </button>
          </div>
        </div>

        {/* ユーザーカードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-accent/30 transition-all relative group">
              <button 
                onClick={() => copyToClipboard(JSON.stringify(user, null, 2), user.id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-accent p-2"
              >
                {copiedId === user.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <span className="text-xs text-gray-500 uppercase tracking-tighter">{user.gender}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-accent mt-0.5" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-accent mt-0.5" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-accent mt-0.5" />
                  <span>{user.birthday}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-accent mt-0.5" />
                  <span className="line-clamp-2">{user.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}