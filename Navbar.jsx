'use client'

import React from 'react'
import { BookOpen, Database, Layers, ShieldCheck } from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'books', label: 'คลังหนังสือ (Books)', icon: BookOpen },
    { id: 'borrow', label: 'ยืม-คืนหนังสือ (Borrow/Return)', icon: Layers },
    { id: 'members', label: 'สมาชิก (Members)', icon: ShieldCheck },
    { id: 'architecture', label: 'ตรวจสอบโครงงานขั้นที่ 1 (Plan Spec)', icon: Database, highlight: true }
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('books')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Smart Library</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Step 1 Spec
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">ระบบจัดการห้องสมุด (Next.js + Prisma ORM + MySQL)</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                        : 'bg-blue-50 text-blue-700 font-semibold'
                      : item.highlight
                      ? 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive && !item.highlight ? 'text-blue-600' : ''}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* System Badge */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Prisma Middleware Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex border-t border-slate-100 bg-slate-50/80 px-2 py-1.5 overflow-x-auto space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>
    </header>
  )
}
