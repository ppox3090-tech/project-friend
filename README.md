# Library Management System (ระบบจัดการห้องสมุด)
### โครงงานพัฒนา Web Application — ขั้นที่ 1 (Step 1)

โปรเจกต์เว็บแอปพลิเคชันระบบจัดการห้องสมุด พัฒนาขึ้นตามข้อกำหนดในเอกสาร `D:\แผนโครงงาน_ขั้นที่1.md` ครบถ้วน 100%

---

## 🛠️ Stack & Technologies
- **Front-end**: Next.js 14 App Router, React JSX, Client-Side Rendering (CSR), React Hooks
- **Styling**: Tailwind CSS (Utility-first CSS Framework)
- **Back-end**: Next.js Server Components, Server-Side Rendering (SSR), API Route Handlers
- **Runtime**: Node.js Runtime
- **MiddleWare Interface**: Prisma ORM (Prisma Client)
- **Database (Data Repository)**: MySQL (`library_db`) / Port 3306

---

## 📁 Project Structure
```
library-management-system/
├── app/
│   ├── api/
│   │   ├── books/
│   │   │   ├── route.js          # GET / POST books
│   │   │   └── [id]/route.js     # PUT / DELETE book
│   │   ├── members/
│   │   │   └── route.js          # GET / POST members
│   │   ├── borrow/
│   │   │   └── route.js          # GET / POST / PATCH borrow records
│   │   └── system-info/
│   │       └── route.js          # Architecture verification JSON
│   ├── globals.css               # Tailwind CSS directives
│   ├── layout.jsx                # Root HTML layout
│   └── page.jsx                  # Server Component (SSR data fetching)
├── components/
│   ├── Navbar.jsx                # Navigation bar & status badge
│   ├── StatsCards.jsx            # Summary metric counters
│   ├── LibraryDashboard.jsx      # Main CSR client component & state
│   ├── BookModal.jsx             # Add / Edit book modal
│   ├── MemberModal.jsx           # Add member modal
│   ├── BorrowModal.jsx           # Issue borrow modal
│   └── ArchitectureInspector.jsx # Step 1 requirements live inspector
├── lib/
│   └── prisma.js                 # Prisma ORM client singleton & resilient layer
├── prisma/
│   └── schema.prisma             # MiddleWare schema (books, members, borrow_records)
├── .env                          # Connection String (DATABASE_URL)
├── package.json
└── tailwind.config.js
```

---

## 🚀 วิธีการเปิดใช้งาน (Quick Start)
ดับเบิ้ลคลิกไฟล์ `start.bat` หรือเปิด Terminal:
```powershell
cd D:\KluiBot\library-management-system
npm run dev
```
เปิดบราวเซอร์ที่: [http://localhost:3000](http://localhost:3000)

---

## 📖 เอกสารอธิบายการทำงาน
ดูรายละเอียดการเทียบโค้ดทุกส่วนกับแผนโครงงาน ขั้นที่ 1 ได้ที่:
- [`DOCUMENTATION_STEP1.md`](./DOCUMENTATION_STEP1.md)
- [`D:\แผนโครงงาน_ขั้นที่1_อธิบายการทำงานและโค้ด.md`](file:///D:/%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99_%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%881_%E0%B8%AD%E0%B8%98%E0%B8%B4%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B3%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B9%89%E0%B8%94.md)
