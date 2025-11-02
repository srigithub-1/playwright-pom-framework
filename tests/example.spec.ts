//Import the necessary modules from Playwright testing library, including 'test' and 'expect'.
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  //Take a screenshot of the page and save it to the specified path.
  await page.screenshot({ path: 'C:\\Users\\USER\\tests\\example.png' });
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  await expect(page).toHaveURL(/.*intro/);
});
