import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Upthrust CMS",
  robots: { index: false, follow: false },
};

// Separate root layout so the CMS never ships the marketing site's fonts, CSS or GTM.
export default function KeystaticLayout() {
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
