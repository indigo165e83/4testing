'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // auth をインポート
import { revalidatePath } from 'next/cache';

// 権限チェック用のヘルパー関数
async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
}

// カテゴリ一覧を取得 (ここは誰でもOK)
export async function getCategories() {
  return await prisma.category.findMany({
    include: { items: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
}

// カテゴリ作成 (ADMINのみ)
export async function createCategory(formData: FormData) {
  await checkAdmin(); // ← この1行を追加

  const slug = formData.get('slug') as string;
  const nameJa = formData.get('nameJa') as string;
  const nameEn = formData.get('nameEn') as string;

  if (!slug || !nameJa) return;

  await prisma.category.create({
    data: {
      slug,
      names: {
        ja: nameJa,
        en: nameEn || undefined,
      },
    },
  });
  revalidatePath('/tools/categories');
}

// カテゴリ削除 (ADMINのみ)
export async function deleteCategory(id: string) {
  await checkAdmin(); // ← 追加
  await prisma.category.delete({ where: { id } });
  revalidatePath('/tools/categories');
}

// 項目追加 (ADMINのみ)
export async function addItem(formData: FormData) {
  await checkAdmin(); // ← 追加

  const categoryId = formData.get('categoryId') as string;
  const slug = formData.get('slug') as string;
  const nameJa = formData.get('nameJa') as string;
  const nameEn = formData.get('nameEn') as string;

  if (!categoryId || !slug || !nameJa) return;

  await prisma.categoryItem.create({
    data: {
      categoryId,
      slug,
      names: {
        ja: nameJa,
        en: nameEn || undefined,
      },
    },
  });
  revalidatePath('/tools/categories');
}

// 項目削除 (ADMINのみ)
export async function deleteItem(id: string) {
  await checkAdmin(); // ← 追加
  await prisma.categoryItem.delete({ where: { id } });
  revalidatePath('/tools/categories');
}