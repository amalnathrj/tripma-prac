import type { CollectionConfig } from 'payload'

export const FlightDeals: CollectionConfig = {
  slug: 'flightDeals',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'place', type: 'text', required: true },
    { name: 'price', type: 'text', required: true },
    { name: 'desc', type: 'text' },
    { name: 'img', type: 'text', required: true },
    { name: 'isBigCard', type: 'checkbox', defaultValue: false },
  ],
}
