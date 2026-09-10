import { connectDB } from './db'
import { User } from '@/models/User'

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.log('[seed-admin] ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin creation')
    return
  }

  try {
    await connectDB()
    const existing = await User.findOne({ email: adminEmail })
    if (existing) {
      console.log('[seed-admin] Admin account already exists')
      return
    }

    const admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      status: 'active',
    })

    console.log('[seed-admin] Admin account created successfully:', admin.email)
  } catch (error) {
    console.error('[seed-admin] Error:', error)
  }
}
