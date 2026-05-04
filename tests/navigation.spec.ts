import { test, expect, devices } from '@playwright/test';

/**
 * Phase 3 ── デバイスエミュレーション + ネットワークモック
 *
 * エミュレーション:
 *   test.use({ viewport })       ビューポートサイズを上書き
 *   test.use({ ...devices[…] }) ブラウザのデバイス設定（UA・viewport・タッチ等）を一括適用
 *
 * ネットワークモック:
 *   page.route()                リクエストの傍受・変更・ブロック
 *   page.on('request', …)       全リクエストのロギング
 *   page.waitForResponse()      特定レスポンスの待機
 */

// ─────────────────────────────────────────────────────────────────────────────
// デバイスエミュレーション
// ─────────────────────────────────────────────────────────────────────────────
test.describe('モバイルエミュレーション（iPhone サイズ）', () => {
  // このブロック内のテストはすべて 390×844 のビューポートで実行される
  test.use({ viewport: { width: 390, height: 844 } });

  test('モバイルでもすべてのデータ生成ツールカードが表示される', async ({ page }) => {
    await page.goto('/ja');
    await expect(page.getByRole('link', { name: /Timestamp 変換/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /ダミーユーザー作成/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /UUID.*CUID 生成/ })).toBeVisible();
  });

  test('モバイルで Timestamp ツールが正常に動作する', async ({ page }) => {
    await page.goto('/ja/tools/timestamp');
    await expect(page.getByRole('heading', { name: /Unix Timestamp 変換/ })).toBeVisible();

    await page.getByPlaceholder('1700000000').fill('0');
    await expect(page.getByText('1970/01/01 09:00:00')).toBeVisible();
  });

  test('モバイルで ID 生成ツールが正常に動作する', async ({ page }) => {
    await page.goto('/ja/tools/id-gen');
    await expect(page.locator('code.font-mono')).toHaveCount(10);
  });

  test('モバイルでオールペア生成ツールが正常に動作する', async ({ page }) => {
    await page.goto('/ja/tools/pairwise-generator');
    await expect(page.getByRole('button', { name: /テストケースを生成/ })).toBeVisible();

    await page.getByRole('button', { name: /テストケースを生成/ }).click();
    await expect(page.locator('table')).toBeVisible();
  });
});

// ── devices を使ったタブレットエミュレーション ────────────────────────────
test.describe('タブレットエミュレーション（iPad）', () => {
  // devices['iPad (gen 7)'] から defaultBrowserType を除いて適用
  // （describe 内では defaultBrowserType は指定不可のため）
  test.use({
    viewport:          devices['iPad (gen 7)'].viewport,
    userAgent:         devices['iPad (gen 7)'].userAgent,
    deviceScaleFactor: devices['iPad (gen 7)'].deviceScaleFactor,
    isMobile:          devices['iPad (gen 7)'].isMobile,
    hasTouch:          devices['iPad (gen 7)'].hasTouch,
  });

  test('iPad でホームページが表示される', async ({ page }) => {
    await page.goto('/ja');
    await expect(page.getByRole('heading', { name: /Engineers' Toolbox/ })).toBeVisible();
  });

  test('iPad でダミーユーザーツールが表示される', async ({ page }) => {
    await page.goto('/ja/tools/dummy-user');
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ネットワークモック
// ─────────────────────────────────────────────────────────────────────────────
test.describe('ネットワークモック', () => {
  test('リクエスト監視: ページ読み込み中の HTTP リクエストをログできる', async ({ page }) => {
    const requests: string[] = [];

    // すべてのリクエストをリッスン（傍受はせず監視のみ）
    page.on('request', (request) => {
      requests.push(`${request.method()} ${new URL(request.url()).pathname}`);
    });

    await page.goto('/ja');
    await page.waitForLoadState('networkidle');

    // 少なくともメイン HTML の GET リクエストが発生していること
    expect(requests.length).toBeGreaterThan(0);
    expect(requests.some((r) => r.startsWith('GET'))).toBe(true);
  });

  test('リクエストブロック: 外部スクリプトをブロックしてもページが機能する', async ({ page }) => {
    // 本番環境でアドブロッカーが有効な場合を再現
    // ※ 開発環境では広告スクリプトは無効化済みのため実際のブロックは行われないが
    //   page.route() の使い方を示すパターンとして有効
    await page.route('**/googlesyndication.com/**', (route) => route.abort());
    await page.route('**/doubleclick.net/**', (route) => route.abort());

    await page.goto('/ja');
    // 外部スクリプトがブロックされてもメインコンテンツが表示される
    await expect(page.getByRole('heading', { name: /Engineers' Toolbox/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Timestamp 変換/ })).toBeVisible();
  });

  test('レスポンスモック: API エンドポイントをカスタムレスポンスで置き換える', async ({ page }) => {
    // NextAuth のセッション確認 API をモック（ログインなし状態を返す）
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: null,
          expires: new Date(Date.now() + 86_400_000).toISOString(),
        }),
      });
    });

    await page.goto('/ja');
    // モックレスポンスが返ってもページが正常に表示される
    await expect(page.getByRole('heading', { name: /Engineers' Toolbox/ })).toBeVisible();
  });

  test('waitForResponse: 特定レスポンスを待機してからアサーションを実行する', async ({ page }) => {
    // waitForResponse を先に宣言してから goto を呼ぶことで、レスポンスを取りこぼさない
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/ja') && res.status() === 200,
    );

    await page.goto('/ja');
    const response = await responsePromise;

    expect(response.status()).toBe(200);
    await expect(page.getByRole('heading', { name: /Engineers' Toolbox/ })).toBeVisible();
  });

  test('リクエスト変更: ヘッダーを追加してリクエストを送信する', async ({ page }) => {
    // リクエストにカスタムヘッダーを追加するパターン（例: テスト識別ヘッダー）
    await page.route('**/ja', async (route) => {
      await route.continue({
        headers: {
          ...route.request().headers(),
          'X-Test-Environment': 'playwright',
        },
      });
    });

    await page.goto('/ja');
    await expect(page.getByRole('heading', { name: /Engineers' Toolbox/ })).toBeVisible();
  });
});
