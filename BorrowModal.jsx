'use client'

import React, { useState } from 'react'
import { X, Layers, AlertTriangle } from 'lucide-react'

export default function BorrowModal({ isOpen, onClose, onSubmit, books = [], members = [] }) {
  const [formData, setFormData] = useState({
    bookId: '',
    memberId: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const availableBooks = books.filter(b => (Number(b.quantity) || 0) > 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.bookId || !formData.memberId) {
      setError('กรุณาเลือกหนังสือและสมาชิก')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      await onSubmit(formData)
      setFormData({ bookId: '', memberId: '' })
      onClose()
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการยืม')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">บันทึกการยืมหนังสือ</h3>
              <p className="text-xs text-slate-500">บันทึกลงตาราง borrow_records & ตัดสต็อกใน books</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เลือกสมาชิกผู้ยืม (member_id) *
            </label>
            <select
              required
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="">-- กรุณาเลือกสมาชิก --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  #{m.id} - {m.name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เลือกหนังสือที่ต้องการยืม (book_id) *
            </label>
            <select
              required
              value={formData.bookId}
              onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="">-- กรุณาเลือกหนังสือ (เฉพาะที่มีคงเหลือ) --</option>
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  #{b.id} - {b.title} (คงเหลือ: {b.quantity} เล่ม)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-800">
            💡 <strong>Business Logic ใน Back-end:</strong> เมื่อส่งคำขอยืม Prisma จะทำการบันทึก Record และลดจำนวน `quantity` ของหนังสือเล่มนั้นลง 1 เล่มทันที
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการยืมหนังสือ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
