import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { v4 as uuid } from 'uuid'

const GOOGLE_PASSWORD = 'google-oauth-fixed-2024'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { access_token } = body

    if (!access_token) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 400 })
    }

    // Verify access token by fetching user info from Google
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    if (!userInfoRes.ok) {
      const errorText = await userInfoRes.text()
      console.error('Google Auth: UserInfo fetch failed:', errorText)
      return NextResponse.json({ error: 'Invalid Google access token' }, { status: 400 })
    }

    const googleUser: any = await userInfoRes.json()
    console.log('Google Auth: Fetched user:', googleUser.email)

    if (!googleUser || !googleUser.email) {
      return NextResponse.json({ error: 'Invalid Google token payload' }, { status: 400 })
    }

    const email = googleUser.email
    const name = googleUser.name || ''
    const picture = googleUser.picture || ''
    const googleId = googleUser.sub

    const payloadCMS = await getPayload({ config })

    // Check if user exists
    const users = await payloadCMS.find({
      collection: 'users',
      where: { email: { equals: email } },
      overrideAccess: true,
    })

    let user: any

    if (users.totalDocs === 0) {
      console.log('Google Auth: Creating new user')
      user = await payloadCMS.create({
        collection: 'users',
        data: {
          email,
          name,
          googleId,
          picture,
          password: GOOGLE_PASSWORD,
          role: 'user',
        },
        overrideAccess: true,
      })
    } else {
      user = users.docs[0]
      console.log('Google Auth: Found existing user:', user.id)
      // Ensure google fields and password are up-to-date
      await payloadCMS.update({
        collection: 'users',
        id: user.id,
        data: {
          googleId: user.googleId || googleId,
          picture: user.picture || picture,
          name: user.name || name,
          password: GOOGLE_PASSWORD,
        },
        overrideAccess: true,
      })
      // Re-fetch after update to get latest sessions
      const refetched = await payloadCMS.find({
        collection: 'users',
        where: { email: { equals: email } },
        overrideAccess: true,
      })
      user = refetched.docs[0]
    }

    const collectionConfig = payloadCMS.collections['users'].config
    const tokenExpiration = collectionConfig.auth.tokenExpiration ?? 7200

    // ─── Create a session (required by Payload v3's JWT strategy) ─────────────
    const sid = uuid()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + tokenExpiration * 1000)

    const existingSessions: any[] = (user.sessions || []).filter((s: any) => {
      const exp = s.expiresAt instanceof Date ? s.expiresAt : new Date(s.expiresAt)
      return exp > now
    })

    const newSessions = [...existingSessions, { id: sid, createdAt: now, expiresAt }]

    // Persist session to DB using Payload's low-level DB update
    await payloadCMS.db.updateOne({
      id: user.id,
      collection: 'users',
      data: { sessions: newSessions },
      req: {} as any,
      returning: false,
    })

    // ─── Sign the token with jose (identical to Payload internals) ─────────────
    const secretKey = new TextEncoder().encode(process.env.PAYLOAD_SECRET!)
    const issuedAt = Math.floor(Date.now() / 1000)
    const exp = issuedAt + tokenExpiration

    const token = await new SignJWT({
      id: user.id,
      collection: 'users',
      email: user.email,
      sid, // Session ID — required by Payload v3 jwtVerify strategy
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(issuedAt)
      .setExpirationTime(exp)
      .sign(secretKey)

    // ─── Set cookie with Payload's expected name ────────────────────────────────
    const cookiePrefix = payloadCMS.config.cookiePrefix ?? 'payload'
    const cookieName = `${cookiePrefix}-token`

    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name }, token },
      { status: 200 },
    )

    response.cookies.set(cookieName, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenExpiration,
      sameSite: 'lax',
    })

    console.log('Google Auth: Session created sid:', sid, '— user:', user.email)
    return response

  } catch (err: any) {
    console.error('CRITICAL Google Auth Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
