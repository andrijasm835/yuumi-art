import { ArtistScene } from "@/components/ArtistScene";
import { BookingScene } from "@/components/BookingScene";
import { CustomCursor } from "@/components/CustomCursor";
import { DetailsScene } from "@/components/DetailsScene";
import { HeroExperience } from "@/components/HeroExperience";
import { LooksGallery } from "@/components/LooksGallery";
import { Navigation } from "@/components/Navigation";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TransformationScene } from "@/components/TransformationScene";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <ScrollProgress />
      <Navigation />
      <CustomCursor />
      <HeroExperience />
      <TransformationScene />
      <LooksGallery />
      <DetailsScene />
      <ArtistScene />
      <BookingScene />
    </main>
  );
}
