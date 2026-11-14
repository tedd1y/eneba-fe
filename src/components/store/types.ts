/** One selectable value in a store filter. `count` is the number of matching products. */
export type FilterOption = {
  value: string
  label: string
  count?: number
}
