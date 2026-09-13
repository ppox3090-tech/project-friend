'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpen, Search, Plus, Trash2, Edit, RefreshCw,
  Users, Layers, CheckCircle2, Clock, RotateCcw, AlertCircle
} from 'lucide-react'
import Navbar from './Navbar'
import StatsCards from './StatsCards'
import BookModal from './BookModal'
import MemberModal from './MemberModal'
import BorrowModal from './BorrowModal'
import ArchitectureInspector from './ArchitectureInspector'

export default function LibraryDashboard({ initialBooks = [], initialMembers = [], initialBorrowRecords = [] }) {
  const [activeTab, setActiveTab] = useState('books')

  // Client-side state (demonstrating CSR & React interactivity)
  const [books, setBooks] = useState(initialBooks)
  const [members, setMembers] = useState(initialMembers)
  const [borrowRecords, setBorrowRecords] = useState(initialBorrowRecords)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [bookToEdit, setBookToEdit] = useState(null)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false)

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Fetch all data from Back-end API (Demonstrates Client-side API fetch)
  const refreshAllData = async () => {
    try {
      setIsLoading(true)
      const [booksRes, membersRes, borrowRes] = await Promise.all([
        fetch('/api/books').then(r => r.json()),
        fetch('/api/members').then(r => r.json()),
        fetch('/api/borrow').then(r => r.json())
      ])

      if (booksRes.success) setBooks(booksRes.data)
      if (membersRes.success) setMembers(membersRes.data)
      if (borrowRes.success) setBorrowRecords(borrowRes.data)
    } catch (err) {
      console.error('Error refreshing data:', err)
      showToast('ไม่สามารถดึงข้อมูลล่าสุดได้', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Book Handlers
  const handleSaveBook = async (bookData) => {
    if (bookToEdit) {
      // PUT
      const res = await fetch(`/api/books/${bookToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error)
      showToast('แก้ไขข้อมูลหนังสือเรียบร้อยแล้ว')
    } else {
      // POST
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      })
      const result = await res.json()
      if (!result.success) throw new Error(result.error)
      showToast('เพิ่มหนังสือเข้าสู่คลังเรียบร้อยแล้ว')
    }
    refreshAllData()
  }

  const handleDeleteBook = async (id, title) => {
    if (!confirm(`คุณต้องการลบหนังสือ "${title}" หรือไม่?`)) return
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        showToast('ลบหนังสือสำเร็จ')
        refreshAllData()
      } else {
        showToast(result.error || 'ไม่สามารถลบได้', 'error')
      }
    } catch (e) {
      showToast('เกิดข้อผิดพลาดในการลบ', 'error')
    }
  }

  // Member Handlers
  const handleSaveMember = async (memberData) => {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData)
    })
    const result = await res.json()
    if (!result.success) throw new Error(result.error)
    showToast('เพิ่มสมาชิกใหม่เรียบร้อยแล้ว')
    refreshAllData()
  }

  // Borrow Handlers
  const handleBorrowBook = async (borrowData) => {
    const res = await fetch('/api/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(borrowData)
    })
    const result = await res.json()
    if (!result.success) throw new Error(result.error)
    showToast('บันทึกการยืมหนังสือสำเร็จและตัดสต็อกแล้ว')
    refreshAllData()
  }

  const handleReturnBook = async (recordId) => {
    try {
      const res = await fetch('/api/borrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId })
      })
      const result = await res.json()
      if (result.success) {
        showToast('บันทึกการคืนหนังสือเรียบร้อยและคืนสต็อกแล้ว')
        refreshAllData()
      } else {
        showToast(result.error || 'เกิดข้อผิดพลาดในการคืนหนังสือ', 'error')
      }
    } catch (e) {
      showToast('เกิดข้อผิดพลาดในการคืนหนังสือ', 'error')
    }
  }

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'ALL' || book.category === selectedCategory
    const q = searchQuery.toLowerCase()
    const matchesSearch = !searchQuery ||
      book.title?.toLowerCase().includes(q) ||
      book.author?.toLowerCase().includes(q) ||
      book.isbn?.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  const categories = ['ALL', ...new Set(books.map(b => b.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-sm border border-slate-700 animate-bounce">
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Summary Stats Cards */}
        <StatsCards books={books} members={members} borrowRecords={borrowRecords} />

        {/* TAB 1: Books Management */}
        {activeTab === 'books' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อหนังสือ, ผู้แต่ง, ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-700"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c === 'ALL' ? 'ทุกหมวดหมู่' : c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                <button
                  onClick={refreshAllData}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200"
                  title="รีเฟรชข้อมูลจาก API"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => { setBookToEdit(null); setIsBookModalOpen(true); }}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มหนังสือใหม่</span>
                </button>
              </div>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    รายการหนังสือในห้องสมุด (ตาราง <code>books</code>)
                  </h3>
                  <p className="text-xs text-slate-500">
                    แสดงผลผ่าน Next.js Client Component โดยรับข้อมูลจาก Prisma Client
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {filteredBooks.length} รายการ
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3">รหัส (id)</th>
                      <th className="px-5 py-3">ชื่อหนังสือ (title)</th>
                      <th className="px-5 py-3">ผู้แต่ง (author)</th>
                      <th className="px-5 py-3">ISBN</th>
                      <th className="px-5 py-3">หมวดหมู่ (category)</th>
                      <th className="px-5 py-3 text-center">คงเหลือ (quantity)</th>
                      <th className="px-5 py-3 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-5 py-8 text-center text-slate-400">
                          ไม่พบหนังสือที่ตรงกับเงื่อนไข
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-slate-500">#{book.id}</td>
                          <td className="px-5 py-3.5 font-medium text-slate-900">{book.title}</td>
                          <td className="px-5 py-3.5 text-slate-600">{book.author}</td>
                          <td className="px-5 py-3.5 font-mono text-slate-500 text-xs">{book.isbn}</td>
                          <td className="px-5 py-3.5">
                            <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              book.quantity > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {book.quantity} เล่ม
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => { setBookToEdit(book); setIsBookModalOpen(true); }}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="แก้ไขข้อมูล"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id, book.title)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="ลบหนังสือ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Borrow & Return System */}
        {activeTab === 'borrow' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ระบบบันทึกการยืม-คืนหนังสือ (ตาราง <code>borrow_records</code>)
                </h3>
                <p className="text-xs text-slate-500">
                  เชื่อมโยงความสัมพันธ์ (Foreign Key) ระหว่าง books และ members
                </p>
              </div>
              <button
                onClick={() => setIsBorrowModalOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-amber-500/20"
              >
                <Layers className="w-4 h-4" />
                <span>บันทึกการยืมหนังสือ</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3">รหัสบันทึก</th>
                      <th className="px-5 py-3">หนังสือที่ยืม</th>
                      <th className="px-5 py-3">สมาชิกผู้ยืม</th>
                      <th className="px-5 py-3">วันที่ยืม</th>
                      <th className="px-5 py-3">วันที่คืน</th>
                      <th className="px-5 py-3 text-center">สถานะ</th>
                      <th className="px-5 py-3 text-right">ดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {borrowRecords.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-5 py-8 text-center text-slate-400">
                          ยังไม่มีประวัติการยืม-คืนในระบบ
                        </td>
                      </tr>
                    ) : (
                      borrowRecords.map((record) => {
                        const isReturned = record.status === 'returned'
                        const isOverdue = record.status === 'overdue'

                        return (
                          <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-slate-500">#{record.id}</td>
                            <td className="px-5 py-3.5">
                              <span className="font-medium text-slate-900 block">
                                {record.book ? record.book.title : `รหัสหนังสือ #${record.bookId}`}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">
                                ISBN: {record.book ? record.book.isbn : '-'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-medium text-slate-800 block">
                                {record.member ? record.member.name : `รหัสสมาชิก #${record.memberId}`}
                              </span>
                              <span className="text-xs text-slate-400">
                                {record.member ? record.member.phone : '-'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600">
                              {new Date(record.borrowDate).toLocaleDateString('th-TH')}
                            </td>
                            <td className="px-5 py-3.5 text-slate-600">
                              {record.returnDate
                                ? new Date(record.returnDate).toLocaleDateString('th-TH')
                                : <span className="text-slate-400 italic">ยังไม่คืน</span>}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              {isReturned ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                  คืนเรียบร้อย
                                </span>
                              ) : isOverdue ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                  <Clock className="w-3 h-3 mr-1 text-rose-600" />
                                  เกินกำหนด (Overdue)
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3 h-3 mr-1 text-amber-600" />
                                  กำลังยืม
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {!isReturned ? (
                                <button
                                  onClick={() => handleReturnBook(record.id)}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>คืนหนังสือ</span>
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">เสร็จสิ้น</span>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Members Management */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  รายชื่อสมาชิกห้องสมุด (ตาราง <code>members</code>)
                </h3>
                <p className="text-xs text-slate-500">
                  เก็บข้อมูลผู้ใช้งานระบบห้องสมุดตามสเปกโครงงาน
                </p>
              </div>
              <button
                onClick={() => setIsMemberModalOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/20"
              >
                <Users className="w-4 h-4" />
                <span>เพิ่มสมาชิกใหม่</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3">รหัสสมาชิก (id)</th>
                      <th className="px-5 py-3">ชื่อ-สกุล (name)</th>
                      <th className="px-5 py-3">อีเมล (email)</th>
                      <th className="px-5 py-3">เบอร์โทรศัพท์ (phone)</th>
                      <th className="px-5 py-3">วันที่สมัคร</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-slate-500">#{member.id}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-900">{member.name}</td>
                        <td className="px-5 py-3.5 font-mono text-slate-600 text-xs">{member.email}</td>
                        <td className="px-5 py-3.5 text-slate-600">{member.phone}</td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs">
                          {new Date(member.createdAt).toLocaleDateString('th-TH')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Architecture & Step 1 Validation */}
        {activeTab === 'architecture' && (
          <ArchitectureInspector />
        )}
      </main>

      {/* Modals */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSubmit={handleSaveBook}
        bookToEdit={bookToEdit}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSubmit={handleSaveMember}
      />

      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        onSubmit={handleBorrowBook}
        books={books}
        members={members}
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p>ระบบจัดการห้องสมุด (Library Management System) — พัฒนาตรงตามแผนโครงงาน ขั้นที่ 1</p>
        <p className="mt-1 font-mono text-[11px] text-slate-400">
          Tech Stack: Next.js (App Router, SSR+CSR) • Tailwind CSS • Prisma ORM • MySQL (library_db)
        </p>
      </footer>
    </div>
  )
}
