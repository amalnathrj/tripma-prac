import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { id: { equals: user.id } };
    },
    create: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { id: { equals: user.id } };
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'user'],
      defaultValue: 'user',
      required: true,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'googleId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'picture',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
