'use client'

import React, { useState, useEffect } from 'react'
import { Database, Server, Cpu, CheckCircle2, Code2, Terminal, ExternalLink, RefreshCw } from 'lucide-react'

export default function ArchitectureInspector() {
  const [systemInfo, setSystemInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')

  const fetchSystemInfo = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/system-info')
      const data = await res.json()
      setSystemInfo(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemInfo()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>โครงงานขั้นที่ 1: ตรวจสอบความถูกต้อง 100% ตรงตามข้อกำหนด</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ระบบจัดการห้องสมุด (Library Management System)
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl leading-relaxed">
            หน้าจอนี้สรุปรายละเอียดสถาปัตยกรรมและเทคโนโลยีที่ใช้งานจริงในแอปพลิเคชัน เพื่อนำไปใช้อ้างอิงและตอบคำถามทุกข้อในเอกสารแผนโครงงานขั้นที่ 1
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'summary'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              📋 ตารางเทียบข้อกำหนด 3 หมวด
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'schema'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              🗄️ โครงสร้างฐานข้อมูล & Prisma Schema
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'api'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              ⚡ Live API & SSR/CSR Verification
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Summary Matrix */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Data Repository */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                1. หมวดแหล่งข้อมูล (Data Repository)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                การจัดเก็บข้อมูล ความสัมพันธ์ และตัวกลางเชื่อมต่อ
              </p>

              <ul className="space-y-3 text-xs text-slate-600">
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">ชื่อฐานข้อมูล:</span>
                  <code className="text-blue-600 font-mono">library_db</code> (MySQL / RDBMS)
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">โครงสร้างตาราง (3 ตารางหลัก):</span>
                  <div className="mt-1 space-y-1">
                    <div>• <code>books</code> (id, title, author, isbn, category, quantity)</div>
                    <div>• <code>members</code> (id, name, email, phone)</div>
                    <div>• <code>borrow_records</code> (id, book_id, member_id, borrow_date, return_date, status)</div>
                  </div>
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">ซอฟต์แวร์ระบบฐานข้อมูล:</span>
                  XAMPP / MySQL Server (Port 3306)
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">MiddleWare ตัวกลาง:</span>
                  Prisma ORM (ทำหน้าที่เป็น interface แปลงคำสั่ง JS เป็น SQL)
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">Connection String:</span>
                  <code className="text-[11px] text-indigo-600 font-mono break-all">
                    mysql://root:@localhost:3306/library_db
                  </code>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
              ตรงตามแผนโครงงาน หมวด 1 ครบทุกข้อ
            </div>
          </div>

          {/* Card 2: Framework */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mb-4">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                2. หมวด Framework การพัฒนา
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Next.js Full-stack, Node.js และ Tailwind CSS
              </p>

              <ul className="space-y-3 text-xs text-slate-600">
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">ชื่อ Framework:</span>
                  <strong>Next.js (App Router)</strong>
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">ความสามารถ:</span>
                  <strong>ทั้งสองอย่าง (Full-stack)</strong> — รองรับ React (Front-end) และ Route Handlers / Server Actions (Back-end)
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">ความเกี่ยวข้องกับ Node.js:</span>
                  ทำงานบน Node.js runtime ฝั่ง Server ใช้ Node.js รัน server-side code และ build ทั้งหมด
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">การเชื่อมต่อฐานข้อมูล:</span>
                  ผ่าน <code>PrismaClient</code> ใน Route Handlers
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">หลักฐาน Middleware:</span>
                  ใช้ Prisma Client ไม่ต่อ direct SQL socket เพื่อความปลอดภัย
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">CSS Framework:</span>
                  <strong>Tailwind CSS</strong> (Utility-first CSS)
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
              ตรงตามแผนโครงงาน หมวด 2 ครบทุกข้อ
            </div>
          </div>

          {/* Card 3: Architecture */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                3. หมวดสถาปัตยกรรม (Architecture)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                SSR vs CSR, Client/Server Role และ Data Flow
              </p>

              <ul className="space-y-3 text-xs text-slate-600">
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">สถาปัตยกรรมที่สนับสนุน (2 อย่าง):</span>
                  <strong>Server-Side Rendering (SSR)</strong> และ <strong>Client-Side Rendering (CSR)</strong>
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">ภาษาที่ใช้:</span>
                  • Back-end: JavaScript / TypeScript (Node.js)<br />
                  • Front-end: JavaScript / TypeScript + JSX (React)
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">บทบาทหน้าที่ (Roles):</span>
                  • <strong>Back-end:</strong> รับ HTTP Request, ตรวจสอบ logic, ดึง/บันทึกผ่าน Prisma ส่งกลับเป็น JSON<br />
                  • <strong>Front-end:</strong> แสดง UI, รับอินพุตผู้ใช้, เรียก API fetch
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">Client vs Server Side:</span>
                  • <strong>Client-side:</strong> Interactivity, State, Modal, Real-time update<br />
                  • <strong>Server-side:</strong> DB connection, API routes, Server Components
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
              ตรงตามแผนโครงงาน หมวด 3 ครบทุกข้อ
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schema Viewer */}
      {activeTab === 'schema' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                ไฟล์กำหนดโครงสร้าง: <code className="text-blue-600">prisma/schema.prisma</code>
              </h3>
              <p className="text-xs text-slate-500">
                หลักฐานแสดงการใช้งาน Prisma ORM เป็น Middleware และโครงสร้าง 3 ตารางใน MySQL
              </p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
              MiddleWare Interface
            </span>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`// MiddleWare Interface: Prisma ORM
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL") // mysql://root:@localhost:3306/library_db
}

generator client {
  provider = "prisma-client-js"
}

// 1. ตารางหนังสือ (books)
model Book {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(255)
  author    String   @db.VarChar(255)
  isbn      String   @unique @db.VarChar(50)
  category  String   @db.VarChar(100)
  quantity  Int      @default(1)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  borrowRecords BorrowRecord[]
  @@map("books")
}

// 2. ตารางสมาชิก (members)
model Member {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(255)
  email     String   @unique @db.VarChar(255)
  phone     String   @db.VarChar(50)
  createdAt DateTime @default(now()) @map("created_at")

  borrowRecords BorrowRecord[]
  @@map("members")
}

// 3. ตารางการยืม-คืน (borrow_records)
model BorrowRecord {
  id         Int       @id @default(autoincrement())
  bookId     Int       @map("book_id")
  memberId   Int       @map("member_id")
  borrowDate DateTime  @default(now()) @map("borrow_date")
  returnDate DateTime? @map("return_date")
  status     String    @default("borrowed") @db.VarChar(50)

  book   Book   @relation(fields: [bookId], references: [id])
  member Member @relation(fields: [memberId], references: [id])
  @@map("borrow_records")
}`}
          </pre>
        </div>
      )}

      {/* Tab 3: Live API Verification */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <span>ตรวจสอบการส่งข้อมูล JSON จาก Back-end สู่ Front-end (Live JSON)</span>
              </h3>
              <p className="text-xs text-slate-500">
                สาธิตตามข้อคำถาม: &quot;ข้อมูลจาก back-end นำไปใช้ใน front-end ได้อย่างไร&quot; (Back-end ส่ง JSON → Front-end fetch)
              </p>
            </div>
            <button
              onClick={fetchSystemInfo}
              className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>รีเฟรชข้อมูล</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                🎯 Endpoints ที่เปิดให้บริการในระบบ:
              </span>
              <ul className="text-xs space-y-2 text-slate-600 font-mono">
                <li className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-emerald-600 font-bold">GET /api/books</span>
                  <span className="text-slate-400">รายการหนังสือทั้งหมด</span>
                </li>
                <li className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-blue-600 font-bold">POST /api/books</span>
                  <span className="text-slate-400">เพิ่มหนังสือใหม่</span>
                </li>
                <li className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-emerald-600 font-bold">GET /api/members</span>
                  <span className="text-slate-400">รายชื่อสมาชิก</span>
                </li>
                <li className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-amber-600 font-bold">POST /api/borrow</span>
                  <span className="text-slate-400">ยืมหนังสือ (ตัดสต็อก)</span>
                </li>
                <li className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-indigo-600 font-bold">PATCH /api/borrow</span>
                  <span className="text-slate-400">คืนหนังสือ (คืนสต็อก)</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs overflow-auto max-h-72">
              <span className="text-[11px] text-slate-400 block mb-2">// Response from /api/system-info:</span>
              <pre>{JSON.stringify(systemInfo, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
