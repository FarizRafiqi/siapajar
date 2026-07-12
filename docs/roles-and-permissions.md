# Roles & Permissions - SiapAjar

## Role Definitions

| Role | Code | Description |
|------|------|-------------|
| Administrator | `admin` | Full system access, manages all users and data |
| Guru | `guru` | Teacher - manages own classes, teaching modules, exams |
| Kepala Sekolah | `kepala_sekolah` | Principal - views all teacher data, reports |
| Orang Tua | `orang_tua` | Parent - views child's data only (future feature) |

---

## Permissions Matrix

### Dashboard

| Feature | admin | guru | kepala_sekolah | orang_tua |
|---------|-------|------|----------------|-----------|
| View Dashboard | ✅ | ✅ | ✅ | ❌ |
| View All Stats | ✅ | ❌ (own only) | ✅ (all teachers) | ❌ |
| View System Stats | ✅ | ❌ | ❌ | ❌ |

### Kelas (Classes)

| Feature | admin | guru | kepala_sekolah | orang_tua |
|---------|-------|------|----------------|-----------|
| View All Classes | ✅ | ❌ | ✅ | ❌ |
| View Own Classes | ✅ | ✅ | ✅ | ❌ |
| Create Class | ✅ | ✅ | ❌ | ❌ |
| Edit Class | ✅ | ✅ (own) | ❌ | ❌ |
| Delete Class | ✅ | ✅ (own) | ❌ | ❌ |
| Add Student | ✅ | ✅ (own class) | ❌ | ❌ |
| Remove Student | ✅ | ✅ (own class) | ❌ | ❌ |

### Modul Ajar (Teaching Modules)

| Feature | admin | guru | kepala_sekolah | orang_tua |
|---------|-------|------|----------------|-----------|
| View All Modules | ✅ | ❌ | ✅ | ❌ |
| View Own Modules | ✅ | ✅ | ✅ | ❌ |
| Create Module | ✅ | ✅ | ❌ | ❌ |
| Edit Module | ✅ | ✅ (own) | ❌ | ❌ |
| Delete Module | ✅ | ✅ (own) | ❌ | ❌ |
| Generate with AI | ✅ | ✅ | ❌ | ❌ |
| Publish Module | ✅ | ✅ (own) | ❌ | ❌ |

### Bank Soal (Exams)

| Feature | admin | guru | kepala_sekolah | orang_tua |
|---------|-------|------|----------------|-----------|
| View All Exams | ✅ | ❌ | ✅ | ❌ |
| View Own Exams | ✅ | ✅ | ✅ | ❌ |
| Create Exam | ✅ | ✅ | ❌ | ❌ |
| Edit Exam | ✅ | ✅ (own) | ❌ | ❌ |
| Delete Exam | ✅ | ✅ (own) | ❌ | ❌ |
| Generate with AI | ✅ | ✅ | ❌ | ❌ |
| Export DOCX | ✅ | ✅ (own) | ✅ | ❌ |
| Publish Exam | ✅ | ✅ (own) | ❌ | ❌ |

### Prota (Annual Plans)

| Feature | admin | guru | kepala_sekolah | orang_tua |
|---------|-------|------|----------------|-----------|
| View All Plans | ✅ | ❌ | ✅ | ❌ |
| View Own Plans | ✅ | ✅ | ✅ | ❌ |
| Create Plan | ✅ | ✅ | ❌ | ❌ |
| Edit Plan | ✅ | ✅ (own) | ❌ | ❌ |
| Delete Plan | ✅ | ✅ (own) | ❌ | ❌ |
| Generate with AI | ✅ | ✅ | ❌ | ❌ |
| Export DOCX | ✅ | ✅ (own) | ✅ | ❌ |

### Promes (Semester Plans)

| Feature | admin | guru | kepala_sekolah | orang_tua |
|---------|-------|------|----------------|-----------|
| View All Plans | ✅ | ❌ | ✅ | ❌ |
| View Own Plans | ✅ | ✅ | ✅ | ❌ |
| Create Plan | ✅ | ✅ | ❌ | ❌ |
| Edit Plan | ✅ | ✅ (own) | ❌ | ❌ |
| Delete Plan | ✅ | ✅ (own) | ❌ | ❌ |
| Generate with AI | ✅ | ✅ | ❌ | ❌ |
| Export DOCX | ✅ | ✅ (own) | ✅ | ❌ |

### User Management

| Feature | admin | guru | kepala_sekolah | orang_tua |
|---------|-------|------|----------------|-----------|
| View All Users | ✅ | ❌ | ❌ | ❌ |
| Create User | ✅ | ❌ | ❌ | ❌ |
| Edit User | ✅ | ❌ | ❌ | ❌ |
| Delete User | ✅ | ❌ | ❌ | ❌ |
| Change Role | ✅ | ❌ | ❌ | ❌ |
| Assign Package | ✅ | ❌ | ❌ | ❌ |

### Settings & Profile

| Feature | admin | guru | kepala_sekolah | orang_tua |
|---------|-------|------|----------------|-----------|
| Edit Own Profile | ✅ | ✅ | ✅ | ✅ |
| Change Password | ✅ | ✅ | ✅ | ✅ |
| View Package | ✅ | ✅ | ✅ | ✅ |

---

## Route Protection

### Public Routes (No Auth)
- `GET /` - Landing page
- `GET /login` - Login page
- `POST /login` - Login handler
- `GET /signup` - Signup page
- `POST /signup` - Signup handler

### Auth Required
- `POST /logout` - Logout handler
- `GET /dashboard` - Dashboard
- All `/dashboard/*` routes

### Role-Based Routes (Future)
```
/admin/*          → admin only
/teacher/*        → guru only
/principal/*      → kepala_sekolah only
/parent/*         → orang_tua only
```

---

## Implementation Notes

1. **Own Data Filter**: Guru can only see/modify data where `user_id` matches their ID
2. **Admin Bypass**: Admin can see/modify all data regardless of `user_id`
3. **Kepala Sekolah Read-Only**: Can view all teacher data but cannot modify
4. **Orang Tua**: Future feature - will use `student_id` relationship

---

## Middleware Implementation

```typescript
// Example role middleware usage
router.use([() => import('#middleware/role_middleware')])

// Admin only routes
router.get('/admin/users', '#controllers/users_controller.index')
  .use(middleware.role({ roles: ['admin'] }))

// Guru only routes
router.post('/teaching-modules', '#controllers/teaching_modules_controller.store')
  .use(middleware.role({ roles: ['guru'] }))
```

---

## Database Schema

### Users Table
```sql
users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'guru',  -- admin, guru, kepala_sekolah, orang_tua
  package_id INTEGER REFERENCES packages(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Packages Table
```sql
packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,      -- free, basic, pro, sekolah
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly INTEGER,
  price_yearly INTEGER,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

---

## Package Features

| Feature | Free | Basic | Pro | Sekolah |
|---------|------|-------|-----|---------|
| Max Kelas | 1 | 3 | 10 | Unlimited |
| Max Siswa/Kelas | 15 | 30 | 40 | Unlimited |
| Modul Ajar AI | 5/month | 20/month | Unlimited | Unlimited |
| Soal AI | 5/month | 20/month | Unlimited | Unlimited |
| Export DOCX | ❌ | ✅ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| Price (Rp/month) | 0 | 25,000 | 45,000 | 300,000 |
| Price (Rp/year) | 0 | 250,000 | 450,000 | 3,000,000 |
