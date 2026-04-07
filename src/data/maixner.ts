/**
 * Texty a struktura podle původního webu (portfolio-master).
 * Obrázky: zkopírujte ze starého projektu do public/portfolio/ — názvy souborů níže.
 * Logo: přejmenujte „Logo (2).png“ na logo.png (nebo upravte logoSrc).
 */

export const site = {
  name: 'Tomáš Maixner',
  domain: 'maixnert.cz',
  title: 'Tomáš Maixner — tvorba webů a digitální marketing',
  description:
    'Tvorba webových stránek, grafiky a digitální marketing nejen pro firmy. WordPress, Shopify, HTML. Šumperk, Zábřeh, Olomouc.',
  keywords:
    'Grafika, web development, digitální marketing, tvorba webu, Šumperk, Zábřeh, Olomouc, Shopify, newsletter, sociální sítě, reklama, DTP, SEO',
  ico: '07004389',
  address: 'Nemile 89',
  email: 'tomas@maixnert.cz',
  messengerUrl: 'https://m.me/Majormaixner',
  whatsapp: '+420 732 545 969',
  whatsappUrl: 'https://wa.me/732545969',
  linkedin: 'https://www.linkedin.com/in/tom%C3%A1%C5%A1-maixner-10485624a/',
  facebook: 'https://www.facebook.com/maixnert/',
  dribbble: 'https://dribbble.com/msjor',
  instagram: 'https://www.instagram.com/maixnert/',
}

export const assetPaths = {
  /** Přejmenujte původní Logo (2).png → logo.png do public/portfolio/ */
  logo: '/portfolio/logo.png',
  profile: '/portfolio/Profile.jpg',
  cv: '/portfolio/cv.pdf',
  wave: '/assets/legacy/wave.svg',
  squiggly: '/assets/legacy/sssquiggly.svg',
  flux: '/assets/legacy/ffflux.svg',
}

export const hero = {
  /** Slova pro stagger animaci — vizuálně „Jsem Tomáš. Maixner.“ + kurzor */
  words: [
    { text: 'Komplexní digitální tvorba pro značky,', delay: 0 },
    { text: 'které chtějí víc.', delay: 90 },
  ] as const,
  subhead: '',
  body: 'Spojujeme kreativitu s technologií, abychom budovali smysluplné řešení, která nejen ohromí, ale skutečně zlepší váš byznys. Obsah, design i strategie. Vše navržené pro reálné výsledky, růst a viditelné dopady.',
  ctaPrimary: 'Ukázat práci',
  ctaSecondary: 'Napište mi',
}

export const homeServices = [
  {
    tag: 'UI/UX',
    badge: 'uiux' as const,
    title: 'UI/UX Design',
    body: 'Navrhujeme intuitivní uživatelská rozhraní a zážitky, které přitahují, udržují a konvertují návštěvníky na loajální zákazníky. ',
  },
  {
    tag: 'WEB',
    badge: 'web' as const,
    title: 'Web/App Development',
    body: 'Stavíme moderní weby a e-shopy na míru, které běží rychle, škálují se a perfektně fungují na všech zařízeních.',
  },
  {
    tag: 'OBSAH',
    badge: 'obsah' as const,
    title: 'Content Creation',
    body: 'Tvoříme poutavý obsah grafiku, fotografie, videa a DTP materiály, který vypráví váš příběh a oslovuje cílovou skupinu.',
  },
  {
    tag: 'MARKETING',
    badge: 'marketing' as const,
    title: 'Digitální marketing',
    body: 'Rozjíždíme kampaně přes newslettery, placené reklamy, sociální sítě a strategie, které přinášejí měřitelné výsledky více leadů, prodejů a ROI.',
  },
] as const

export const timelineSteps = [
  {
    n: '01',
    title: 'Vyslechneme vás',
    body: 'Řeknete nám, co potřebujete. My se zeptáme na vše potřebné, abychom pochopili projekt i vaše cíle.',
  },
  {
    n: '02',
    title: 'Navrhneme a doladíme',
    body: 'Připravíme návrh, ukážeme vám ho a společně ho dotáhneme do finální podoby.',
  },
  {
    n: '03',
    title: 'Předáme a jsme k dispozici',
    body: 'Dostanete hotové soubory nebo spuštěný web. A pokud budete potřebovat pomoct dál, jsme tu.',
  },
] as const

export const homeSections = {
  servicesKicker: 'CO UMÍM',
  servicesTitle: 'Služby, které mluví za vás',
  servicesCta: 'Zobrazit všechny služby',
  processKicker: 'JAK TO CHODÍ',
  processTitle: 'Spolupráce bez zbytečných komplikací',
}

export const footerTagline =
  'Freelance designer & developer · Dostupný pro nové projekty'

export const about = {
  kicker: 'Kdo jsme',
  title: 'Partner pro digitální růst',
  lead: 'Design, vývoj a marketing pod jednou střechou — od strategii po měřitelné výsledky.',
  cards: [
    {
      title: 'Tým',
      lines: ['Design + vývoj + marketing', 'Jeden partner, jeden proces'],
    },
    { title: 'Klienti', lines: ['30+ značek'] },
    { title: 'Projekty', lines: ['40+ realizací od webu po kampaně'] },
  ],
  body: 'Nejsme jen dodavatel. Jsme partner, který propojuje strategii, design a technologii do jednoho funkčního celku. Pomáháme firmám růst online bez chaosu, zdržení a roztříštěné komunikace mezi více týmy.',
  bodySecondary:
    'Každý projekt stavíme na datech, jasných cílech a reálném byznysovém dopadu. Od prvního workshopu po spuštění a následnou optimalizaci držíme stejný standard: kvalita, transparentnost a výsledky.',
  values: [
    'Srozumitelná komunikace bez agenturní mlhy.',
    'Rozhodnutí podložená daty i zkušeností.',
    'Dlouhodobá spolupráce místo jednorázového odevzdání.',
  ],
  cta: 'Pojďme spolupracovat',
}

export type PortfolioCategory = 'vše' | 'web' | 'design' | 'kampaně' | 'video'

export type PortfolioItem = {
  id: string
  title: string
  image: string
  category: Exclude<PortfolioCategory, 'vše'>
  alsoIn?: Exclude<PortfolioCategory, 'vše'>[]
  href?: string
  external?: boolean
}

/** Obrázky práce: vložte do public/portfolio/ (včetně semin.jpg, profifix.jpg, fight-arena.jpg). */
export const portfolioIntro =
  'Vybral jsem příklady těch nejzajímavějších projektů, na kterých jsem pracoval. Jsou z mé práce na volné noze i z práce pro firmy Alistra a Smart Connections.'

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Smarty · e-commerce',
    image: '/portfolio/SET-1920x1080.png',
    category: 'web',
  },
  {
    id: '2',
    title: 'Bedtime Stories',
    image: '/portfolio/SceneBedtime-stories.png',
    category: 'design',
  },
  {
    id: '3',
    title: 'Svět průmyslu',
    image: '/portfolio/Mockup.png',
    category: 'web',
    href: 'https://www.svetprumyslu.cz',
    external: true,
  },
  {
    id: '4',
    title: 'Misty Tea',
    image: '/portfolio/misty-tea.jpg',
    category: 'design',
  },
  {
    id: '5',
    title: 'Semin',
    image: '/portfolio/Semin.jpg',
    category: 'kampaně',
    href: 'https://www.instagram.com/semin_cz/',
  },
  {
    id: '6',
    title: 'Profifix',
    image: '/portfolio/PROFIFIX.jpg',
    category: 'kampaně',
    href: 'https://www.instagram.com/profifixcz/',
  },
  {
    id: '7',
    title: 'Fight Arena',
    image: '/portfolio/Fight-arena.jpg',
    category: 'design',
    href: 'https://onefightarena.com/',
  },
  {
    id: '8',
    title: 'Lenner Motors',
    image: '/portfolio/LENNER.jpg',
    category: 'video',
    href: 'https://www.youtube.com/playlist?list=PLBFTuzRT3jqoPh7quvnPeriV6k_M-QMfH',
    external: true,
  },
  {
    id: '9',
    title: 'Váš chovatel - Reklamy',
    image: '/portfolio/Vaschovatel.jpg',
    category: 'video',
    alsoIn: ['kampaně'],
    href: 'https://www.youtube.com/watch?v=f7SPP7piyCk',
    external: true,
  },
  {
    id: '10',
    title: 'Svět průmyslu · magazín',
    image: '/portfolio/casopis.jpg',
    category: 'design',
    href: 'https://www.svetprumyslu.cz/archiv-digitalnich-casopisu/',
    external: true,
  },
  {
    id: '11',
    title: 'Oktagon',
    image: '/portfolio/NEW_OKTAGON.png',
    category: 'design',
  },
]

export const servicesPage = {
  kicker: 'Co dělám?',
  title: 'Služby, které nabízím',
  intro:
    'Mám široké zkušenosti z oblastí tvorby obsahu, web designu, web developmentu, správy webů i digitálního marketingu.',
  rows: [
    {
      num: '01',
      name: 'UI/UX Design',
      body: 'Navrhujeme intuitivní uživatelská rozhraní a zážitky, které přitahují, udržují a konvertují návštěvníky na loajální zákazníky. Pomocí průzkumů, prototypů a testování zajistíme, že vaše aplikace nebo web bude nejen krásný, ale i maximálně efektivní pro růst konverzí.',
    },
    {
      num: '02',
      name: 'Web/App Development',
      body: 'Stavíme moderní weby a e-shopy na míru, které běží rychle, škálují se a perfektně fungují na všech zařízeních. Od frontendových frameworků po backendové systémy až po AI optimalizaci doručíme plně responzivní řešení pro dlouhodobý úspěch vašich projektů.',
    },
    {
      num: '03',
      name: 'Content Creation',
      body: 'Tvoříme poutavý obsah, grafiku, fotografie, videa a DTP materiály, který vypráví váš příběh a oslovuje cílovou skupinu. S důrazem na kvalitu a SEO optimalizaci produkuje materiály, jež zvyšují engagement a posilují vaši značku na všech platformách.',
    },
    {
      num: '04',
      name: 'Digitální marketing',
      body: 'Rozjíždíme kampaně přes newslettery, placené reklamy, sociální sítě a strategie, které přinášejí měřitelné výsledky. Více leadů, prodejů a ROI. Kombinujeme data-driven přístup s kreativními strategiemi pro dominanci ve vyhledávačích a online prostoru.',
    },
  ] as const,
}

export const contactPage = {
  kicker: 'Kontakt',
  title: 'Domluvme si další krok',
  lead: 'Napište nám stručně váš záměr, a ozveme se vám co nejdříve.',
  channelsHeading: 'Rychlé spojení',
  formHeading: 'Napište nám',
  formIntro:
    'Vyplňte formulář a ozveme se vám co nejdříve.',
  formName: 'Jméno a příjmení',
  formEmail: 'Váš e-mail',
  formMessage: 'Vaše zpráva',
  submit: 'Odeslat zprávu',
  sendMessage: 'Otevřít',
  formDevNote: 'Formulář je zatím ukázkový — lze napojit na EmailJS nebo váš backend.',
}
