import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'location', type: 'text' },
    { name: 'text', type: 'text', required: true },
    { name: 'img', type: 'text' },
    { name: 'rating', type: 'number', defaultValue: 5 },
  ],
}
