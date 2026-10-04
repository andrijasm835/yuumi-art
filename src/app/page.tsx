import { ArtistScene } from "@/components/ArtistScene";
import { BookingScene } from "@/components/BookingScene";
import { CustomCursor } from "@/components/CustomCursor";
import { DetailsScene } from "@/components/DetailsScene";
import { HeroExperience } from "@/components/HeroExperience";
import { LooksGallery } from "@/components/LooksGallery";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SelectedWorkGallery } from "@/components/SelectedWorkGallery";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TransformationScene } from "@/components/TransformationScene";
import { brand } from "@/content/site";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Yuumi Art",
  url: "https://www.yuumiart.com",
  image: "https://www.yuumiart.com/yummi/hero-yuumi-logo.jpg",
  logo: "https://www.yuumiart.com/yummi/hero-logo-red.png",
  description:
    "Yuumi Art je makeup studio Adriane iz Lebana. Profesionalno šminkanje uz individualan pristup i fokus na prirodan, elegantan izgled.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lebane",
    addressCountry: "RS",
  },
  sameAs: [brand.instagram],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <HeroExperience />
      <TransformationScene />
      <LooksGallery />
      <DetailsScene />
      <ArtistScene />
      <SelectedWorkGallery />
      <BookingScene />
    </main>
  );
}
