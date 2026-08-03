/**
 * Texty a assety webu Massflow.
 * Obrázky: public/portfolio/ — názvy viz assetPaths a portfolioItems.
 * Logo: public/portfolio/Logo_white@3x.png (nebo upravte assetPaths.logo).
 */

export const site = {
  /** Veřejná značka (logo, hlavička) */
  name: 'Massflow',
  /** Provozovatel / fyzická osoba — patička, důvěra u chatu */
  legalName: 'Tomáš Maixner',
  /** Veřejná doména webu (kanonická varianta) */
  domain: 'www.massflow.cz',
  title: 'Massflow — web, design a digitální marketing | Šumperk, Olomouc',
  description:
    'Massflow: tvorba webů, UI/UX, obsah a digitální marketing. Jasný proud od strategie po měřitelné výsledky. Šumperk, Zábřeh, Olomouc.',
  keywords:
    'Massflow, grafika, web development, digitální marketing, tvorba webu, Šumperk, Zábřeh, Olomouc, Shopify, UI/UX, newsletter, sociální sítě, SEO',
  ico: '07004389',
  address: 'Nemile 89',
  email: 'marketing@massflow.cz',
  messengerUrl: 'https://m.me/Majormaixner',
  whatsapp: '+420 732 545 969',
  whatsappUrl: 'https://wa.me/420732545969',
  linkedin: 'https://www.linkedin.com/in/tom%C3%A1%C5%A1-maixner-10485624a/',
  facebook: 'https://www.facebook.com/maixnert/',
  dribbble: 'https://dribbble.com/msjor',
  instagram: 'https://www.instagram.com/maixnert/',
  /** Zapněte na true, až budete chtít znovu zobrazit odkazy v patičce */
  showFooterSocial: false,
}

/** Kanonická báze URL (https + doména) — OG, sitemap, canonical */
export const siteOrigin = `https://${site.domain}` as const

/** Obrázek pro sdílení (og:image, Twitter) — public/thumbnail.jpg */
export const socialShareImagePath = '/thumbnail.jpg'
export const socialShareImageWidth = 1912
export const socialShareImageHeight = 1107

export type PageMeta = {
  title: string
  description: string
  noIndex?: boolean
}

export const notFoundPageMeta: PageMeta = {
  title: 'Stránka nenalezena — Massflow',
  description: 'Požadovaná stránka neexistuje. Vraťte se na úvod nebo použijte hlavní menu.',
  noIndex: true,
}

export const assetPaths = {
  /** Header logo */
  logo: '/portfolio/Logo_white@3x.png',
  profile: '/portfolio/Profile.jpg',
  cv: '/portfolio/cv.pdf',
  wave: '/assets/legacy/wave.svg',
  squiggly: '/assets/legacy/sssquiggly.svg',
  flux: '/assets/legacy/ffflux.svg',
}

export const hero = {
  /** Dva řádky pro stagger (nadpis) */
  words: [
    { text: 'Dáme vašemu byznysu gravitaci,', delay: 0 },
    { text: 'která přitahuje nové klienty', delay: 90 },
  ] as const,
  subhead: '',
  body: 'Massflow propojuje strategii, design a obsah tak, aby váš byznys nepotřeboval hledat klienty, s naší pomocí přijdou sami.',
  ctaPrimary: 'Domluvme si další krok',
  ctaSecondary: 'Ukázat práci',
}

/** Jednotné CTA napříč webem */
export const ctas = {
  primary: 'Domluvme si další krok',
  consult: 'Nezávazná konzultace zdarma',
  secondary: 'Ukázat práci',
  nav: 'Konzultace',
  stripKicker: 'Další krok',
  stripLead:
    'Nezávazná konzultace zdarma — řeknete nám záměr a společně navrhneme nejlepší další postup.',
  homeCloseKicker: 'Připraveni růst?',
  homeCloseLead: 'Od strategie po web a kampaně — domluvme si krátký call bez závazků.',
} as const

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
    body: 'Řeknete nám, co potřebujete. Zeptáme se na vše potřebné, abychom pochopili projekt i vaše cíle.',
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
  servicesKicker: 'CO UMÍME',
  servicesTitle: 'Služby, které mluví za vás',
  servicesCta: 'Zobrazit všechny služby',
  casesKicker: 'CASE STUDY',
  casesTitle: 'Projekty s měřitelným dopadem',
  casesCta: 'Všechny projekty',
  processKicker: 'JAK TO CHODÍ',
  processTitle: 'Spolupráce bez zbytečných komplikací',
}

export const footerTagline =
  'Massflow — web, design a digitální marketing · Dostupní pro nové projekty'

export const about = {
  kicker: 'O Massflow',
  title: 'Massflow:\npartner pro digitální růst',
  lead: 'Design, vývoj a marketing v jednom proudu. Od strategie po měřitelné výsledky, bez roztříštění mezi několika dodavateli.',
  cards: [
    {
      title: 'Massflow',
      lines: ['Design + vývoj + marketing'],
    },
    { title: 'Klienti', lines: ['30+ značek'] },
    { title: 'Projekty', lines: ['40+ realizací od webu po kampaně'] },
  ],
  body: 'Nejsme jen dodavatel. V Massflow propojujeme strategii, design a technologie tak, aby spolu skutečně fungovaly. Pomáháme firmám růst online bez zbytečných překážek.',
  bodySecondary:
    'Každý projekt stavíme na datech, jasných cílech a reálném dopadu na byznys. Od první schůzky až po spuštění a další rozvoj držíme stejnou laťku: kvalitu, otevřenost a výsledky, které dávají smysl.',
  values: [
    'Mluvíme srozumitelně a na rovinu',
    'Rozhodujeme se podle dat i praxe.',
    'Myslíme dlouhodobě, ne jen na jednorázové odevzdání.',
  ],
  cta: 'Domluvme si další krok',
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
  /** Pokud je nastaveno, dlaždice vede na case study `/prace/:slug` */
  caseStudySlug?: string
}

export type CaseStudyGalleryItem = {
  src: string
  alt: string
  /** Optional quiet caption under the frame */
  label?: string
  /** Crop in preview; click expands to full image */
  previewCrop?: boolean
  /** Mosaic placement when used as cover grid */
  placement?: 'primary' | 'accent' | 'secondary'
}

export type CaseStudySection = {
  id: string
  heading: string
  body: string[]
  image?: string
  imageAlt?: string
}

export type CaseStudy = {
  slug: string
  client: string
  title: string
  kicker: string
  lead: string
  coverImage: string
  coverAlt: string
  /** When set, replaces the single full-width cover with a mosaic grid */
  coverMosaic?: CaseStudyGalleryItem[]
  /** Mosaic layout — trio is the default 3-tile arrangement */
  coverMosaicLayout?: 'trio' | 'screens'
  year: string
  services: string[]
  liveUrl?: string
  liveLabel?: string
  meta: { label: string; value: string }[]
  sections: CaseStudySection[]
  gallery?: CaseStudyGalleryItem[]
  results?: { label: string; value: string }[]
  seo: PageMeta
}

export const caseStudyUi = {
  back: 'Zpět na projekty',
  liveProject: 'Otevřít projekt',
  overviewKicker: 'Přehled',
  resultsHeading: 'Co přinesla spolupráce',
  galleryHeading: 'Ukázky z projektu',
  ctaText:
    'Chcete podobný výsledek pro svou značku? Domluvme si krátkou konzultaci.',
} as const

/** Case studies — upravte texty a doplňte obrázky. Nový case study = nový záznam + caseStudySlug u portfolioItems. */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'svet-prumyslu',
    client: 'Svět průmyslu',
    title: 'Od málo navštěvovaného webu k mediální platformě s tisíci čtenáři',
    kicker: 'Case study',
    lead:
      'Kompletní redesign a UI/UX struktura pro průmyslový mediální web — od návrhu přes vlastní WordPress téma až po sociální sítě, newsletter a digitální magazíny.',
    coverImage: '/portfolio/svet_1.png',
    coverAlt: 'Svět průmyslu — mobilní mockup webu',
    coverMosaicLayout: 'screens',
    coverMosaic: [
      {
        src: '/portfolio/svet_2.png',
        alt: 'Svět průmyslu — homepage',
        label: 'Homepage',
      },
      {
        src: '/portfolio/svet_1.png',
        alt: 'Svět průmyslu — mobilní mockup',
        label: 'Mobile',
        previewCrop: true,
      },
      {
        src: '/portfolio/svet_3.png',
        alt: 'Svět průmyslu — Brands a digitální magazíny',
        label: 'Brands',
      },
    ],
    year: '2023',
    services: ['UI/UX', 'Web', 'Obsah', 'Sociální sítě', 'Newsletter'],
    liveUrl: 'https://www.svetprumyslu.cz',
    liveLabel: 'svetprumyslu.cz',
    meta: [
      { label: 'Klient', value: 'Svět průmyslu' },
      { label: 'Rok', value: '2023' },
      { label: 'Role', value: 'UI/UX · Web · Obsah' },
      { label: 'Stack', value: 'WordPress · custom theme' },
    ],
    sections: [
      {
        id: 'vyzva',
        heading: 'Výzva',
        body: [
          'Původní web Světa průmyslu měl jen minimum návštěvníků a neplnil roli mediální značky. Chyběla jasná struktura, moderní prezentace obsahu i kanály, které by čtenáře dlouhodobě přiváděly zpět — od sociálních sítí po newsletter a magazín.',
          'Cílem bylo postavit digitální domov, který průmyslové publikum snadno čte a sdílí, a kolem něj obsahový ekosystém připravený na růst.',
        ],
      },
      {
        id: 'pristup',
        heading: 'Přístup',
        body: [
          'Začali jsme od nuly: nový design a celá UI/UX struktura webu — hierarchie informací, navigace, šablony článků i mobilní čitelnost. Návrh jsme postavili na WordPressu jako vlastní (custom) téma, aby redakce mohla web snadno spravovat a rozšiřovat.',
          'Paralelně jsme web podporovali na Facebooku a LinkedInu, spustili newsletter a navrhli digitální magazíny. Další čísla magazínu jsme pak předali grafickému designerovi — drželi jsme vizuální směr, zbytek produkce delegovali.',
        ],
      },
      {
        id: 'vysledek',
        heading: 'Řešení',
        body: [
          'Výsledkem je moderní mediální web na vlastním WordPress tématu a kolem něj fungující obsahový ekosystém — Facebook, LinkedIn, newsletter a digitální magazíny.',
          'Z webu s minimem návštěvníků se stala platforma, která ve špičce dosáhla až 10 000 návštěv týdně. Design, vývoj a obsahová podpora tak společně přinesly měřitelný skok v dosahu značky.',
        ],
      },
    ],
    results: [
      { label: 'Špička návštěvnosti', value: 'až 10 000 / týden' },
      { label: 'Předtím', value: 'Minimum návštěv' },
      { label: 'Rozsah', value: 'Web · SMM · magazín · newsletter' },
    ],
    seo: {
      title: 'Svět průmyslu — case study | Massflow',
      description:
        'Case study Massflow: redesign a UI/UX webu Svět průmyslu na vlastním WordPress tématu. Až 10 000 návštěv týdně — včetně Facebooku, LinkedInu, newsletteru a digitálních magazínů.',
    },
  },
  {
    slug: 'fight-arena',
    client: 'Fight Arena',
    title: 'UI design pro web3 crypto hru',
    kicker: 'Case study',
    lead:
      'Uživatelské rozhraní pro web3 crypto hru Fight Arena — ostrý, čitelný UI design, který drží tempo boje a zároveň funguje v kryptoprostředí.',
    coverImage: '/portfolio/Fight-arena.jpg',
    coverAlt: 'Fight Arena — UI design web3 hry',
    coverMosaicLayout: 'screens',
    coverMosaic: [
      {
        src: '/portfolio/Homepage.jpg',
        alt: 'Fight Arena — homepage',
        label: 'Homepage',
        previewCrop: true,
      },
      { src: '/portfolio/Dashboard.png', alt: 'Fight Arena — dashboard', label: 'Dashboard' },
      {
        src: '/portfolio/Collection.jpg',
        alt: 'Fight Arena — collection a deck building',
        label: 'Collection',
      },
      { src: '/portfolio/Quests.jpg', alt: 'Fight Arena — quests', label: 'Quests' },
      {
        src: '/portfolio/Leaderboard.jpg',
        alt: 'Fight Arena — leaderboard',
        label: 'Leaderboard',
      },
      { src: '/portfolio/Shop.jpg', alt: 'Fight Arena — shop', label: 'Shop' },
      { src: '/portfolio/Raffle.jpg', alt: 'Fight Arena — raffle', label: 'Raffle' },
      { src: '/portfolio/Wheel.jpg', alt: 'Fight Arena — wheel', label: 'Wheel' },
    ],
    year: '2024',
    services: ['UI Design', 'Web3'],
    liveUrl: 'https://onefightarena.com/',
    liveLabel: 'onefightarena.com',
    meta: [
      { label: 'Klient', value: 'Fight Arena' },
      { label: 'Rok', value: '2024' },
      { label: 'Role', value: 'UI Design' },
      { label: 'Typ', value: 'Web3 · crypto hra' },
    ],
    sections: [
      {
        id: 'vyzva',
        heading: 'Výzva',
        body: [
          'Fight Arena potřebovala UI, které unese svět web3 crypto hry: souboje, progres, on-chain logiku i atmosféru arény. Rozhraní muselo působit ostře a atraktivně — a zároveň zůstat srozumitelné hráčům, kteří se v kryptu pohybují různě dlouho.',
          'Cílem bylo navrhnout vizuální a interakční vrstvu, která prodá energii hry, nezahlíí detaily a drží konzistenci napříč klíčovými obrazovkami.',
        ],
      },
      {
        id: 'pristup',
        heading: 'Přístup',
        body: [
          'Součástí práce byl UI design herního rozhraní — hierarchie informací, stavy obrazovek, typografie a vizuální rytmus, který odpovídá tempu fight žánru.',
          'Každý prvek jsme stavěli tak, aby web3 kontext (wallet, crypto ekonomika, herní smyčky) byl přehledný, ne technicky odtažitý. Důraz byl na jasné CTA, čitelnost v akci a vizuál, který značku Fight Arena odliší.',
        ],
      },
      {
        id: 'vysledek',
        heading: 'Řešení',
        body: [
          'Výsledkem je UI design pro web3 crypto hru, který spojuje atmosféru arény s praktickou použitelností. Hráč se v rozhraní rychle zorientuje, značka působí silně a připraveně na digitální bojové prostředí.',
          'Hotový vizuál a struktura obrazovek tvoří základ herního zážitku Fight Arena — od prvního dojmu po klíčové herní stavy.',
        ],
      },
    ],
    results: [
      { label: 'Výstup', value: 'UI design' },
      { label: 'Segment', value: 'Web3 · crypto' },
      { label: 'Produkt', value: 'Herní rozhraní' },
    ],
    seo: {
      title: 'Fight Arena — case study | Massflow',
      description:
        'Case study Massflow: UI design pro web3 crypto hru Fight Arena. Ostré herní rozhraní s energií arény.',
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug)
}

/** Obrázky práce: vložte do public/portfolio/ (včetně semin.jpg, profifix.jpg, fight-arena.jpg). */
export const portfolioIntro =
  'Vybrané ukázky projektů z naší spolupráce.'

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Smarty · e-commerce',
    image: '/portfolio/SET-1920x1080.jpg',
    category: 'web',
  },
  {
    id: '2',
    title: 'Bedtime Stories',
    image: '/portfolio/SceneBedtime-stories.jpg',
    category: 'design',
  },
  {
    id: '3',
    title: 'Svět průmyslu',
    image: '/portfolio/Mockup.jpg',
    category: 'web',
    href: 'https://www.svetprumyslu.cz',
    external: true,
    caseStudySlug: 'svet-prumyslu',
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
    caseStudySlug: 'fight-arena',
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
    image: '/portfolio/NEW_OKTAGON.jpg',
    category: 'design',
  },
]

export const servicesPage = {
  kicker: 'Co děláme?',
  title: 'Služby, které nabízíme',
  intro:
    'Máme široké zkušenosti z tvorby obsahu, web designu, vývoje, správy webů i digitálního marketingu — a držíme je v jednom proudu pro vaše projekty.',
  cta: 'Nezávazná konzultace zdarma',
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
  formIntro: 'Vyplňte formulář a odešlete — zpráva dorazí na marketing@massflow.cz a ozveme se vám co nejdříve.',
  formName: 'Jméno a příjmení',
  formEmail: 'Váš e-mail',
  formMessage: 'Vaše zpráva',
  submit: 'Odeslat zprávu',
  formSubmitting: 'Odesílám…',
  formSuccess: 'Vaše zpráva byla úspěšně odeslána.',
  formError: 'Odeslání se nezdařilo. Zkuste to znovu nebo nás kontaktujte přímo e-mailem či WhatsApp.',
  formPrivacy:
    'Odesláním souhlasíte se zpracováním údajů z formuláře za účelem vyřízení poptávky. Podrobnosti v',
  formPrivacyLink: 'Zásadách ochrany osobních údajů',
  sendMessage: 'Otevřít',
}

export const pageMetaByPath = {
  '/': {
    title: site.title,
    description: site.description,
  },
  '/prace': {
    title: 'Projekty — ukázky webů, designu a kampaní | Massflow',
    description: `${portfolioIntro} Web, grafika, video a digitální marketing — Šumperk, Olomouc.`,
  },
  '/sluzby': {
    title: 'Služby — UI/UX, vývoj, obsah, marketing | Massflow',
    description: servicesPage.intro,
  },
  '/o-nas': {
    title: 'O Massflow — partner pro digitální růst',
    description: about.lead,
  },
  '/kontakt': {
    title: 'Kontakt — Massflow | Šumperk, Olomouc',
    description: `${contactPage.lead} E-mail, Messenger, WhatsApp.`,
  },
  '/ochrana-udaju': {
    title: 'Zásady ochrany osobních údajů | Massflow',
    description:
      'Informace o zpracování osobních údajů, cookies a Google Analytics podle GDPR — Massflow / Tomáš Maixner.',
  },
} as const satisfies Record<string, PageMeta>

export function getPageMeta(pathname: string): PageMeta {
  const known = pageMetaByPath[pathname as keyof typeof pageMetaByPath]
  if (known) return known

  const caseMatch = pathname.match(/^\/prace\/([^/]+)$/)
  if (caseMatch) {
    const study = getCaseStudy(caseMatch[1])
    if (study) return study.seo
  }

  return notFoundPageMeta
}
