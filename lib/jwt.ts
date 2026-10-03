import { SignJWT, jwtVerify } from 'jose'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  [key: string]: unknown
}

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET || 'careersetu_default_secret_jwt_key_at_least_32_characters'
  return new TextEncoder().encode(secret)
}

export async function createToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecretKey())
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey())
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}
