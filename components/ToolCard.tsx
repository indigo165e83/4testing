import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: string;
}

export const ToolCard = ({ title, description, icon: Icon, href, category }: ToolCardProps) => {
  return (
    <Link href={href} className="group relative block p-1 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 hover:from-accent/20 hover:to-accent-light/20 transition-all duration-300">
      <div className="relative bg-gray-900 rounded-[calc(1rem-1px)] p-6 h-full flex flex-col justify-between overflow-hidden border border-white/10 group-hover:border-accent/30">
        {/* 背景の装飾的なグラデーション */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-accent/10 blur-3xl rounded-full group-hover:bg-accent/20 transition-colors" />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            {/* アイコン背景と色 */}
            <div className="p-3 rounded-xl bg-accent/20 text-accent group-hover:text-accent-light transition-colors">
              <Icon size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-accent/50 transition-colors">
              {category}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-light transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* リンクテキストの色 */}
        <div className="mt-6 flex items-center text-sm font-medium text-accent group-hover:text-accent-light">
          <span>使ってみる</span>
          <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};