import type { CollectionConfig } from 'payload'

const isAdminOrOwner = ({ req: { user } }: any) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return { user: { equals: user.id } };
};

export const Payments: CollectionConfig = {
  slug: 'payments',
  access: {
    read: isAdminOrOwner,
    create: ({ req: { user } }) => !!user,
    update: isAdminOrOwner,
    delete: isAdminOrOwner,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'method',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['success', 'failed', 'pending'],
      defaultValue: 'success',
    },
  ],
}
