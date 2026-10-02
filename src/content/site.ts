export const brand = {
  name: "Yummi Art",
  navName: "YUMMI ART",
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

export const artist = {
  name: brand.artistName.toUpperCase(),
  intro:
    "Za mene šminka nije način da sakriješ sebe, već da istakneš ono što te čini posebnom.",
  bio:
    "Svakom licu pristupam individualno, sa pažnjom prema detaljima i željom da finalni izgled i dalje bude — ti.",
  education:
    "Kroz profesionalno šminkanje i edukacije želim da svaka devojka stekne više sigurnosti, znanja i osećaja za lepotu koja joj prirodno pripada.",
  image: "/yummi/artist.jpg",
  alt: "Adriana, makeup artistkinja iza Yummi Art brenda",
  position: { desktop: "50% 58%", mobile: "50% 52%" },
};

export const booking = {
  reflection: "/yummi/booking.jpg",
  reflectionAlt: "Tamni editorial makeup portret u ogledalu",
  position: { desktop: "48% 34%", mobile: "48% 30%" },
};

export const servicesAndEducation = [
  {
    name: "PROFESIONALNO ŠMINKANJE",
    nameLines: ["PROFESIONALNO", "ŠMINKANJE"],
    text: "Profesionalno šminkanje prilagođeno licu, stilu i prilici, uz pažnju posvećenu svakom detalju.",
    frame: "h-[58vh] w-[82vw] md:w-[72vw] self-end mb-[8vh]",
    layout: "bottom-left",
    image: "/yummi/professional-makeup.jpg",
    imageAlt: "Profesionalno šminkanje sa bronzanim tenom i naglašenim očima",
    fit: "cover",
    position: { desktop: "50% 36%", mobile: "50% 34%" },
  },
  {
    name: "NAŠMINKAJ SE SAMA",
    nameLines: ["NAŠMINKAJ SE", "SAMA"],
    text: "Kurs za sve koji žele da nauče kako da samostalno i sigurnije našminkaju sebe.",
    frame: "h-[74vh] w-[84vw] self-center md:h-[82vh] md:w-[42vw] md:ml-[-8vw]",
    layout: "top-right",
    image: "/yummi/self-makeup-course.jpg",
    imageAlt: "Model sa završenim makeup izgledom u svetlom beauty prostoru",
    fit: "cover",
    position: { desktop: "50% 38%", mobile: "50% 34%" },
  },
  {
    name: "BAZNI KURS ZA POČETNIKE",
    nameLines: ["BAZNI KURS ZA", "POČETNIKE"],
    text: "Kurs namenjen početnicima koji žele da nauče osnove šminkanja i izgrade dobru bazu za dalji rad.",
    frame: "h-[78vh] w-[86vw] self-center md:h-[92vh] md:w-[86vw] md:ml-[-4vw]",
    layout: "bottom-left",
    image: "/yummi/basic-course.jpg",
    imageAlt: "Grupna fotografija tri modela sa završenim makeup izgledima",
    fit: "contain",
    position: { desktop: "50% 50%", mobile: "50% 50%" },
  },
  {
    name: "USAVRŠAVANJE ZA ŠMINKERE",
    nameLines: ["USAVRŠAVANJE", "ZA ŠMINKERE"],
    text: "Edukacija za šminkere koji žele da unaprede postojeće znanje, tehniku i sigurnost u radu.",
    frame: "h-[80vh] w-[88vw] self-center md:h-[86vh] md:w-[92vw] md:self-start md:mt-[4vh] md:ml-[-10vw]",
    layout: "top-right",
    image: "/yummi/advanced-course.jpg",
    imageAlt: "Dramatičan makeup sa metalik stylingom i naglašenim očima",
    fit: "cover",
    position: { desktop: "48% 42%", mobile: "50% 39%" },
  },
];
