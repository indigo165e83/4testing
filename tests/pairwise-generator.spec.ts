import { test, expect } from './fixtures';

/**
 * Phase 2 ── Page Object Model (POM) + Fixtures
 *
 * ・PairwisePage（Page Object）にロケーター定義を集約
 *   → テストコードが「何をするか」だけに集中できる
 *
 * ・pairwisePage フィクスチャが自動でナビゲーションと POM 生成を担当
 *   → test.beforeEach() を各 describe に書かなくて済む
 *
 * ・フィクスチャは tests/fixtures/index.ts で定義
 */
test.describe('オールペア生成ツール', () => {
  test('ページ見出しが表示される', async ({ pairwisePage }) => {
    await expect(pairwisePage.heading).toBeVisible();
  });

  test('デフォルトで 3 つのパラメータが表示される', async ({ pairwisePage }) => {
    expect(await pairwisePage.getParamCount()).toBe(3);
  });

  // ── テストケース生成 ────────────────────────────────────────────────
  test.describe('テストケース生成', () => {
    test('「テストケースを生成」でテーブルが表示される', async ({ pairwisePage }) => {
      await expect(pairwisePage.resultTable).not.toBeVisible();

      await pairwisePage.generateButton.click();

      await expect(pairwisePage.resultTable).toBeVisible();
    });

    test('生成件数が全組み合わせ数（18件）より少ない', async ({ pairwisePage }) => {
      // デフォルト: OS(3値) × ブラウザ(3値) × ログイン状態(2値) = 最大 18 通り
      // ペアワイズ法では全網羅よりも少ないケース数でペアを網羅できる
      await pairwisePage.generateButton.click();

      const count = await pairwisePage.getTestCaseCount();
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(18);
    });

    test('生成後に「CSVコピー」ボタンが表示される', async ({ pairwisePage }) => {
      await expect(pairwisePage.csvCopyButton).not.toBeVisible();

      await pairwisePage.generateButton.click();

      await expect(pairwisePage.csvCopyButton).toBeVisible();
    });

    test('カバー対象ペア数ラベルが生成前から表示される', async ({ pairwisePage }) => {
      await expect(pairwisePage.page.getByText(/カバー対象ペア数/)).toBeVisible();
    });
  });

  // ── バリデーション ──────────────────────────────────────────────────
  test.describe('バリデーション', () => {
    test('有効パラメータが 1 つ以下のときエラーメッセージが表示される', async ({ pairwisePage }) => {
      // P3(index:2) → P2(index:1) の順で削除し、パラメータを 1 つにする
      await pairwisePage.deleteButton(2).click();
      await pairwisePage.deleteButton(1).click();

      await pairwisePage.generateButton.click();

      await expect(pairwisePage.errorMessage).toBeVisible();
    });
  });

  // ── パラメータ追加・削除 ─────────────────────────────────────────────
  test.describe('パラメータ追加・削除', () => {
    test('「パラメータを追加」でパラメータ数が増える', async ({ pairwisePage }) => {
      const before = await pairwisePage.getParamCount();

      await pairwisePage.addParamButton.click();

      expect(await pairwisePage.getParamCount()).toBe(before + 1);
    });

    test('削除ボタンでパラメータ数が減る', async ({ pairwisePage }) => {
      const before = await pairwisePage.getParamCount();

      await pairwisePage.deleteButton(0).click();

      expect(await pairwisePage.getParamCount()).toBe(before - 1);
    });

    test('Enter キーでパラメータに値を追加できる', async ({ pairwisePage }) => {
      // 4 つ目のパラメータを追加して値を入力
      await pairwisePage.addParamButton.click();
      const newIndex = (await pairwisePage.getParamCount()) - 1;

      await pairwisePage.addValueToParam(newIndex, 'テスト値A');
      await pairwisePage.addValueToParam(newIndex, 'テスト値B');

      await expect(pairwisePage.page.getByText('テスト値A')).toBeVisible();
      await expect(pairwisePage.page.getByText('テスト値B')).toBeVisible();
    });

    test('値バッジの削除ボタンでパラメータの値を削除できる', async ({ pairwisePage }) => {
      // aria-label="Windowsを削除" ボタンが初期状態で存在する
      const deleteWindowsBtn = pairwisePage.page.getByRole('button', { name: 'Windowsを削除' });
      await expect(deleteWindowsBtn).toBeVisible();

      await deleteWindowsBtn.click();

      // 削除後: ボタン（＝バッジ）が消える
      await expect(deleteWindowsBtn).not.toBeVisible();
    });
  });
});
