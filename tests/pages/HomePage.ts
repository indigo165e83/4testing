import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly dataGenSection: Locator;
  readonly managementSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: "Engineers' Toolbox" });
    this.dataGenSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'データ生成ツール' }),
    });
    this.managementSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'テスト管理・設計' }),
    });
  }

  async goto(locale = 'ja') {
    await this.page.goto(`/${locale}`);
  }

  toolCard(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name });
  }
}
