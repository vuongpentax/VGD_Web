import { expect, test } from "@playwright/test";

interface ContrastFailure {
  selector: string;
  sample: string;
  colour: string;
  size: string;
  ratio: number;
  required: number;
}

/**
 * Walks every visible run of text and compares it with the background actually
 * painted behind it. This is the regression guard for text that disappears
 * when a colour token is repointed: white on white scores 1.0 and fails here.
 *
 * Runs inside the browser, so it must stay self-contained.
 * Thresholds are WCAG 2.1 AA: 4.5:1 for body text, 3:1 for large text.
 */
function auditContrast(): ContrastFailure[] {
  const parse = (value: string) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(",").map(Number);
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const luminance = (colour: { r: number; g: number; b: number }) =>
    [colour.r, colour.g, colour.b]
      .map((channel) => channel / 255)
      .map((channel) => (channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)))
      .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
  const backgroundOf = (element: Element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const colour = parse(getComputedStyle(node).backgroundColor);
      if (colour && colour.a > 0.5) return colour;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const failures: ContrastFailure[] = [];
  for (const element of Array.from(document.querySelectorAll("body *"))) {
    const styles = getComputedStyle(element);
    if (styles.visibility === "hidden" || styles.display === "none") continue;
    if (!(element as HTMLElement).offsetParent && styles.position !== "fixed") continue;
    if (element.closest("[aria-hidden=true]")) continue;

    const text = Array.from(element.childNodes)
      .filter((node) => node.nodeType === 3)
      .map((node) => (node.textContent ?? "").trim())
      .join("");
    if (!text) continue;

    const foreground = parse(styles.color);
    if (!foreground) continue;
    const background = backgroundOf(element);
    const flattened = {
      r: foreground.r * foreground.a + background.r * (1 - foreground.a),
      g: foreground.g * foreground.a + background.g * (1 - foreground.a),
      b: foreground.b * foreground.a + background.b * (1 - foreground.a),
    };
    const [lighter, darker] = [luminance(flattened), luminance(background)].sort((a, b) => b - a);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    const size = parseFloat(styles.fontSize);
    const isLarge = size >= 24 || (size >= 18.66 && parseInt(styles.fontWeight, 10) >= 700);
    const required = isLarge ? 3 : 4.5;
    if (ratio < required) {
      failures.push({
        selector: element.tagName.toLowerCase() + (element.className ? "." + String(element.className).split(" ").join(".") : ""),
        sample: text.slice(0, 40),
        colour: styles.color,
        size: styles.fontSize,
        ratio: Number(ratio.toFixed(2)),
        required,
      });
    }
  }
  return failures;
}

const pages = [
  "/vi", "/vi/plugins", "/vi/plugins/bim-lite", "/vi/center", "/vi/docs",
  "/vi/docs/website-va-center", "/vi/changelog", "/vi/roadmap", "/vi/about", "/vi/contact",
  "/en", "/en/plugins", "/en/about", "/en/docs/cai-vgd-center",
  "/vi/khong-ton-tai",
];

for (const path of pages) {
  test(`text on ${path} meets WCAG AA contrast`, async ({ page }) => {
    await page.goto(path);
    const failures = await page.evaluate(auditContrast);
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });
}

test("the open mobile menu meets contrast too", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/vi");
  await page.locator(".menu-toggle").click();
  await expect(page.locator("#primary-navigation")).toHaveClass(/is-open/);
  const failures = await page.evaluate(auditContrast);
  expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
});
