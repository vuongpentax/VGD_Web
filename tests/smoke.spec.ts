import { expect, test } from "@playwright/test";

const routes = [
  "", "/plugins", "/plugins/bim-lite", "/center", "/docs",
  "/docs/website-va-center", "/docs/cai-vgd-center", "/changelog", "/roadmap", "/about", "/contact",
];

test.describe("routes", () => {
  for (const locale of ["vi", "en"] as const) {
    for (const path of routes) {
      test(`/${locale}${path} renders with lang=${locale} and noindex`, async ({ page }) => {
        const response = await page.goto(`/${locale}${path}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
        await expect(page.locator("h1")).toHaveCount(1);
      });
    }
  }

  test("/ redirects to /vi", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/vi$/);
  });

  test("robots.txt blocks crawling and the sitemap stays empty while in preview", async ({ request }) => {
    expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow: \//);
    expect(await (await request.get("/sitemap.xml")).text()).not.toMatch(/<loc>/);
  });

  test("security headers are set, X-Powered-By is hidden, favicon is served", async ({ request }) => {
    const headers = (await request.get("/vi")).headers();
    expect(headers["x-powered-by"]).toBeUndefined();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect((await request.get("/icon.svg")).status()).toBe(200);
  });
});

test.describe("404", () => {
  for (const [path, locale, heading] of [
    ["/khong-ton-tai", "vi", "Không tìm thấy trang"],
    ["/vi/khong-ton-tai", "vi", "Không tìm thấy trang"],
    ["/vi/plugins/khong-ton-tai", "vi", "Không tìm thấy trang"],
    ["/en/docs/missing", "en", "Page not found"],
  ] as const) {
    test(`${path} shows the branded ${locale} 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.locator("h1")).toHaveText(heading);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator(".site-header")).toBeVisible();
      await expect(page.locator(".site-footer")).toBeVisible();
    });
  }
});

test.describe("release safety", () => {
  test("product pages show the no-release state and offer no downloads", async ({ page }) => {
    await page.goto("/vi/plugins/dim");
    await expect(page.getByText("Chưa có bản phát hành").first()).toBeVisible();
    await expect(page.locator('a[href$=".rbz"], a[download]')).toHaveCount(0);
  });

  test("no page invents a version number", async ({ page }) => {
    for (const path of ["/vi", "/vi/plugins", "/vi/plugins/dim", "/vi/changelog", "/vi/center"]) {
      await page.goto(path);
      const body = await page.locator("body").innerText();
      expect(body, path).not.toMatch(/\bv?\d+\.\d+\.\d+\b/);
    }
  });

  test("the Center page offers no download link", async ({ page }) => {
    await page.goto("/vi/center");
    await expect(page.getByText("Chưa có link tải chính thức")).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("the current section is marked with aria-current", async ({ page }) => {
    await page.goto("/vi/plugins/bim-lite");
    const current = page.locator('.site-nav > a[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute("href", "/vi/plugins");
  });

  test("the language switch keeps path, query and hash", async ({ page }) => {
    await page.goto("/vi/docs/cai-vgd-center?ref=test#download");
    await page.locator(".language-switch a", { hasText: "EN" }).click();
    await expect(page).toHaveURL(/\/en\/docs\/cai-vgd-center\?ref=test#download$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("the 404 language switch goes to the locale home", async ({ page }) => {
    await page.goto("/vi/khong-ton-tai");
    await page.locator(".language-switch a", { hasText: "EN" }).click();
    await expect(page).toHaveURL(/\/en$/);
  });

  test("guide pagination and sidebar link to real guides", async ({ page }) => {
    await page.goto("/vi/docs/website-va-center");
    for (const link of await page.locator(".guide-pagination a, .guide-sidebar a").all()) {
      const href = await link.getAttribute("href");
      expect((await page.request.get(href!)).status(), href!).toBe(200);
    }
  });
});

test.describe("catalog", () => {
  test("search and product pills filter the grid", async ({ page }) => {
    await page.goto("/vi/plugins");
    const cards = page.locator(".product-card");
    const total = await cards.count();
    expect(total).toBeGreaterThan(1);

    await page.getByRole("searchbox").fill("dim");
    await expect(cards).toHaveCount(1);

    await page.getByRole("searchbox").fill("zzz");
    await expect(cards).toHaveCount(0);
    await page.getByRole("button", { name: /Xóa bộ lọc/ }).click();
    await expect(cards).toHaveCount(total);

    await page.locator(".catalog-filters button", { hasText: "Cabinet" }).click();
    await expect(cards).toHaveCount(1);
  });

  test("product marks are distinct", async ({ page }) => {
    await page.goto("/vi/plugins");
    const marks = await page.locator(".product-card-tile.is-marked").allTextContents();
    expect(marks.length).toBeGreaterThan(1);
    expect(new Set(marks).size).toBe(marks.length);
  });

  test("the product rail flags itself when it scrolls", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 });
    await page.goto("/vi");
    const rail = page.locator(".product-switcher");
    await expect(rail).toHaveAttribute("data-overflowing", "true");
    // Every product must stay reachable by scrolling, not be cut off for good.
    const reachable = await rail.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(reachable).toBe(true);
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test("moves focus in, traps Tab, closes on Escape", async ({ page }) => {
    await page.goto("/vi");
    const toggle = page.locator(".menu-toggle");
    await toggle.click();

    await expect(page.locator("#primary-navigation")).toHaveClass(/is-open/);
    await expect(page.locator("#primary-navigation a").first()).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.locator("#primary-navigation a").last().focus();
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.locator("#primary-navigation")).not.toHaveClass(/is-open/);
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });
});

test.describe("layout", () => {
  test("no heading collapses onto the text below it", async ({ page }) => {
    for (const path of ["/vi", "/vi/plugins", "/vi/plugins/bim-lite", "/vi/about", "/vi/docs/cai-vgd-center", "/en/khong-ton-tai"]) {
      await page.goto(path);
      const collapsed = await page.evaluate(() =>
        Array.from(document.querySelectorAll("h1, h2, h3"))
          .filter((heading) => (heading as HTMLElement).offsetParent)
          .map((heading) => {
            const styles = getComputedStyle(heading);
            return { text: (heading.textContent ?? "").slice(0, 30), size: parseFloat(styles.fontSize), lineHeight: parseFloat(styles.lineHeight) };
          })
          .filter((heading) => !Number.isNaN(heading.lineHeight) && heading.lineHeight < heading.size),
      );
      expect(collapsed, `${path}: ${JSON.stringify(collapsed)}`).toEqual([]);
    }
  });

  for (const width of [360, 375, 768, 900, 1024, 1280, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/vi", "/en/plugins", "/vi/plugins/cabinet", "/vi/docs/website-va-center", "/en/center", "/vi/about"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} @ ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});
