const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Register a new user
  await page.goto('http://localhost:3000/register');
  await page.getByLabel('Nome Completo').fill('Test User');
  await page.getByLabel('E-mail').fill('test.user@example.com');
  await page.getByLabel('Senha').fill('password123');
  await page.getByLabel('Confirmar Senha').fill('password123');
  await page.getByRole('button', { name: 'Criar Conta' }).click();
  await page.waitForTimeout(2000);

  // Log in
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('E-mail').fill('test.user@example.com');
  await page.getByLabel('Senha').fill('password123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForTimeout(2000);

  // Navigate to dashboard and take screenshot
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(5000); // wait for dashboard to load
  await page.screenshot({ path: 'jules-scratch/verification/dashboard_light.png' });

  // Toggle theme and take another screenshot
  await page.getByLabel('Toggle theme').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'jules-scratch/verification/dashboard_dark.png' });

  await browser.close();
})();