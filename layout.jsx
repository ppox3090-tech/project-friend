import './globals.css'

export const metadata = {
  title: 'ระบบจัดการห้องสมุด (Library Management System) - แผนโครงงานขั้นที่ 1',
  description: 'Full-stack Web Application built with Next.js, Tailwind CSS, and Prisma ORM connecting to MySQL (library_db)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  )
}
