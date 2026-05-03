import type { CollectionConfig } from 'payload'

const isAdminOrOwner = ({ req: { user } }: any) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return { user: { equals: user.id } };
};

export const Seats: CollectionConfig = {
  slug: 'seats',
  admin: {
    useAsTitle: 'seatNumber',
  },
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
      name: 'seatNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'flight',
      type: 'relationship',
      relationTo: 'flights',
      required: true,
    },
    {
      name: 'passengerName',
      type: 'text',
      required: true,
    },
  ],
}
