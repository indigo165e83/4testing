import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TimestampPage } from '../pages/TimestampPage';
import { PairwisePage } from '../pages/PairwisePage';

type Fixtures = {
  homePage: HomePage;
  timestampPage: TimestampPage;
  pairwisePage: PairwisePage;
};

/**
 * カスタムフィクスチャ定義
 *
 * Page Object + 初期ナビゲーションをフィクスチャとして提供する。
 * 各テストは beforeEach を書かずに POM インスタンスを直接受け取れる。
 */
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const p = new HomePage(page);
    await p.goto('ja');
    await use(p);
  },

  timestampPage: async ({ page }, use) => {
    const p = new TimestampPage(page);
    await p.goto('ja');
    await use(p);
  },

  pairwisePage: async ({ page }, use) => {
    const p = new PairwisePage(page);
    await p.goto('ja');
    await use(p);
  },
});

export { expect };
