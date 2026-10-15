import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/i18n";

export type MarkdownBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: false; items: string[] };

export type PublicationStatus = "draft" | "published";

interface ParsedGuide {
  title: string;
  description: string;
  publicationStatus: PublicationStatus;
  sections: Array<{ id: string; heading: string; blocks: MarkdownBlock[] }>;
}

export interface Guide {
  slug: string;
  publicationStatus: PublicationStatus;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  sections: Array<{
    id: string;
    heading: Record<Locale, string>;
    blocks: Record<Locale, MarkdownBlock[]>;
  }>;
}

const docsRoot = join(process.cwd(), "content", "docs");
const slugSegmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseGuideFile(filePath: string): ParsedGuide {
  const source = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const frontMatter = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontMatter) throw new Error("Missing front matter in " + filePath);

  const metadata = new Map<string, string>();
  for (const line of frontMatter[1].split("\n")) {
    const match = line.match(/^(title|description|publication_status):\s*(.+)$/);
    if (match) metadata.set(match[1], match[2].trim().replace(/^["']|["']$/g, ""));
  }

  const title = metadata.get("title");
  const description = metadata.get("description");
  const publicationStatus = metadata.get("publication_status") ?? "draft";
  if (!title || !description) throw new Error("Title or description is missing in " + filePath);
  if (publicationStatus !== "draft" && publicationStatus !== "published") {
    throw new Error("Invalid publication_status in " + filePath);
  }

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
  return { title, description, publicationStatus, sections };
}

function listGuideSlugs(directory: string, parentSegments: string[] = []): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      if (entry.isDirectory()) {
        return listGuideSlugs(join(directory, entry.name), [...parentSegments, entry.name]);
      }
      if (!entry.isFile() || !entry.name.endsWith(".md")) return [];

      const filename = entry.name.slice(0, -3);
      const segments = [...parentSegments, filename];
      if (segments.some((segment) => !slugSegmentPattern.test(segment))) {
        throw new Error("Invalid documentation path " + segments.join("/"));
      }
      return [segments.join("/")];
    });
}

function readLocalizedGuide(locale: Locale, slug: string): ParsedGuide {
  const segments = slug.split("/");
  if (segments.length === 0 || segments.some((segment) => !slugSegmentPattern.test(segment))) {
    throw new Error("Invalid documentation slug " + slug);
  }
  const filePath = join(docsRoot, locale, ...segments) + ".md";
  if (!existsSync(filePath)) throw new Error("Missing " + locale + " guide for " + slug + " at " + filePath);
  return parseGuideFile(filePath);
}

function loadGuides(): Guide[] {
  const viDirectory = join(docsRoot, "vi");
  const enDirectory = join(docsRoot, "en");
  if (!existsSync(viDirectory) || !existsSync(enDirectory)) {
    throw new Error("Both content/docs/vi and content/docs/en are required");
  }

  const viSlugs = listGuideSlugs(viDirectory);
  const enSlugs = listGuideSlugs(enDirectory);
  if (viSlugs.join("|") !== enSlugs.join("|")) {
    throw new Error("Vietnamese and English documentation paths must match exactly");
  }

  return viSlugs.map((slug) => {
    const localized = { vi: readLocalizedGuide("vi", slug), en: readLocalizedGuide("en", slug) };
    if (localized.vi.publicationStatus !== localized.en.publicationStatus) {
      throw new Error("Publication status differs between VI and EN for documentation slug " + slug);
    }
    const viIds = localized.vi.sections.map((section) => section.id);
    const enIds = localized.en.sections.map((section) => section.id);
    if (viIds.join("|") !== enIds.join("|")) {
      throw new Error("Section IDs differ between VI and EN for documentation slug " + slug);
    }
    return {
      slug,
      publicationStatus: localized.vi.publicationStatus,
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
export const publishedGuides = guides.filter((guide) => guide.publicationStatus === "published");
export const publishedGuideSlugs = publishedGuides
  .filter((guide) => guide.publicationStatus === "published")
  .map((guide) => guide.slug);

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
