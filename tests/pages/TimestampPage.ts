import { type Page, type Locator } from '@playwright/test';

export class TimestampPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly unixInput: Locator;
  readonly dateInput: Locator;
  readonly jstButton: Locator;
  readonly utcButton: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Unix Timestamp 変換/ });
    this.unixInput = page.getByPlaceholder('1700000000');
    this.dateInput = page.getByPlaceholder('2023-01-01 09:00:00');
    this.jstButton = page.getByRole('button', { name: 'JST として入力' });
    this.utcButton = page.getByRole('button', { name: 'UTC として入力' });
    this.backLink = page.getByRole('link', { name: /ツール一覧に戻る/ });
  }

  async goto(locale = 'ja') {
    await this.page.goto(`/${locale}/tools/timestamp`);
  }

  // Unix→日付セクション（最初のsection）の変換結果
  // <input> にも font-mono クラスが付くため、span に限定して取得する
  unixToDateResult(tz: 'jst' | 'utc'): Locator {
    return this.page.locator('section').first().locator('span.font-mono').nth(tz === 'jst' ? 0 : 1);
  }

  // 日付→Unixセクションのresultスパン
  get dateToUnixSecondsResult(): Locator {
    return this.page.locator('section').last().locator('span.font-mono').first();
  }

  get dateToUnixMillisResult(): Locator {
    return this.page.locator('section').last().locator('span.font-mono').last();
  }
}
