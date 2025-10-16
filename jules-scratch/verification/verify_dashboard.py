from playwright.sync_api import sync_playwright, Page, expect
import time

def test_dashboard_and_theme_toggle(page: Page):
    # Register a new user
    page.goto("http://localhost:3000/register")
    page.get_by_label("Nome Completo").fill("Test User")
    page.get_by_label("E-mail").fill("test.user@example.com")
    page.get_by_label("Senha").fill("password123")
    page.get_by_label("Confirmar Senha").fill("password123")
    page.get_by_role("button", name="Criar Conta").click()
    time.sleep(2)

    # Log in
    page.goto("http://localhost:3000/login")
    page.get_by_label("E-mail").fill("test.user@example.com")
    page.get_by_label("Senha").fill("password123")
    page.get_by_role("button", name="Entrar").click()
    time.sleep(2)

    # Navigate to dashboard and take screenshot
    page.goto("http://localhost:3000/dashboard")
    time.sleep(5) # wait for dashboard to load
    page.screenshot(path="jules-scratch/verification/dashboard_light.png")

    # Toggle theme and take another screenshot
    page.get_by_label("Toggle theme").click()
    time.sleep(2)
    page.screenshot(path="jules-scratch/verification/dashboard_dark.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    test_dashboard_and_theme_toggle(page)
    browser.close()