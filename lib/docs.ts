import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/i18n";

export type MarkdownBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: false; items: string[] };

interface ParsedGuide {
  title: string;
  description: string;
  sections: Array<{ id: string; heading: string; blocks: MarkdownBlock[] }>;
}

export interface Guide {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  sections: Array<{
    id: string;
    heading: Record<Locale, string>;
    blocks: Record<Locale, MarkdownBlock[]>;
  }>;
}

const docsRoot = join(process.cwd(), "content", "docs");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseGuideFile(filePath: string): ParsedGuide {
  const source = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const frontMatter = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontMatter) throw new Error("Missing front matter in " + filePath);

  const metadata = new Map<string, string>();
  for (const line of frontMatter[1].split("\n")) {
    const match = line.match(/^(title|description):\s*(.+)$/);
    if (match) metadata.set(match[1], match[2].trim().replace(/^["']|["']$/g, ""));
  }

  const title = metadata.get("title");
  const description = metadata.get("description");
  if (!title || !description) throw new Error("Title or description is missing in " + filePath);

  const sections: ParsedGuide["sections"] = [];
  let active: ParsedGuide["sections"][number] | undefined;
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length && active) active.blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    paragraphLines = [];
  };
  const flushList = () => {
    if (listItems.length && active) active.blocks.push({ type: "list", ordered: false, items: listItems });
    listItems = [];
  };

  for (const rawLine of source.slice(frontMatter[0].length).split("\n")) {
    const line = rawLine.trim();
    const heading = line.match(/^##\s+([a-z0-9-]+):\s*(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      active = { id: heading[1], heading: heading[2].trim(), blocks: [] };
      sections.push(active);
      continue;
    }
    if (line.startsWith("#")) throw new Error("Only identified level-two headings are supported in " + filePath);
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      if (!active) throw new Error("Content appears before the first section in " + filePath);
      listItems.push(line.slice(2).trim());
      continue;
    }
    flushList();
    if (!active) throw new Error("Content appears before the first section in " + filePath);
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  if (sections.length === 0 || sections.some((section) => section.blocks.length === 0)) {
    throw new Error("Guide must contain non-empty sections in " + filePath);
  }
  return { title, description, sections };
}

function readLocalizedGuide(locale: Locale, slug: string): ParsedGuide {
  const filePath = join(docsRoot, locale, slug + ".md");
  if (!existsSync(filePath)) throw new Error("Missing " + locale + " guide for " + slug + " at " + filePath);
  return parseGuideFile(filePath);
}

function loadGuides(): Guide[] {
  const viDirectory = join(docsRoot, "vi");
  const enDirectory = join(docsRoot, "en");
  if (!existsSync(viDirectory) || !existsSync(enDirectory)) {
    throw new Error("Both content/docs/vi and content/docs/en are required");
  }

  const viSlugs = readdirSync(viDirectory).filter((name) => name.endsWith(".md")).map((name) => name.slice(0, -3)).sort();
  const enSlugs = readdirSync(enDirectory).filter((name) => name.endsWith(".md")).map((name) => name.slice(0, -3)).sort();
  if (viSlugs.join("|") !== enSlugs.join("|")) {
    throw new Error("Vietnamese and English documentation slugs must match exactly");
  }

  return viSlugs.map((slug) => {
    if (!slugPattern.test(slug)) throw new Error("Invalid documentation slug " + slug);
    const localized = { vi: readLocalizedGuide("vi", slug), en: readLocalizedGuide("en", slug) };
    const viIds = localized.vi.sections.map((section) => section.id);
    const enIds = localized.en.sections.map((section) => section.id);
    if (viIds.join("|") !== enIds.join("|")) {
      throw new Error("Section IDs differ between VI and EN for documentation slug " + slug);
    }
    return {
      slug,
      title: { vi: localized.vi.title, en: localized.en.title },
      description: { vi: localized.vi.description, en: localized.en.description },
      sections: localized.vi.sections.map((viSection, index) => ({
        id: viSection.id,
        heading: { vi: viSection.heading, en: localized.en.sections[index].heading },
        blocks: { vi: viSection.blocks, en: localized.en.sections[index].blocks },
      })),
    };
  });
}

export const guides = loadGuides();
export const guideSlugs = guides.map((guide) => guide.slug);
export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
