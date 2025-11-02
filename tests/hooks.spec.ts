import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 📸 After every test, save a timestamped screenshot
test.afterEach(async ({ page }, testInfo) => {
  const dateFolder = new Date().toISOString().slice(0, 10);
  const folderPath = path.join(__dirname, '..', 'screenshots', dateFolder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${testInfo.title}-${timestamp}.png`;
  const fullPath = path.join(folderPath, fileName);

  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`✅ Screenshot saved: ${fullPath}`);
});