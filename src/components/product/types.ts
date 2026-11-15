import type { LucideIcon } from 'lucide-react'

/** A line of text inside a feature row; `link` renders as a gold inline link, `positive` in green. */
export type FeatureLine = {
  text: string
  link?: { label: string, href: string }
  positive?: boolean
}

/** One "Global, Europe" / "Steam" / "Digital key" row next to the box art. */
export type ProductFeature = {
  icon: LucideIcon
  title: string
  lines: FeatureLine[]
}

export type BreadcrumbItem = { label: string, href?: string }

export type MediaItem = {
  id: string
  kind: 'image' | 'video'
  /** Token classes for the placeholder until real thumbnails are wired in. */
  cover: string
  alt: string
}

export type Price = {
  price: string
  oldPrice?: string
  discount?: string
}

export type FeaturedOffer = Price & {
  cashbackPercent?: string
  bestCashback?: boolean
  priceNotFinal?: boolean
  promotionNote?: string
  otherOffers?: { count: number, from: string }
}

export type Seller = {
  name: string
  /** Initials shown in the avatar until seller logos exist. */
  initials: string
  verified?: boolean
  rating?: { score: string, label: string }
  /** Line shown instead of a rating ("Verified by Eneba"). */
  note?: string
}

export type Offer = Price & {
  id: string
  seller: Seller
  cashbackPercent?: string
  bestCashback?: boolean
}

export type RatingAspect = { label: string, value: number }

export type Review = {
  id: string
  author: string
  /** ISO 3166 alpha-2, rendered as a flag. */
  country: string
  date: string
  rating: number
  text: string
  /** Original-language text; when present the translate button toggles to it. */
  originalText?: string
  autoTranslated?: boolean
  votes: number
}

export type SpecRow = { label: string, value: string | string[] }

export type RequirementSet = {
  platform: string
  minimum: SpecRow[]
  recommended?: SpecRow[]
}

export type DescriptionBlock =
  | { kind: 'paragraph', text: string }
  | { kind: 'list', items: string[] }
