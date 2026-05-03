import type { CollectionConfig } from 'payload'

export const Stays: CollectionConfig = {
  slug: 'stays',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'src', type: 'text', required: true },
    { name: 'alt', type: 'text' },
  ],
}
