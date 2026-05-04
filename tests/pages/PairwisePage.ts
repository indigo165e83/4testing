import { type Page, type Locator } from '@playwright/test';

export class PairwisePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly generateButton: Locator;
  readonly addParamButton: Locator;
  readonly resultTable: Locator;
  readonly errorMessage: Locator;
  readonly csvCopyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /オールペア/ });
    this.generateButton = page.getByRole('button', { name: /テストケースを生成/ });
    this.addParamButton = page.getByRole('button', { name: /パラメータを追加/ });
    this.resultTable = page.locator('table');
    this.errorMessage = page.getByText('値が設定されたパラメータを2つ以上');
    this.csvCopyButton = page.getByRole('button', { name: /CSVコピー/ });
  }

  async goto(locale = 'ja') {
    await this.page.goto(`/${locale}/tools/pairwise-generator`);
  }

  paramNameInput(index: number): Locator {
    return this.page.locator('input[placeholder="パラメータ名"]').nth(index);
  }

  valueDraftInput(paramIndex: number): Locator {
    return this.page.locator('input[placeholder="値を追加…"]').nth(paramIndex);
  }

  deleteButton(paramIndex: number): Locator {
    return this.page.locator('button[aria-label="削除"]').nth(paramIndex);
  }

  async addValueToParam(paramIndex: number, value: string) {
    const draftInput = this.valueDraftInput(paramIndex);
    await draftInput.fill(value);
    await draftInput.press('Enter');
  }

  async getParamCount(): Promise<number> {
    return this.page.locator('input[placeholder="パラメータ名"]').count();
  }

  async getTestCaseCount(): Promise<number> {
    return this.resultTable.locator('tbody tr').count();
  }
}
