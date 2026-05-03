import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Please provide an email parameter, e.g., /api/promote?email=your@email.com' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    
    const users = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email }
      },
      overrideAccess: true,
    })

    if (users.totalDocs === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users.docs[0]

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        role: 'admin'
      },
      overrideAccess: true,
    })

    return NextResponse.json({ message: `User ${email} has been promoted to admin successfully!` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
