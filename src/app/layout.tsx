import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({ variable: "--font-bebas", subsets: ["latin"], weight: "400" });
const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Dual Sport Index — 14 bikes, both sides, same scale",
  description:
    "A single-page comparison of 14 dual sport and enduro motorcycles: service intervals, weights, tank capacity, seat height and typical UK prices, with every bike drawn to the same scale.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${bebas.variable} ${plex.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
