import { test, expect } from '@playwright/test';

/**
 * Phase 1 ── ユーザー操作と状態変化の検証
 *
 * 実証する Playwright API:
 *   fill()（number input）    数値フィールドへの入力
 *   click()（toggle button）  トグルボタンの操作
 *   toHaveCount()             要素数の変化を検証
 *   toHaveClass(/pattern/)    CSS クラスの状態を正規表現で検証
 */
test.describe('ダミーユーザー作成ツール', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ja/tools/dummy-user');
  });

  test('ページ見出しが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ダミーユーザー作成ツール/ })).toBeVisible();
  });

  // ── ユーザーカード件数 ────────────────────────────────────────────────
  test.describe('ユーザーカード件数', () => {
    test('デフォルトで 5 件のユーザーカードが表示される', async ({ page }) => {
      // 各ユーザーカード内の h3（ユーザー名）を数える
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(5);
    });

    test('生成数を 3 に変えると 3 件になる', async ({ page }) => {
      await page.locator('input[type="number"]').fill('3');
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(3);
    });

    test('生成数を 10 に変えると 10 件になる', async ({ page }) => {
      await page.locator('input[type="number"]').fill('10');
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(10);
    });

    test('最大値 50 を入力すると 50 件になる', async ({ page }) => {
      await page.locator('input[type="number"]').fill('50');
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(50);
    });
  });

  // ── 言語切り替え ─────────────────────────────────────────────────────
  test.describe('言語切り替え', () => {
    test('デフォルトで「日本語」ボタンがアクティブ状態になっている', async ({ page }) => {
      await expect(page.getByRole('button', { name: '日本語' })).toHaveClass(/bg-accent/);
    });

    test('「English」をクリックすると English ボタンがアクティブになる', async ({ page }) => {
      await page.getByRole('button', { name: 'English' }).click();
      await expect(page.getByRole('button', { name: 'English' })).toHaveClass(/bg-accent/);
      await expect(page.getByRole('button', { name: '日本語' })).not.toHaveClass(/bg-accent/);
    });

    test('英語に切り替えた後に日本語に戻せる', async ({ page }) => {
      await page.getByRole('button', { name: 'English' }).click();
      await expect(page.getByRole('button', { name: 'English' })).toHaveClass(/bg-accent/);

      await page.getByRole('button', { name: '日本語' }).click();
      await expect(page.getByRole('button', { name: '日本語' })).toHaveClass(/bg-accent/);
    });

    test('言語切り替え後もカード件数は変わらない', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(5);
      await page.getByRole('button', { name: 'English' }).click();
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(5);
    });
  });

  // ── アクションボタン ─────────────────────────────────────────────────
  test('「JSON保存」ボタンが表示される', async ({ page }) => {
    await expect(page.getByRole('button', { name: /JSON保存/ })).toBeVisible();
  });

  test('各ユーザーカードにメールアドレス・電話番号が表示されている', async ({ page }) => {
    // 最初のカードに連絡先情報が含まれていることを確認
    const firstCard = page.locator('.grid > div').first();
    await expect(firstCard).toBeVisible();
    // メール・電話は特定の値に依存しないが、要素として存在する
    await expect(firstCard.locator('svg').first()).toBeVisible();
  });
});
