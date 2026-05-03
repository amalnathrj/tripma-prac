import type { CollectionConfig } from 'payload'

const isAdminOrOwner = ({ req: { user } }: any) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return { user: { equals: user.id } };
};

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'id',
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
      name: 'flight',
      type: 'relationship',
      relationTo: 'flights',
      required: true,
    },
    {
      name: 'seat',
      type: 'relationship',
      relationTo: 'seats',
      required: true,
    },
    {
      name: 'payment',
      type: 'relationship',
      relationTo: 'payments',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'confirmed', 'cancelled'],
      defaultValue: 'confirmed',
    },
    {
      name: 'passengerName',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'seatNumber',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'chosenDate',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'from',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'to',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
