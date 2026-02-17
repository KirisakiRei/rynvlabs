# rynvlabs CMS Backend API

Backend API untuk website dan Content Management System rynvlabs. Dibangun dengan NestJS, Prisma ORM, dan MySQL.

## 🚀 Tech Stack

- **Framework**: NestJS v10
- **Database**: MySQL
- **ORM**: Prisma v5.22.0
- **Authentication**: JWT
- **Language**: TypeScript
- **File Upload**: Multer

## 📋 Prerequisites

- Node.js >= 18.x
- MySQL >= 8.0
- npm atau yarn

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan database credentials Anda
```

## ⚙️ Environment Variables

Buat file `.env` di root folder dengan konfigurasi berikut:

```env
DATABASE_URL="mysql://user:password@localhost:3306/rynvlabs"
JWT_SECRET="your-jwt-secret-key-here"
PORT=3000
```

## 🗄️ Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database dengan data awal
npx prisma db seed
```

## 🏃 Running the Application

```bash
# Development mode dengan hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Watch mode
npm run start
```

API akan berjalan di `http://localhost:3000`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Endpoints

### Public Endpoints
- `GET /` - API info
- `GET /health` - Health check
- `GET /api/projects` - List published projects
- `GET /api/projects/:slug` - Project detail
- `GET /api/products` - List published products
- `GET /api/products/:slug` - Product detail
- `GET /api/academy` - List published academy projects
- `GET /api/academy/:slug` - Academy project detail
- `GET /api/landing-sections` - Landing page sections
- `GET /api/site-settings` - Site settings & configuration
- `GET /api/categories` - List categories

### Authentication
- `POST /auth/login` - Admin login (returns JWT token)

### Admin Endpoints (Requires JWT)
All admin endpoints require `Authorization: Bearer <token>` header.

- **Projects**: `/admin/projects/*`
- **Products**: `/admin/products/*`
- **Academy**: `/admin/academy/*`
- **Categories**: `/admin/categories/*`
- **Tech Stacks**: `/admin/tech-stacks/*`
- **Landing Sections**: `/admin/landing-sections/*`
- **Site Settings**: `/admin/site-settings/*`
- **Media Library**: `/admin/media/*`

## 📁 Project Structure

```
src/
├── academy/          # Academy projects module
├── auth/             # Authentication & JWT
├── categories/       # Categories management
├── filters/          # Exception filters
├── landing-sections/ # Landing page sections
├── media/            # Media/file upload
├── prisma/           # Prisma service
├── products/         # Products module
├── projects/         # Projects/portfolio
├── site-settings/    # Site configuration
├── tech-stacks/      # Tech stack master data
├── utils/            # Utilities (slugify, etc)
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

## 🔐 Authentication

Admin endpoints dilindungi dengan JWT authentication. Untuk mengakses:

1. Login via `POST /auth/login` dengan credentials admin
2. Gunakan token yang diterima di header: `Authorization: Bearer <token>`
3. Token valid selama 24 jam

## 📝 Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (DANGER!)
npx prisma migrate reset
```

## 🎨 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🚢 Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

**Environment Variables Production:**
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure proper `DATABASE_URL`
- Enable CORS untuk frontend domain

## 📦 File Upload

Media files disimpan di folder `uploads/`. Pastikan folder ini:
- Writable oleh aplikasi
- Di-backup secara berkala
- Tidak ter-commit ke git (sudah ada di `.gitignore`)

## 🤝 Development Guidelines

- Follow NestJS best practices
- Use Prisma migrations untuk perubahan schema
- Semua admin endpoints harus dilindungi JWT guard
- Gunakan proper DTO validation
- Write tests untuk business logic

## 📞 Contact

Untuk pertanyaan atau support, hubungi tim rynvlabs.

---

**Built with ❤️ by rynvlabs Team**
