import type { Metadata } from "next";
import { GlobalNotFoundView } from "@/components/not-found-view";
import "@fontsource-variable/manrope";
import "@/app/globals.css";
import "@/app/design-system.css";

export const metadata: Metadata = {
  title: "404 · VGD",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="vi">
      <body>
        <GlobalNotFoundView />
      </body>
    </html>
  );
}
