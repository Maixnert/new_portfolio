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
    { text: 'Jsem', delay: 0 },
    { text: 'Tomáš.', delay: 90 },
    { text: 'Maixner.', delay: 180 },
  ] as const,
  subhead:
    'Grafický design. Weby, co prodávají. Digitální marketing, který dává smysl.',
  body: 'Pomáhám firmám a jednotlivcům vypadat profesionálně online — od prvního nápadu až po hotový výsledek. WordPress, Shopify i HTML na míru. Dostupný v Šumperku, Zábřehu, Olomouci i na dálku.',
  ctaPrimary: 'Ukázat práci',
  ctaSecondary: 'Napište mi',
}

export const homeServices = [
  {
    tag: 'UI/UX',
    badge: 'uiux' as const,
    title: 'UI/UX Design',
    body: 'Navrhuju prostředí, která jsou nejen hezká — ale hlavně intuitivní a funkční.',
  },
  {
    tag: 'WEB',
    badge: 'web' as const,
    title: 'Web Development',
    body: 'Stavím weby, které se načtou rychle, vypadají skvěle a konvertují návštěvníky na zákazníky.',
  },
  {
    tag: 'OBSAH',
    badge: 'obsah' as const,
    title: 'Content Creation',
    body: 'Grafika, fotografie, video, DTP — obsah, který zaujme na první pohled a drží pozornost.',
  },
  {
    tag: 'MARKETING',
    badge: 'marketing' as const,
    title: 'Digitální marketing',
    body: 'Newslettery, reklamy, sociální sítě — strategie postavená na datech, ne na dojmech.',
  },
] as const

export const timelineSteps = [
  {
    n: '01',
    title: 'Poslechnu vás',
    body: 'Řeknete mi, co potřebujete — já se zeptám na vše potřebné, abych pochopil projekt i vaše cíle.',
  },
  {
    n: '02',
    title: 'Navrhnu a doladíme',
    body: 'Připravím návrh, ukážu vám ho a společně ho dotáhneme do finální podoby.',
  },
  {
    n: '03',
    title: 'Předám a jsem k dispozici',
    body: 'Dostanete hotové soubory nebo spuštěný web. A pokud budete potřebovat pomoct dál — jsem tu.',
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
  kicker: 'Něco',
  title: 'O mně',
  cards: [
    {
      title: 'Zkušenosti',
      lines: ['5+ freelance', 'Práce v médiích', 'Práce v Reklamce'],
    },
    { title: 'Klienti', lines: ['30+'] },
    { title: 'Projekty', lines: ['40+ dokončených projektů'] },
  ],
  body: 'Mám zkušenosti s tvorbou různých formátů. Dělal jsem videa, produktovou fotografii, grafický design a DTP. Momentálně se nejvíce soustředím na web design, web development a digitální marketing.',
  cta: 'Kontaktujte mě',
}

export type PortfolioCategory = 'vše' | 'web' | 'design' | 'video'

export type PortfolioItem = {
  id: string
  title: string
  image: string
  category: Exclude<PortfolioCategory, 'vše'>
  href?: string
  external?: boolean
}

/** Názvy souborů jako v původním projektu — vložte je do public/portfolio/ */
export const portfolioIntro =
  'Vybral jsem příklady těch nejzajímavějších projektů, na kterých jsem pracoval. Jsou z mé práce na volné noze i z práce pro firmy Alistra a Smart Connections.'

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'SMARTY E-Commerce',
    image: '/portfolio/SET-1920x1080.png',
    category: 'web',
  },
  {
    id: '2',
    title: 'BEDTIME Stories',
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
    title: 'Aquatis Bottle',
    image: '/portfolio/Aquatis.jpg',
    category: 'design',
  },
  {
    id: '6',
    title: 'Lenner Motors',
    image: '/portfolio/LENNER.jpg',
    category: 'video',
    href: 'https://www.youtube.com/playlist?list=PLBFTuzRT3jqoPh7quvnPeriV6k_M-QMfH',
    external: true,
  },
  {
    id: '7',
    title: 'Váš chovatel',
    image: '/portfolio/Vaschovatel.jpg',
    category: 'video',
    href: 'https://www.youtube.com/watch?v=f7SPP7piyCk',
    external: true,
  },
  {
    id: '8',
    title: 'Magazín Svět průmyslu',
    image: '/portfolio/casopis.jpg',
    category: 'design',
    href: 'https://www.svetprumyslu.cz/archiv-digitalnich-casopisu/',
    external: true,
  },
  {
    id: '9',
    title: 'NEW OKTAGON',
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
      body: 'Design uživatelského prostředí i zážitku je pro mě důležitá součást práce. Dělám ji i samostatně, častěji však v kombinaci s vývojem webu.',
    },
    {
      num: '02',
      name: 'Web Development',
      body: 'Tvořím weby, které mají funkční i vizuální hodnotu. Od CMS redakčních systémů po malé microsites.',
    },
    {
      num: '03',
      name: 'Content Creation',
      body: 'Dělám digitální grafiku, DTP, 3D, fotografie i video. Vše s největší pečlivostí a maximálním smyslem pro detail.',
    },
    {
      num: '04',
      name: 'Digitální marketing',
      body: 'Newslettery, reklamní kampaně, sociální sítě — s tím vším vám mohu pomoci.',
    },
  ] as const,
}

export const contactPage = {
  kicker: 'Pojďme se poznat',
  title: 'Kontaktujte mě',
  intro: '',
  formName: 'Jméno a příjmení',
  formEmail: 'Váš e-mail',
  formMessage: 'Vaše zpráva',
  submit: 'Odeslat zprávu',
  sendMessage: 'Napsat zprávu',
}
