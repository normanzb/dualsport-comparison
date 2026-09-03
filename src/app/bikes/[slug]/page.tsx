import { Redirecting } from "@/components/Redirecting";
import { Sheet } from "@/components/Sheet";
import { type Bike, bikes, latestInFamily, stems } from "@/data/bikes";
import { bikePath } from "@/lib/bike-url";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const named = (b: Bike) => `${b.make} ${b.model}${b.year ? ` ${b.year}` : ""}`;

export function generateStaticParams() {
  return [...bikes.map((b) => b.slug), ...stems].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/bikes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const bike = bikes.find((b) => b.slug === slug);

  if (!bike) {
    const latest = latestInFamily(slug);
    if (!latest) return {};
    // the stem is a signpost, so point every crawler at the model it stands for
    return {
      title: `${named(latest)} | Dualsport motorcycle side by side`,
      alternates: { canonical: bikePath(latest.slug) },
      robots: { index: false, follow: true },
    };
  }

  const name = named(bike);
  return {
    title: `${name} | Dualsport motorcycle side by side`,
    description: `${name}: ${bike.spec.wetWeight} wet, ${bike.spec.seatHeight} seat, ${bike.spec.tank} tank, ${bike.spec.serviceInterval} service interval, ${bike.spec.price}. Measured against ${bikes.length - 1} other dual sport and enduro bikes on the UK market.`,
  };
}

export default async function BikePage({ params }: PageProps<"/bikes/[slug]">) {
  const { slug } = await params;
  if (bikes.some((b) => b.slug === slug)) return <Sheet initialSlug={slug} />;

  // no year on the slug: send them to the current model rather than a dead end
  const latest = latestInFamily(slug);
  if (!latest) notFound();
  const to = bikePath(latest.slug);
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <Redirecting to={to} name={named(latest)} />
    </>
  );
}
