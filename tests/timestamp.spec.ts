import { test, expect } from './fixtures';

/**
 * Phase 2 ── Page Object Model (POM) + Fixtures
 *
 * 書き換え前: @playwright/test を直接使い、test.beforeEach でページ遷移
 *             ロケーター定義がテストコード内に散在
 * 書き換え後: timestampPage フィクスチャが遷移と POM 生成を自動で担当
 *             ロケーターは TimestampPage に集約 → テストはアサーションに集中
 *
 * 実証する Playwright API（Locators・Assertions・Auto-waiting）:
 *   unixInput / dateInput / jstButton …  ← POM 経由のセマンティックロケーター
 *   fill / click                          ← アクション
 *   toBeVisible / toHaveText / toHaveAttribute ← アサーション
 *   Auto-waiting: fill() 後すぐ expect() を書いても Playwright が自動待機
 */
test.describe('Timestamp 変換ツール', () => {
  // ─── ページ表示確認 ────────────────────────────────────────────────
  test('ページ見出し「Unix Timestamp 変換」が表示される', async ({ timestampPage }) => {
    await expect(timestampPage.heading).toBeVisible();
  });

  // ─── Unix → 日付 変換 ─────────────────────────────────────────────
  test.describe('Unix → 日付 変換', () => {
    test('エポック秒 0 → JST 1970/01/01 09:00:00 が表示される', async ({ timestampPage }) => {
      await timestampPage.unixInput.fill('0');
      // Auto-waiting: React の setState 完了まで Playwright が自動で待機（sleep 不要）
      await expect(timestampPage.page.getByText('1970/01/01 09:00:00')).toBeVisible();
    });

    test('エポック秒 0 → UTC 1970-01-01 00:00:00 が表示される', async ({ timestampPage }) => {
      await timestampPage.unixInput.fill('0');
      await expect(timestampPage.page.getByText('1970-01-01 00:00:00')).toBeVisible();
    });

    test('12 桁以上の値は「ミリ秒として判定」と表示される', async ({ timestampPage }) => {
      await timestampPage.unixInput.fill('1700000000000');
      await expect(timestampPage.page.getByText('ミリ秒として判定')).toBeVisible();
    });

    test('11 桁以下の値は「秒として判定」と表示される', async ({ timestampPage }) => {
      await timestampPage.unixInput.fill('1700000000');
      await expect(timestampPage.page.getByText('秒として判定')).toBeVisible();
    });

    test('数値以外を入力すると JST 結果が「-」に戻る', async ({ timestampPage }) => {
      await timestampPage.unixInput.fill('not-a-number');
      await expect(timestampPage.unixToDateResult('jst')).toHaveText('-');
    });
  });

  // ─── 日付 → Unix 変換 ─────────────────────────────────────────────
  test.describe('日付 → Unix 変換', () => {
    test('日付入力で正の整数のUNIXタイムスタンプが返る', async ({ timestampPage }) => {
      await timestampPage.dateInput.fill('2024-01-01 00:00:00');
      const text = await timestampPage.dateToUnixSecondsResult.textContent();
      expect(Number(text)).toBeGreaterThan(0);
    });

    test('JST と UTC の切り替えで秒数の差が 32400 秒（9 時間分）になる', async ({ timestampPage }) => {
      await timestampPage.dateInput.fill('2024-01-01 00:00:00');

      await timestampPage.jstButton.click();
      const jstSec = Number(await timestampPage.dateToUnixSecondsResult.textContent());

      await timestampPage.utcButton.click();
      const utcSec = Number(await timestampPage.dateToUnixSecondsResult.textContent());

      // 同じ日時文字列でも JST と UTC では 9h = 32400s の差が生じる
      expect(utcSec - jstSec).toBe(32400);
    });
  });

  // ─── コピー機能 ────────────────────────────────────────────────────
  test('コピーボタンをクリックするとチェックアイコンに切り替わる', async ({ timestampPage }) => {
    await timestampPage.unixInput.fill('0');
    await expect(timestampPage.page.getByText('1970/01/01 09:00:00')).toBeVisible();

    const firstSection = timestampPage.page.locator('section').first();
    await firstSection.locator('button').filter({ has: timestampPage.page.locator('svg') }).first().click();
    await expect(firstSection.locator('.text-green-500')).toBeVisible();
  });

  // ─── ナビゲーション ────────────────────────────────────────────────
  test('「ツール一覧に戻る」リンクがホーム（/）を指している', async ({ timestampPage }) => {
    await expect(timestampPage.backLink).toHaveAttribute('href', '/');
  });
});
