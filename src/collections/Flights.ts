import type { CollectionConfig } from 'payload'

export const Flights: CollectionConfig = {
  slug: 'flights',
  admin: {
    useAsTitle: 'flightNo',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'airline', type: 'text', required: true },
    { name: 'flightNo', type: 'text', required: true },
    { name: 'duration', type: 'text', required: true },
    { name: 'time', type: 'text', required: true },
    { name: 'stops', type: 'text', required: true },
    { name: 'stopDetail', type: 'text' },
    { name: 'price', type: 'number', required: true },
    { name: 'flag', type: 'text' },
    { name: 'logo', type: 'text' },
  ],
}
