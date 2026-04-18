import { test, expect } from '@playwright/test';

const DATA_GEN_TOOLS = [
  { title: 'Timestamp 変換',    href: '/tools/timestamp'  },
  { title: 'ダミーユーザー作成', href: '/tools/dummy-user' },
  { title: 'UUID/CUID 生成',    href: '/tools/id-gen'     },
];

test.describe('ホームページ ツールカード表示確認', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ja');
  });

  // ─── ページタイトル ─────────────────────────────────────
  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page).toHaveTitle('4Testing');
  });

  // ─── データ生成ツール セクション ────────────────────────
  test('「データ生成ツール」セクションに3枚のカードが存在する', async ({ page }) => {
    const section = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'データ生成ツール' }),
    });
    await expect(section.getByRole('link')).toHaveCount(3);
  });

  for (const tool of DATA_GEN_TOOLS) {
    test(`「${tool.title}」カードのhrefが正しい`, async ({ page }) => {
      const link = page.getByRole('link', { name: new RegExp(tool.title) });
      await expect(link).toHaveAttribute('href', tool.href);
    });
  }

  // ─── テスト管理・設計 セクション ────────────────────────
  test('「テスト管理・設計」セクションに「オールペア生成」カードが存在する', async ({ page }) => {
    const section = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'テスト管理・設計' }),
    });
    await expect(section.getByRole('link', { name: /オールペア生成/ })).toBeVisible();
  });

  test('「オールペア生成」カードのhrefが正しい', async ({ page }) => {
    const link = page.getByRole('link', { name: /オールペア生成/ });
    await expect(link).toHaveAttribute('href', '/tools/pairwise-generator');
  });
});
