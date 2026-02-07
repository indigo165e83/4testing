'use client';

import { useLocale } from 'next-intl';

type Names = {
  [key: string]: string | undefined;
};

export const LocalizedText = ({ names, className }: { names: any; className?: string }) => {
  const data = names as Names;
  // 値がない場合に表示する文字（ここを "(なし)" などに変えられます）
  const emptyText = '-';

  // データがあればその値を、なければ代替テキストを使用
  const ja = data['ja'] || emptyText;
  const en = data['en'] || emptyText;

  // 常に "ja / en" の形式で出力
  return <span className={className}>{ja} / {en}</span>;
    /*
  const locale = useLocale();
  const data = names as Names;
  
  // 現在の言語があれば表示、なければ日本語、それもなければ 'Unknown'
  const text = data[locale] || data['ja'] || 'Unknown';

  return <span className={className}>{text}</span>;
  */
};