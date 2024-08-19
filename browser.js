import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://test.k6.io/my_messages.php");

    await page.locator('input[name="login"]').type("admin");
    await page.locator('input[name="password"]').type("123");

    await Promise.all([
      page.waitForNavigation(),
      page.locator('input[type="submit"]').click(),
    ]);

    const header = await page.locator("h2").textContent();
    check(header, {
      header: (h) => h == "Welcome, admin!",
    });

    const navigationTiming = JSON.parse(await page.evaluate(() => {
      const [navigation] = performance.getEntriesByType('navigation');
      return JSON.stringify({
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
        loadEvent: navigation.loadEventEnd - navigation.startTime,
        firstPaint: performance.getEntriesByName('first-paint')[0].startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0].startTime,
      });
    }));
  
    // Check if page loaded correctly
    check(navigationTiming, {
      'domContentLoaded < 2s': (t) => t.domContentLoaded < 2000,
      'loadEvent < 3s': (t) => t.loadEvent < 3000,
      'firstPaint < 1s': (t) => t.firstPaint < 1000,
      'firstContentfulPaint < 1.5s': (t) => t.firstContentfulPaint < 1500,
    });
  } finally {
    await page.close();
  }
}
