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
    src: "/yummi/new/yuumi-work-03-gold-earring.jpg",
    alt: "Dramatičan Yuumi Art makeup portret sa zlatnom minđušom",
    position: { desktop: "52% 32%", mobile: "52% 30%" },
  },
  eye: {
    src: "/yummi/new/yuumi-work-04-sunlight-wet-hair.jpg",
    alt: "Sunčani beauty portret sa sjajem kože i naglašenim očima",
    position: { desktop: "50% 38%", mobile: "51% 36%" },
  },
  texture: {
    src: "/yummi/new/yuumi-work-09-sunlit-bun.jpg",
    alt: "Yuumi Art portret sa punđom i toplim sunčevim svetlom",
    position: { desktop: "50% 31%", mobile: "50% 28%" },
  },
};

export const transformation = {
  stages: [
    {
      src: "/yummi/new/yuumi-work-07-clean-glam.jpg",
      alt: "Čist Yuumi Art glam makeup sa belim topom",
      position: { desktop: "50% 34%", mobile: "50% 31%" },
    },
    {
      src: "/yummi/new/yuumi-work-01-blue-eyeshadow.jpg",
      alt: "Yuumi Art close-up sa plavom senkom i naglašenim očima",
      position: { desktop: "50% 31%", mobile: "50% 29%" },
    },
    {
      src: "/yummi/new/yuumi-work-05-soft-glam-bun.jpg",
      alt: "Soft glam makeup portret sa punđom u studiju",
      position: { desktop: "50% 35%", mobile: "50% 32%" },
    },
    {
      src: "/yummi/new/yuumi-work-06-editorial-fur.jpg",
      alt: "Finalni editorial Yuumi Art look sa mokrom kosom i fur stylingom",
      position: { desktop: "50% 35%", mobile: "50% 33%" },
    },
  ],
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
  reflection: "/yummi/new/yuumi-work-07-clean-glam.jpg",
  reflectionAlt: "Čist Yuumi Art glam portret u ogledalu",
  position: { desktop: "50% 34%", mobile: "50% 31%" },
};

export const galleryWorks = [
  {
    src: "/yummi/new/yuumi-work-01-blue-eyeshadow.jpg",
    alt: "Yuumi Art makeup portret sa plavom senkom na očima",
    position: { desktop: "50% 31%", mobile: "50% 28%" },
  },
  {
    src: "/yummi/new/yuumi-work-02-ponytail.jpg",
    alt: "Yuumi Art makeup portret sa zalizanom kosom i crnim outfitom",
    position: { desktop: "52% 33%", mobile: "52% 30%" },
  },
  {
    src: "/yummi/new/yuumi-work-03-gold-earring.jpg",
    alt: "Yuumi Art makeup portret sa mokrom kosom i zlatnom minđušom",
    position: { desktop: "51% 32%", mobile: "51% 29%" },
  },
  {
    src: "/yummi/new/yuumi-work-04-sunlight-wet-hair.jpg",
    alt: "Yuumi Art makeup portret u jakom sunčevom svetlu",
    position: { desktop: "50% 39%", mobile: "51% 36%" },
  },
  {
    src: "/yummi/new/yuumi-work-05-soft-glam-bun.jpg",
    alt: "Yuumi Art soft glam makeup portret sa punđom",
    position: { desktop: "50% 35%", mobile: "50% 32%" },
  },
  {
    src: "/yummi/new/yuumi-work-06-editorial-fur.jpg",
    alt: "Yuumi Art editorial makeup portret sa mokrom kosom i belim stylingom",
    position: { desktop: "50% 35%", mobile: "50% 32%" },
  },
  {
    src: "/yummi/new/yuumi-work-07-clean-glam.jpg",
    alt: "Yuumi Art clean glam makeup portret sa belim topom",
    position: { desktop: "50% 34%", mobile: "50% 31%" },
  },
  {
    src: "/yummi/new/yuumi-work-08-smiling-soft-glam.jpg",
    alt: "Yuumi Art soft glam makeup portret sa talasastom kosom",
    position: { desktop: "50% 34%", mobile: "50% 31%" },
  },
  {
    src: "/yummi/new/yuumi-work-09-sunlit-bun.jpg",
    alt: "Yuumi Art makeup portret sa punđom i toplim svetlom",
    position: { desktop: "50% 31%", mobile: "50% 28%" },
  },
];

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
