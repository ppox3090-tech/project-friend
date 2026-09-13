import React from 'react'
import { Book, Users, Repeat, CheckCircle, Database } from 'lucide-react'

export default function StatsCards({ books = [], members = [], borrowRecords = [] }) {
  const totalBooks = books.length
  const totalCopies = books.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0)
  const totalMembers = members.length
  const activeBorrows = borrowRecords.filter(r => r.status === 'borrowed').length
  const returnedCount = borrowRecords.filter(r => r.status === 'returned').length

  const stats = [
    {
      title: 'หนังสือทั้งหมด (Books)',
      value: `${totalBooks} เรื่อง (${totalCopies} เล่ม)`,
      sub: 'บันทึกในตาราง books',
      icon: Book,
      color: 'blue'
    },
    {
      title: 'สมาชิกห้องสมุด (Members)',
      value: `${totalMembers} คน`,
      sub: 'บันทึกในตาราง members',
      icon: Users,
      color: 'emerald'
    },
    {
      title: 'กำลังยืมอยู่ (Active Borrows)',
      value: `${activeBorrows} รายการ`,
      sub: 'สถานะ status="borrowed"',
      icon: Repeat,
      color: 'amber'
    },
    {
      title: 'ส่งคืนสำเร็จ (Returned)',
      value: `${returnedCount} รายการ`,
      sub: 'ตาราง borrow_records',
      icon: CheckCircle,
      color: 'indigo'
    }
  ]

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((item, idx) => {
        const Icon = item.icon
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                {item.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {item.value}
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Database className="w-3 h-3 text-slate-400" />
                {item.sub}
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${colorStyles[item.color]}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
