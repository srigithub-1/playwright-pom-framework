import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

// Load test data
const testDataPath = path.join(__dirname, 'testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

for (const data of testData) {
  test(`Add ${data.product} to cart for user ${data.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.open();
    await loginPage.login(data.username, data.password);

    const productLocator = `[data-test="add-to-cart-${data.product.toLowerCase().replace(/ /g, '-')}"]`;
    await page.click(productLocator);
    await productsPage.verifyCartCount('1');
    await productsPage.openCartAndVerifyProduct(data.product);
  });
}