"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { StatusState } from "@/components/status-state";

export interface ProductMediaItem {
  /** Use an approved local asset under /public; remote hosts are not configured. */
  src: string;
  alt: Record<Locale, string>;
  caption?: Record<Locale, string>;
}

function MediaFigure({ item, locale }: { item: ProductMediaItem; locale: Locale }) {
  const [failed, setFailed] = useState(false);
  const isLocalAsset = item.src.startsWith("/") && !item.src.startsWith("//") && !item.src.split("/").includes("..");
  if (failed || !isLocalAsset) return <StatusState
    kind="unavailable" className="media-gallery-error" headingLevel={3} icon="!"
    title={locale === "vi" ? "Ảnh hiện không khả dụng" : "Image unavailable"}
    description={locale === "vi" ? "Ảnh sẽ xuất hiện lại khi tệp được khôi phục." : "The image will return when its file is restored."}
  />;

  return <figure className="media-gallery-item">
    <div className="media-gallery-frame">
      <Image src={item.src} alt={item.alt[locale]} fill sizes="(max-width: 740px) 100vw, 760px" onError={() => setFailed(true)} />
    </div>
    {item.caption?.[locale] ? <figcaption>{item.caption[locale]}</figcaption> : null}
  </figure>;
}

export function MediaGallery({ locale, items }: { locale: Locale; items: ProductMediaItem[] }) {
  if (items.length === 0) return <StatusState
    kind="empty" className="media-gallery-empty" headingLevel={3} icon="▧"
    title={locale === "vi" ? "Ảnh giới thiệu đang chờ VGD cung cấp" : "Product imagery is pending from VGD"}
    description={locale === "vi"
      ? "Ảnh giao diện và workflow đã được duyệt sẽ xuất hiện tại đây."
      : "Approved interface and workflow images will appear here."}
  />;

  return <div className="media-gallery" role="group" aria-label={locale === "vi" ? "Ảnh sản phẩm" : "Product images"}>
    {items.map((item) => <MediaFigure key={item.src} item={item} locale={locale} />)}
  </div>;
}
