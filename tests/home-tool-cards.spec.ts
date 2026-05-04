import { test, expect } from './fixtures';

/**
 * Phase 2 ── Page Object Model (POM) + Fixtures
 *
 * 書き換え前: @playwright/test を直接使い、test.beforeEach でページ遷移
 * 書き換え後: homePage フィクスチャが遷移と POM 生成を自動で担当
 *             → テストコードはアサーションだけに集中できる
 */

const DATA_GEN_TOOLS = [
  { title: 'Timestamp 変換',    href: '/tools/timestamp'  },
  { title: 'ダミーユーザー作成', href: '/tools/dummy-user' },
  { title: 'UUID/CUID 生成',    href: '/tools/id-gen'     },
];

test.describe('ホームページ ツールカード表示確認', () => {
  // ─── ページタイトル ───────────────────────────────────────────────
  test('ページタイトルが表示される', async ({ homePage }) => {
    await expect(homePage.page).toHaveTitle('4Testing');
  });

  // ─── データ生成ツール セクション ──────────────────────────────────
  test('「データ生成ツール」セクションに3枚のカードが存在する', async ({ homePage }) => {
    // dataGenSection は HomePage POM でセクションを絞り込み済み
    await expect(homePage.dataGenSection.getByRole('link')).toHaveCount(3);
  });

  for (const tool of DATA_GEN_TOOLS) {
    test(`「${tool.title}」カードのhrefが正しい`, async ({ homePage }) => {
      await expect(
        homePage.toolCard(new RegExp(tool.title))
      ).toHaveAttribute('href', tool.href);
    });
  }

  // ─── テスト管理・設計 セクション ──────────────────────────────────
  test('「テスト管理・設計」セクションに「オールペア生成」カードが存在する', async ({ homePage }) => {
    await expect(
      homePage.managementSection.getByRole('link', { name: /オールペア生成/ })
    ).toBeVisible();
  });

  test('「オールペア生成」カードのhrefが正しい', async ({ homePage }) => {
    await expect(
      homePage.toolCard(/オールペア生成/)
    ).toHaveAttribute('href', '/tools/pairwise-generator');
  });
});
