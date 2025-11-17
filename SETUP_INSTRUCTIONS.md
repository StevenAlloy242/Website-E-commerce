# Setup Instructions untuk Website E-commerce

## 1. Pastikan XAMPP Running

1. Buka **XAMPP Control Panel**
2. Click **Start** untuk:
   - Apache
   - MySQL
3. Tunggu sampai status menjadi "Running" (hijau)

## 2. Import Database

1. Buka **phpMyAdmin**: http://localhost/phpmyadmin
2. Klik tab **Import**
3. Pilih file: `backend/setup.sql`
4. Klik **Go**
5. Tunggu sampai selesai (Anda akan lihat database `ecommerce` created)

## 3. Verify Database Setup

1. Di phpMyAdmin, expand database `ecommerce`
2. Pastikan ada 2 tables:
   - **users** (seharusnya ada row dengan admin user)
   - **products** (seharusnya ada 2 sample products)
3. Klik table `users` → lihat row admin dengan password yang sudah di-hash

## 4. Setup Backend

1. Buka terminal di folder `backend`
   ```powershell
   cd backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Buat file `.env` (copy dari `.env.example`):
   ```
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=ecommerce
   DB_PORT=3306
   PORT=5000
   JWT_SECRET=my-secret-key-dev
   ```

4. Jalankan backend:
   ```powershell
   npm run dev
   ```

5. Tunggu sampai keluar: `Server running on http://localhost:5000`

## 5. Setup Frontend

1. Buka terminal baru di folder `frontend`
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

2. Buka browser ke URL yang ditampilkan (biasanya http://localhost:5173)

## 6. Test Login

1. Klik **Login** button
2. Enter:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Click **Login**
4. Seharusnya redirect ke `/admin-panel`

## Troubleshooting

### Error: "404 not found" saat login
- Pastikan backend sudah running di port 5000
- Cek di browser console (F12) apakah ada error

### Error: "500 Internal Server Error" saat login
- Pastikan MySQL sudah running
- Pastikan database `ecommerce` sudah di-import
- Check backend terminal untuk error messages
- Pastikan `.env` file ada dengan DB config yang benar

### Error: "Cannot find module 'bcrypt'" atau 'jsonwebtoken'
- Run `npm install` di backend folder lagi
- Pastikan file `backend/package.json` memiliki:
  ```json
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2"
  ```

### Frontend tidak bisa terhubung ke backend
- Pastikan backend running di port 5000
- Cek Network tab di DevTools (F12 → Network) saat login
- Pastikan tidak ada CORS error

## Quick Checklist

- [ ] XAMPP running (Apache + MySQL)
- [ ] Database `ecommerce` imported via phpMyAdmin
- [ ] Backend `.env` file dibuat dengan config yang benar
- [ ] Backend `npm install` sudah selesai
- [ ] Backend running di port 5000
- [ ] Frontend `npm install` sudah selesai
- [ ] Frontend running
- [ ] Bisa login dengan admin/admin123
