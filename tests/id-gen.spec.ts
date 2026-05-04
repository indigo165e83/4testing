import { test, expect } from '@playwright/test';

/**
 * Phase 1 ── Assertions（count・正規表現・toHaveCount）
 *
 * 実証する Playwright API:
 *   locator.count()     要素数の取得
 *   locator.nth(i)      インデックスによる要素指定
 *   locator.textContent() テキスト内容の取得
 *   toHaveCount()       要素数アサーション
 *   expect().toMatch()  正規表現による文字列検証
 */

const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const CUID2_RE   = /^[a-z][a-z0-9]{23}$/;   // @paralleldrive/cuid2 のデフォルト形式（24文字）

test.describe('UUID / CUID 生成ツール', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ja/tools/id-gen');
  });

  test('ページ見出しが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /UUID.*CUID 生成ツール/ })).toBeVisible();
  });

  // ── UUID 生成 ──────────────────────────────────────────────────────────
  test.describe('UUID 生成', () => {
    test('デフォルトで 10 件の UUID が生成される', async ({ page }) => {
      await expect(page.locator('code.font-mono')).toHaveCount(10);
    });

    test('生成された全 UUID が v4 フォーマットに準拠している', async ({ page }) => {
      const items = page.locator('code.font-mono');
      const count = await items.count();

      for (let i = 0; i < count; i++) {
        const text = (await items.nth(i).textContent()) ?? '';
        expect(text.trim(), `ID[${i}] が UUID v4 フォーマットと不一致`).toMatch(UUID_V4_RE);
      }
    });
  });

  // ── CUID 生成 ──────────────────────────────────────────────────────────
  test.describe('CUID 生成', () => {
    test('CUID に切り替えると cuid2 フォーマットの ID が生成される', async ({ page }) => {
      await page.getByRole('button', { name: 'CUID' }).click();
      const items = page.locator('code.font-mono');
      const count = await items.count();

      for (let i = 0; i < count; i++) {
        const text = (await items.nth(i).textContent()) ?? '';
        expect(text.trim(), `ID[${i}] が CUID2 フォーマットと不一致`).toMatch(CUID2_RE);
      }
    });
  });

  // ── 生成数の変更 ─────────────────────────────────────────────────────
  test.describe('生成数の変更', () => {
    test('生成数を 5 に変更すると 5 件になる', async ({ page }) => {
      await page.locator('input[type="number"]').fill('5');
      await expect(page.locator('code.font-mono')).toHaveCount(5);
    });

    test('生成数を 20 に変更すると 20 件になる', async ({ page }) => {
      await page.locator('input[type="number"]').fill('20');
      await expect(page.locator('code.font-mono')).toHaveCount(20);
    });
  });

  // ── ボタン ─────────────────────────────────────────────────────────────
  test('「すべてコピー」ボタンが表示される', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'すべてコピー' })).toBeVisible();
  });

  test('UUID と CUID を切り替えると同じ件数のまま別形式の ID が表示される', async ({ page }) => {
    await expect(page.locator('code.font-mono')).toHaveCount(10);

    await page.getByRole('button', { name: 'CUID' }).click();
    await expect(page.locator('code.font-mono')).toHaveCount(10);

    await page.getByRole('button', { name: 'UUID' }).click();
    await expect(page.locator('code.font-mono')).toHaveCount(10);
  });
});
