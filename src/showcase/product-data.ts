import { CircleCheckIcon, Gamepad2Icon, HandCoinsIcon, KeyRoundIcon } from 'lucide-react'

import type { Product } from '@/components/product/product-card'
import type {
  BreadcrumbItem,
  DescriptionBlock,
  FeaturedOffer,
  MediaItem,
  Offer,
  ProductFeature,
  RatingAspect,
  RequirementSet,
  Review,
  SpecRow,
} from '@/showcase/product/types'

/** Sample product page content for the styleguide. Covers are token gradients until real art exists. */
export const product = {
  title: 'Age of Empires II: Definitive Edition Steam Key GLOBAL',
  shortTitle: 'Age of Empires II: Definitive Edition',
  cover: 'bg-linear-to-b from-region-alt via-primary to-card',
  badge: 'Cashback deal',
  wishlistCount: 6949,
  worksOn: ['Windows'],
  rating: 4.57,
  ratingCount: 982,
  reviewCount: 47,
  tags: ['Single Player', 'Multiplayer', 'Bird View', 'Strategy'],
}

export const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Store', href: '#' },
  { label: 'Categories', href: '#' },
  { label: 'Games', href: '#' },
  { label: 'Steam Games', href: '#' },
  { label: 'Age of Empires II: Definitive Edition Steam Key GLOBAL' },
]

export const features: ProductFeature[] = [
  {
    icon: CircleCheckIcon,
    title: 'Global, Europe',
    lines: [
      { text: 'Can be activated in Lithuania' },
      { text: 'Check', link: { label: 'region restrictions', href: '#' } },
    ],
  },
  {
    icon: Gamepad2Icon,
    title: 'Steam',
    lines: [
      { text: 'Activate/redeem on', link: { label: 'Steam', href: '#' } },
      { text: 'Check', link: { label: 'activation guide', href: '#' } },
    ],
  },
  {
    icon: KeyRoundIcon,
    title: 'Digital key',
    lines: [
      { text: 'This is a digital edition of the product (CD-KEY)' },
      { text: 'Instant delivery', positive: true },
    ],
  },
  {
    icon: HandCoinsIcon,
    title: 'Instant refunds',
    lines: [{ text: 'Unlike other marketplaces, Eneba allows you to get an instant refund for unviewed keys.' }],
  },
]

export const media: MediaItem[] = [
  { id: 'trailer', kind: 'video', cover: 'bg-linear-to-br from-region-alt to-card', alt: 'launch trailer' },
  { id: 's1', kind: 'image', cover: 'bg-linear-to-br from-highlight to-region-eu', alt: 'screenshot 1' },
  { id: 's2', kind: 'image', cover: 'bg-linear-to-br from-chart-5 to-discount', alt: 'screenshot 2' },
  { id: 's3', kind: 'image', cover: 'bg-linear-to-br from-cashback to-chart-5', alt: 'screenshot 3' },
  { id: 's4', kind: 'image', cover: 'bg-linear-to-br from-discount to-surface-tile', alt: 'screenshot 4' },
  { id: 's5', kind: 'image', cover: 'bg-linear-to-br from-region-eu to-primary', alt: 'screenshot 5' },
]

export const featuredOffer: FeaturedOffer = {
  price: '€31.49',
  oldPrice: '€32.99',
  discount: '-5%',
  cashbackPercent: '14%',
  bestCashback: true,
  priceNotFinal: true,
  promotionNote: 'Promotion ends in 15 days!',
  otherOffers: { count: 11, from: '€29.99' },
}

export const paymentMethods = ['Wallet', 'Visa', 'PayPal', 'Swedbank', 'SEB', 'Luminor', 'Revolut', 'Artea', 'LKU', 'Apple Pay', 'Google Pay', 'Citadele', 'Crypto']

export const recommendedOffers: Offer[] = [
  {
    id: 'featured',
    seller: { name: 'Featured offer', initials: 'FO', note: 'Verified by Eneba' },
    price: '€31.49',
    oldPrice: '€32.99',
    discount: '-5%',
    cashbackPercent: '14%',
    bestCashback: true,
  },
  {
    id: 'cdkeymarkt',
    seller: { name: 'CdKeyMarkt', initials: 'CK', verified: true, rating: { score: '9.78', label: 'Superb' } },
    price: '€55.89',
    cashbackPercent: '11%',
  },
]

const sellerNames = ['GearUp', 'City of Games', 'Codezilla', 'KeyForge', 'PixelVault', 'GameHub', 'LootLane', 'NovaKeys', 'RapidCodes', 'Questly', 'ByteBazaar']

/** 11 other offers so "Load 8 more offers" has something to reveal. */
export const otherOffers: Offer[] = sellerNames.map((name, i) => ({
  id: `offer-${i}`,
  seller: {
    name,
    initials: name.replace(/[^A-Z]/g, '').slice(0, 2) || name.slice(0, 2).toUpperCase(),
    verified: true,
    rating: { score: (9.71 - i * 0.04).toFixed(2), label: 'Excellent' },
  },
  price: `€${(29.99 + i * 3.17).toFixed(2)}`,
  ...(i === 0 ? { oldPrice: '€32.99', discount: '-9%' } : {}),
  cashbackPercent: '11%',
}))

export const ratingAspects: RatingAspect[] = [
  { label: 'Gameplay', value: 5 },
  { label: 'Story', value: 5 },
  { label: 'Graphics', value: 4 },
  { label: 'Soundtrack', value: 5 },
]

export const reviews: Review[] = [
  { id: 'r1', author: 'raulongo', country: 'GB', date: '4/18/2020', rating: 5, votes: 14, text: 'Great game, works like a charm. Key received within a few seconds of my purchase! Bought one for me and one for the Ms.' },
  { id: 'r2', author: 'jaxC', country: 'ES', date: '4/23/2021', rating: 5, votes: 4, autoTranslated: true, text: 'The game has a great soundtrack, the graphics maxed out are great, the game\'s story is pretty good to learn how to play. A good game overall.', originalText: 'El juego tiene una gran banda sonora, los gráficos al máximo son geniales, la historia es bastante buena para aprender a jugar. Un buen juego en general.' },
  { id: 'r3', author: 'Sh4dwZ', country: 'BR', date: '4/19/2021', rating: 4, votes: 1, autoTranslated: true, text: 'A great game to spend entertaining, it offers you many hours of play and in the process you learn about history and civilizations. Every campaign teaches something new about the medieval world and the people who lived in it.', originalText: 'Um ótimo jogo para passar o tempo, oferece muitas horas de jogo e no processo você aprende sobre história e civilizações.' },
  { id: 'r4', author: 'Asuryan', country: 'FR', date: '2/18/2021', rating: 4, votes: 3, autoTranslated: true, text: 'The remake of AoE2 is clearly the expected one with new performances. Additionally, some welcome gameplay improvements.', originalText: 'Le remake d\'AoE2 est clairement celui attendu avec de nouvelles performances. De plus, quelques améliorations bienvenues.' },
  { id: 'r5', author: 'Yetti', country: 'ES', date: '4/16/2021', rating: 5, votes: 1, autoTranslated: true, text: 'I liked it a lot. It\'s better than the 2013 version - better graphics, better gameplay. I really recommend it! The new civilizations add a lot of variety and the matchmaking finally works.', originalText: 'Me gustó mucho. Es mejor que la versión de 2013: mejores gráficos, mejor jugabilidad. ¡Lo recomiendo!' },
  { id: 'r6', author: 'm0rdecai', country: 'DE', date: '3/02/2021', rating: 3, votes: 0, text: 'Solid remaster, but the pathfinding still has its moments.' },
  { id: 'r7', author: 'luna_rts', country: 'LT', date: '1/11/2021', rating: 5, votes: 7, text: 'Childhood classic, finally playable on a modern monitor. Instant key delivery too.' },
]

export const description: DescriptionBlock[] = [
  { kind: 'paragraph', text: 'This Age of Empires 2 Steam key is a digital PC code for the Definitive Edition of Age of Empires II.' },
  { kind: 'paragraph', text: 'The Definitive Edition includes:' },
  { kind: 'list', items: ['The original game, rebuilt with 4K support;', '4 new civilizations to learn;', '3 new campaigns;', 'New multiplayer features, matchmaking included.'] },
  { kind: 'paragraph', text: 'Buy Age of Empires II: Definitive Edition (PC) key and experience a real-time strategy game that is definitive for the genre and tested by time. First released on September 13th, 1999, Age of Empires II saw multiple upgrades and expansions through two decades, and still maintains an active and passionate community of fans. With the Definitive Edition, new features and tweaks are introduced to the game that will satisfy both long-time fans and newcomers.' },
  { kind: 'paragraph', text: 'Lead one of 35 civilizations through the Middle Ages, gather resources, build an economy and raise armies to conquer your rivals across land and sea.' },
]

export const activationSteps = [
  'Download and install the Steam client.',
  'Sign in or create a Steam account.',
  'Open Games › Activate a Product on Steam.',
  'Enter the key from your Eneba order and follow the prompts.',
]

export const requirements: RequirementSet[] = [
  {
    platform: 'Windows',
    minimum: [
      { label: 'System requirements', value: 'Windows 10 64bit' },
      { label: 'Processor', value: 'Intel Core 2 Duo or AMD Athlon 64x2 5600+' },
      { label: 'Memory', value: '4 GB RAM' },
      { label: 'Graphics', value: 'NVIDIA GeForce GT 420 or ATI Radeon HD 6850 or Intel HD Graphics 3000' },
      { label: 'Storage', value: '30 GB' },
      { label: 'Additional Notes', value: 'Requires a 64-bit processor and operating system' },
    ],
    recommended: [
      { label: 'System requirements', value: 'Windows 10 64bit' },
      { label: 'Processor', value: '2.4 Ghz i5 AMD' },
      { label: 'Memory', value: '8 GB RAM' },
      { label: 'Graphics', value: 'Nvidia GTX 650 or AMD HD 5850' },
      { label: 'Storage', value: '30 GB' },
      { label: 'Additional Notes', value: 'Requires a 64-bit processor and operating system' },
    ],
  },
]

export const otherDetails: SpecRow[] = [
  { label: 'Languages', value: ['Chinese', 'English', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Portuguese - Brasil', 'Russian', 'Spanish', 'Turkish', 'Vietnamese'] },
  { label: 'Release date', value: 'November 14, 2019' },
  { label: 'Publisher', value: 'Xbox Game Studios' },
  { label: 'Developers', value: 'Forgotten Empires / Tantalus / Wicked Witch' },
  { label: 'Works on', value: 'Windows' },
]

export const alsoViewed: Product[] = [
  { title: 'Age of Empires II: Definitive Edition - Windows 10 Store Key GLOBAL', platform: 'Windows Store', region: 'Global', price: '€8.33', oldPrice: '€19.99', discount: '-58%', cashback: '€0.92', cover: 'bg-linear-to-b from-primary to-card' },
  { title: 'Age of Empires II: Definitive Edition - Windows 10 Store Key EUROPE', platform: 'Windows Store', region: 'Europe', price: '€8.33', cashback: '€0.92', cover: 'bg-linear-to-b from-primary to-surface-deep' },
  { title: 'Age of Empires II: Definitive Edition XBOX LIVE Key ARGENTINA', platform: 'Xbox Live', region: 'Argentina', regionTone: 'alt', price: '€7.79', cashback: '€0.86', cover: 'bg-linear-to-b from-region-eu to-card' },
  { title: 'Age of Empires II: Definitive Edition XBOX LIVE Key GLOBAL', platform: 'Xbox Live', region: 'Global', price: '€7.99', cashback: '€0.88', cover: 'bg-linear-to-b from-region-eu to-surface-deep' },
  { title: 'Age of Empires II: Definitive Edition (PC) Steam Key LATAM', platform: 'Steam', region: 'Latin America', regionTone: 'alt', price: '€50.94', cashback: '€5.60', cover: 'bg-linear-to-b from-region-alt to-card' },
]
