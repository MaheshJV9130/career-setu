import { connectDB } from '@/lib/db'
import { Career } from '@/models/Career'
import { ok, fail } from '@/lib/api-response'
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) return fail('Career ID or slug is required.', 400)

    await connectDB()

    const isObjectId = mongoose.Types.ObjectId.isValid(id)
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }

    const career = await Career.findOne(query).lean()
    if (!career) {
      return fail('Career not found.', 404)
    }

    return ok({ career }, 'Career retrieved successfully')
  } catch (error) {
    console.error('[career-detail-get]', error)
    return fail('Unable to fetch career details.', 500)
  }
}
