# เอกสารอธิบายระบบและการจับคู่โค้ดกับแผนโครงงาน ขั้นที่ 1
## โครงงาน: ระบบจัดการห้องสมุด (Library Management System)

> **ตำแหน่งโปรเจกต์เว็บแอปพลิเคชัน**: `D:\KluiBot\library-management-system`  
> **เอกสารต้นฉบับ**: `D:\แผนโครงงาน_ขั้นที่1.md`  
> **เทคโนโลยีหลัก**: Next.js (App Router, Full-stack) + Tailwind CSS + Prisma ORM (MiddleWare) + MySQL (`library_db`)

---

## สรุปภาพรวมสถาปัตยกรรม (Architecture Overview)

ระบบจัดการห้องสมุดถูกพัฒนาขึ้นตรงตามข้อกำหนดใน **แผนโครงงาน ขั้นที่ 1** ครบถ้วน 100% โดยแบ่งการทำงานออกเป็น 3 หมวดหลัก พร้อมทั้งมีการเชื่อมต่อจริงและมีโค้ดรองรับในทุกส่วน:

```mermaid
graph TD
    User([ผู้ใช้งาน / Web Browser]) <-->|HTTP Request / Response| NextClient["Front-end (Client-Side Rendering - CSR)\nReact JSX + Tailwind CSS\ncomponents/LibraryDashboard.jsx"]
    
    subgraph FullStackApp ["Next.js Full-Stack Web Application (Node.js Runtime)"]
        NextServer["Server-Side Rendering (SSR)\napp/page.jsx"]
        NextAPI["Back-end API Route Handlers\napp/api/books, members, borrow"]
    end

    NextClient <-->|Fetch JSON Data| NextAPI
    NextServer -->|Server Props| NextClient

    subgraph MiddlewareLayer ["MiddleWare Interface Layer"]
        PrismaORM["Prisma ORM Client\nlib/prisma.js & prisma/schema.prisma"]
    end

    NextServer <-->|Prisma Query| PrismaORM
    NextAPI <-->|Prisma Query| PrismaORM

    subgraph DataRepository ["Data Repository (RDBMS)"]
        MySQL[("MySQL Server (XAMPP)\nDatabase: library_db\nTables: books, members, borrow_records")]
    end

    PrismaORM <-->|Connection Pool / SQL| MySQL
```

---

## การเปรียบเทียบและการจับคู่โค้ด (Requirement Mapping) รายข้อ

---

### 1. หมวดแหล่งข้อมูล (Data Repository)

| ข้อคำถามในแผนโครงงาน ขั้นที่ 1 | คำตอบตามแผน | ส่วนของโค้ดและไฟล์ที่ตรงกันในระบบ | คำอธิบายการทำงานจริงในโค้ด |
| :--- | :--- | :--- | :--- |
| **ฐานข้อมูลชื่ออะไร มีโครงสร้างอย่างไร** | ชื่อฐานข้อมูล `library_db` มีตารางหลัก เช่น:<br>1. `books`<br>2. `members`<br>3. `borrow_records` | [`prisma/schema.prisma`](./prisma/schema.prisma) | มีการนิยาม Model ใน Prisma Schema ตรงตามชื่อตารางและฟิลด์เป๊ะๆ:<br>• `model Book`: `id`, `title`, `author`, `isbn`, `category`, `quantity`, `createdAt`, `updatedAt` (ตาราง `books`)<br>• `model Member`: `id`, `name`, `email`, `phone`, `createdAt` (ตาราง `members`)<br>• `model BorrowRecord`: `id`, `bookId`, `memberId`, `borrowDate`, `returnDate`, `status` (ตาราง `borrow_records`) |
| **ระบบฐานข้อมูลที่ใช้คือ** | MySQL (เชิงสัมพันธ์ / RDBMS) | [`prisma/schema.prisma`](./prisma/schema.prisma)<br>[`.env`](./.env) | ระบุ `datasource db { provider = "mysql" }` เป็นฐานข้อมูลเชิงสัมพันธ์ มีความสัมพันธ์แบบ Foreign Key ระหว่าง `borrow_records` เชื่อมกับ `books(id)` และ `members(id)` |
| **ซอฟต์แวร์ระบบฐานข้อมูล คือ** | XAMPP / MySQL Server (หรือใช้ผ่าน cloud เช่น PlanetScale, Railway) | `C:\xampp\mysql\bin\mysqld.exe`<br>[`.env`](./.env) | ใช้งานร่วมกับ MySQL Server (XAMPP) บน Port 3306 พร้อมทั้งมีระบบ Smart Resilient Fallback ใน [`lib/prisma.js`](./lib/prisma.js) ที่รันข้อมูลตัวอย่างให้ใช้งานได้ทันทีแม้ยังไม่ได้เปิด service MySQL |
| **MiddleWare (ตัวกลาง) ที่เป็น interface ระหว่าง Web Application กับฐานข้อมูล คือ** | Prisma ORM (ทำหน้าที่แปลงคำสั่ง JavaScript เป็น SQL query และจัดการ connection pool) | [`lib/prisma.js`](./lib/prisma.js)<br>[`prisma/schema.prisma`](./prisma/schema.prisma) | ไฟล์ `lib/prisma.js` ทำหน้าที่สร้างอินสแตนซ์ `PrismaClient` เป็นตัวกลาง (Middleware) ควบคุม Connection Pool และแปลงคำสั่งระดับ Object Oriented ใน JavaScript/TypeScript ให้กลายเป็น SQL Query ส่งไปยัง MySQL |
| **Connection String ที่ MiddleWare แจ้งให้แก่ Web Application คือ** | `mysql://user:password@localhost:3306/library_db` | [`.env`](./.env)<br>[`.env.example`](./.env.example) | มีการประกาศ `DATABASE_URL="mysql://root:@localhost:3306/library_db"` ในไฟล์ `.env` เพื่อให้ Prisma อ่านค่านี้ไปเชื่อมต่อฐานข้อมูลโดยอัตโนมัติ |

---

### 2. หมวด Framework การพัฒนา Web Application

| ข้อคำถามในแผนโครงงาน ขั้นที่ 1 | คำตอบตามแผน | ส่วนของโค้ดและไฟล์ที่ตรงกันในระบบ | คำอธิบายการทำงานจริงในโค้ด |
| :--- | :--- | :--- | :--- |
| **Framework ที่ใช้ ชื่อ** | Next.js | [`package.json`](./package.json)<br>[`next.config.js`](./next.config.js) | ติดตั้ง `next` เวอร์ชัน 14+ (App Router architecture) |
| **Framework ที่ใช้ มีความสามารถเป็น Back-end หรือ Front-end หรืออะไร** | ทั้งสองอย่าง (Full-stack framework) — มี App Router ที่รองรับทั้งฝั่ง React (Front-end) และ API Routes / Server Actions (Back-end) | • Front-end: [`components/LibraryDashboard.jsx`](./components/LibraryDashboard.jsx)<br>• Back-end: โฟลเดอร์ [`app/api/`](./app/api) | Next.js จัดการทั้งส่วนหน้าบ้าน (React JSX, State, Event Handlers) และส่วนหลังบ้าน (Next.js Route Handlers รับคำขอ HTTP GET, POST, PUT, DELETE, PATCH) ภายในโปรเจกต์เดียวกันอย่างสมบูรณ์ |
| **Framework ที่ใช้ เกี่ยวข้องอะไรกับ Node.js** | Next.js ทำงานอยู่บน Node.js runtime ฝั่ง server ใช้ Node.js รัน server-side code, API routes และ build process ทั้งหมด | [`package.json`](./package.json)<br>Node.js Runtime | Next.js รันบน Node.js Runtime (v24/v20) ฝั่ง Server และ API Routes ใช้ Core Module และความสามารถของ Node.js ในการประมวลผลคำสั่งฝั่ง Server |
| **Framework ที่ใช้ เชื่อมต่อกับฐานข้อมูลได้อย่างไร** | ผ่าน Prisma Client ที่เรียกใช้ใน API Route หรือ Server Component แล้ว Prisma จะไปคุยกับ MySQL ให้ | [`app/api/books/route.js`](./app/api/books/route.js)<br>[`app/api/borrow/route.js`](./app/api/borrow/route.js)<br>[`app/page.jsx`](./app/page.jsx) | มีการ `import { prisma } from '@/lib/prisma'` แล้วเรียกคำสั่ง `await prisma.book.findMany()`, `prisma.borrowRecord.create()`, ฯลฯ Prisma Client จะติดต่อสื่อสารกับ MySQL แทนการเขียน raw socket |
| **หลักฐานที่ Web App นี้ เชื่อมต่อตรงไปที่ฐานข้อมูล หรือ MiddleWare คือ** | เชื่อมผ่าน MiddleWare (Prisma) ไม่เชื่อมตรง เพื่อความปลอดภัยและจัดการ query ได้ง่าย | [`lib/prisma.js`](./lib/prisma.js)<br>[`prisma/schema.prisma`](./prisma/schema.prisma) | ในโค้ดไม่มีการนำคลังไดรเวอร์ raw MySQL (เช่น `mysql2.createConnection()`) มาเขียน query ตรงๆ ในคอมโพเนนต์ แต่เชื่อมต่อผ่าน `PrismaClient` ซึ่งเป็น Middleware ป้องกัน SQL Injection และจัดการ Pool ได้อย่างปลอดภัย |
| **Framework ที่ใช้ เลือกใช้ CSS framework ใด** | Tailwind CSS | [`tailwind.config.js`](./tailwind.config.js)<br>[`app/globals.css`](./app/globals.css) | มีการตั้งค่า Tailwind CSS เต็มรูปแบบ และตกแต่ง UI ด้วย Utility classes (เช่น `bg-blue-600`, `rounded-2xl`, `shadow-md`, `flex`, `grid`) สวยงาม ทันสมัย รองรับ Responsive ทั้งจอมือถือและเดสก์ท็อป |

---

### 3. หมวดสถาปัตยกรรมของ Web Application

| ข้อคำถามในแผนโครงงาน ขั้นที่ 1 | คำตอบตามแผน | ส่วนของโค้ดและไฟล์ที่ตรงกันในระบบ | คำอธิบายการทำงานจริงในโค้ด |
| :--- | :--- | :--- | :--- |
| **Framework ที่ใช้ สนับสนุนให้ web app ใช้สถาปัตยกรรมใดบ้าง (2 อย่าง)** | Server-Side Rendering (SSR) และ Client-Side Rendering (CSR) | • SSR: [`app/page.jsx`](./app/page.jsx)<br>• CSR: [`components/LibraryDashboard.jsx`](./components/LibraryDashboard.jsx) | `app/page.jsx` เป็น Server Component ที่เรนเดอร์ข้อมูลตั้งต้นจาก Server (SSR) แล้วส่งต่อให้ `LibraryDashboard.jsx` ซึ่งประกาศ `'use client'` ทำหน้าที่เป็น Client-Side Component (CSR) ที่มี State และ Interactivity แบบเรียลไทม์ |
| **Back-end ที่สร้างด้วย Next.js ใช้ภาษาใด** | JavaScript / TypeScript (รันบน Node.js) | ไฟล์ใน [`app/api/`](./app/api) ทั้งหมด | เขียนด้วย JavaScript (ES6+ / Node.js) |
| **Front-end ที่สร้างด้วย Next.js ใช้ภาษาใด** | JavaScript / TypeScript ร่วมกับ JSX (React) | ไฟล์ใน [`components/`](./components) ทั้งหมด | เขียนด้วย React JSX (JavaScript XML) ร่วมกับ React Hooks (`useState`, `useEffect`) |
| **Back-end ทำหน้าที่อะไร** | รับ request, ประมวลผล logic, ดึง/บันทึกข้อมูลผ่าน Prisma ไปยัง MySQL แล้วส่งข้อมูลกลับเป็น JSON | โฟลเดอร์ [`app/api/`](./app/api)<br>• [`books/route.js`](./app/api/books/route.js)<br>• [`borrow/route.js`](./app/api/borrow/route.js) | ตัวอย่างเช่น ใน `app/api/borrow/route.js`: เมื่อมี request ขอการยืมเข้ามา Back-end จะเช็คว่าหนังสือมี `quantity > 0` หรือไม่ ถ้ามีจะสร้าง Record ใน `borrow_records` และลดจำนวนเล่มใน `books` ลง 1 เล่ม แล้วตอบกลับด้วย `NextResponse.json(...)` |
| **Front-end ทำหน้าที่อะไร** | แสดงผล UI, รับ input จากผู้ใช้ และเรียก API เพื่อขอ/ส่งข้อมูล | [`components/LibraryDashboard.jsx`](./components/LibraryDashboard.jsx)<br>[`components/BookModal.jsx`](./components/BookModal.jsx) | แสดงหน้าต่าง Modal, จัดการช่องกรอกแบบฟอร์ม, รับการกดปุ่ม ยืม/คืน/เพิ่ม/ลบ แล้วสั่ง `fetch('/api/...')` ไปยังหลังบ้าน พร้อมแสดงผล Toast แจ้งเตือน |
| **ข้อมูลจาก back-end นำไปใช้ใน front-end ได้อย่างไร** | Back-end ส่งข้อมูลรูปแบบ JSON ผ่าน API → Front-end ใช้ `fetch` หรือ Server Component ดึงมาแสดงผลใน component | ฟังก์ชัน `refreshAllData` ใน [`components/LibraryDashboard.jsx`](./components/LibraryDashboard.jsx) | ฝั่ง Front-end เรียก `await fetch('/api/books')`, อ่านค่า `await res.json()` แล้วนำอาร์เรย์ `data` ไปใส่ใน React State `setBooks(booksRes.data)` เพื่อเรนเดอร์ลงตาราง HTML โดยอัตโนมัติ |
| **Client-side เป็นอย่างไร** | โค้ดที่รันในเบราว์เซอร์ของผู้ใช้ เช่น การโต้ตอบ (interactivity), การจัดการ state, การอัปเดตหน้าจอแบบไม่ต้อง reload | โค้ดที่มีคำสั่ง `'use client'` เช่น Modal, Search Filter, Tab Switching ใน [`components/`](./components) | รันบน Web Browser ผู้ใช้ตอบสนองทันทีเมื่อกดค้นหาหรือเปลี่ยนแท็บ มีการเปิดปิด Modal อย่างราบรื่นโดยไม่ต้อง Refresh หน้าจอทั้งหน้า (SPA Experience) |
| **Server-side เป็นอย่างไร** | โค้ดที่รันบนเซิร์ฟเวอร์ เช่น การเชื่อมต่อฐานข้อมูล, การตรวจสอบสิทธิ์ (authentication), การประมวลผล business logic ก่อนส่งผลลัพธ์ไปให้ client | [`app/page.jsx`](./app/page.jsx) และไฟล์ใน [`app/api/`](./app/api) | รันอย่างปลอดภัยบน Server ไม่เปิดเผย Database Connection String หรือ Password ให้เบราว์เซอร์เห็น ทำการประมวลผลและตรวจสอบความถูกต้องก่อนบันทึกลง MySQL |

---

## ขั้นตอนการทดสอบและเปิดใช้งาน (How to Run)

### 1. การเปิดรันระบบ
เปิด Terminal หรือ PowerShell ที่ไดเรกทอรีโครงการ:
```powershell
cd D:\KluiBot\library-management-system
npm run dev
```
ระบบจะเปิดให้บริการที่ URL: `http://localhost:3000`
