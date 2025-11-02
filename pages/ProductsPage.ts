import { Page, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly addToCartButton;
  readonly cartBadge;
  readonly cartLink;
  readonly firstProductName;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.firstProductName = page.locator('.inventory_item_name');
  }

  async addProductToCart() {
    await this.addToCartButton.click();
  }

  async verifyCartCount(expectedCount: string) {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }

  async openCartAndVerifyProduct(productName: string) {
    await this.cartLink.click();
    await expect(this.firstProductName).toHaveText(productName);
  }
}