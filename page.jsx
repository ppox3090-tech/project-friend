import { prisma } from '@/lib/prisma'
import LibraryDashboard from '@/components/LibraryDashboard'

// Server Component: ทำงานบน Server-side (SSR: Server-Side Rendering)
// ทำหน้าที่ดึงข้อมูลตั้งต้นผ่าน Prisma ORM (MiddleWare) โดยตรงบนเซิร์ฟเวอร์
// แล้วส่งต่อ (Props) ให้กับ Client Component ฝั่ง Front-end
export default async function HomePage() {
  let initialBooks = []
  let initialMembers = []
  let initialBorrowRecords = []

  try {
    initialBooks = await prisma.book.findMany({ orderBy: { id: 'desc' } })
    initialMembers = await prisma.member.findMany()
    initialBorrowRecords = await prisma.borrowRecord.findMany({
      include: {
        book: true,
        member: true
      }
    })
  } catch (err) {
    console.warn('Server-side rendering fetch notice:', err.message)
  }

  // แปลง Date เป็น ISO string ป้องกัน Next.js serialization error ระหว่าง Server และ Client
  const serializedBooks = JSON.parse(JSON.stringify(initialBooks))
  const serializedMembers = JSON.parse(JSON.stringify(initialMembers))
  const serializedBorrowRecords = JSON.parse(JSON.stringify(initialBorrowRecords))

  return (
    <LibraryDashboard
      initialBooks={serializedBooks}
      initialMembers={serializedMembers}
      initialBorrowRecords={serializedBorrowRecords}
    />
  )
}
