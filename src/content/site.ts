import { bookingServices } from "@/lib/booking/services";

export const brand = {
  name: "Yuumi Art",
  navName: "YUUMI ART",
  artistName: "Adriana",
  artistLabel: "ADRIANA · MAKEUP ARTIST",
  location: "Lebane, Srbija",
  locationDisplay: "LEBANE, SRBIJA",
  instagram: "https://www.instagram.com/yuumi__art",
};

export const hero = {
  label: brand.artistLabel,
  headlineTop: "Beauty,",
  headlineBottom: "but make it yours.",
  scrollPrompt: "SKROLUJ ZA DALJE",
};

export const makeupProps = {
  brush: "/makeup/props/brush.svg",
  compact: "/makeup/props/compact.svg",
  lipstick: "/makeup/props/lipstick.svg",
  mascara: "/makeup/props/mascara.svg",
  eyeliner: "/makeup/props/eyeliner.svg",
  sponge: "/makeup/props/sponge.svg",
  eyelashCurler: "/makeup/props/eyelash-curler.svg",
  eyeshadowPalette: "/makeup/props/eyeshadow-palette.svg",
  powderPuff: "/makeup/props/powder-puff.svg",
};

export const detailImages = {
  lips: {
    src: "/yummi/details-1.jpg",
    alt: "Tamni editorial makeup portret sa bisernom ogrlicom",
    position: { desktop: "52% 38%", mobile: "52% 34%" },
  },
  eye: {
    src: "/yummi/details-2.jpg",
    alt: "Beauty portret sa crvenim noktima i naglašenim očima",
    position: { desktop: "50% 42%", mobile: "48% 38%" },
  },
  texture: {
    src: "/yummi/details-3.jpg",
    alt: "Tamni editorial portret sa crnom rukavicom",
    position: { desktop: "48% 38%", mobile: "47% 35%" },
  },
};

export const transformation = {
  image: "/yummi/professional-makeup.jpg",
  alt: "Realni Yuumi Art makeup portret sa naglašenim očima, ujednačenim tenom i definisanim usnama",
  position: { desktop: "52% 36%", mobile: "54% 34%" },
};

export const artist = {
  name: brand.artistName.toUpperCase(),
  intro:
    "Za mene šminka nije način da sakriješ sebe, već da istakneš ono što te čini posebnom.",
  bio:
    "Svakom licu pristupam individualno, sa pažnjom prema detaljima i željom da finalni izgled i dalje bude — ti.",
  education:
    "Kroz profesionalno šminkanje i edukacije želim da svaka devojka stekne više sigurnosti, znanja i osećaja za lepotu koja joj prirodno pripada.",
  image: "/yummi/artist.jpg",
  alt: "Adriana, makeup artistkinja iza Yuumi Art brenda",
  position: { desktop: "50% 58%", mobile: "50% 52%" },
};

export const booking = {
  reflection: "/yummi/booking.jpg",
  reflectionAlt: "Tamni editorial makeup portret u ogledalu",
  position: { desktop: "48% 34%", mobile: "48% 30%" },
};

export const servicesAndEducation = [
  {
    id: bookingServices[0].id,
    name: bookingServices[0].name.toUpperCase(),
    nameLines: ["PROFESIONALNO", "ŠMINKANJE"],
    text: bookingServices[0].description,
    frame: "h-[54svh] w-[82vw] self-end mb-[7svh] md:h-[62svh] md:w-[78vw] lg:h-[58vh] lg:w-[72vw] lg:mb-[8vh]",
    layout: "bottom-left",
    image: "/yummi/professional-makeup.jpg",
    imageAlt: "Profesionalno šminkanje sa bronzanim tenom i naglašenim očima",
    fit: "cover",
    position: { desktop: "50% 36%", mobile: "50% 34%" },
  },
  {
    id: bookingServices[1].id,
    name: bookingServices[1].name.toUpperCase(),
    nameLines: ["NAŠMINKAJ SE", "SAMA"],
    text: bookingServices[1].description,
    frame: "h-[66svh] w-[72vw] self-center md:h-[72svh] md:w-[76vw] lg:h-[82vh] lg:w-[42vw] lg:ml-[-8vw]",
    layout: "top-right",
    image: "/yummi/self-makeup-course.jpg",
    imageAlt: "Model sa završenim makeup izgledom u svetlom beauty prostoru",
    fit: "cover",
    position: { desktop: "50% 38%", mobile: "50% 34%" },
  },
  {
    id: bookingServices[2].id,
    name: bookingServices[2].name.toUpperCase(),
    nameLines: ["BAZNI KURS ZA", "POČETNIKE"],
    text: bookingServices[2].description,
    frame: "h-[64svh] w-[88vw] self-center md:h-[78svh] md:w-[84vw] lg:h-[92vh] lg:w-[86vw] lg:ml-[-4vw]",
    layout: "bottom-left",
    image: "/yummi/basic-course.jpg",
    imageAlt: "Grupna fotografija tri modela sa završenim makeup izgledima",
    fit: "contain",
    position: { desktop: "50% 50%", mobile: "50% 50%" },
  },
  {
    id: bookingServices[3].id,
    name: bookingServices[3].name.toUpperCase(),
    nameLines: ["USAVRŠAVANJE", "ZA ŠMINKERE"],
    text: bookingServices[3].description,
    frame: "h-[68svh] w-[90vw] self-start mt-[4svh] md:h-[76svh] md:w-[84vw] lg:h-[86vh] lg:w-[92vw] lg:self-start lg:mt-[4vh] lg:ml-[-10vw]",
    layout: "top-right",
    image: "/yummi/advanced-course.jpg",
    imageAlt: "Dramatičan makeup sa metalik stylingom i naglašenim očima",
    fit: "cover",
    position: { desktop: "48% 42%", mobile: "50% 39%" },
  },
];
