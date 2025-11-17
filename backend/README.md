# Menjalankan backend dengan XAMPP (MySQL)

Panduan singkat untuk memindahkan database backend ke XAMPP (MySQL) dan menjalankan server lokal.

Langkah-langkah:

1. Install dan jalankan XAMPP
   - Unduh dari https://www.apachefriends.org
   - Jalankan XAMPP Control Panel, start **Apache** dan **MySQL**.

2. Import SQL ke phpMyAdmin
   - Buka http://localhost/phpmyadmin
   - Pilih tab *Import*, atau buat database baru bernama `ecommerce` lalu pilih database tersebut.
   - Di bagian *File to import*, pilih file `backend/setup.sql` dari repo ini dan klik *Go*.
   - `setup.sql` berisi `CREATE DATABASE IF NOT EXISTS ecommerce; USE ecommerce;` sehingga biasanya cukup import langsung.

3. Konfigurasi environment
   - Salin `backend/.env.example` menjadi `backend/.env` dan sesuaikan jika perlu.
     Contoh isi `.env` untuk XAMPP default:

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce
DB_PORT=3306
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

   - **Penting:** Ubah `JWT_SECRET` ke string random yang kuat untuk production (jangan pakai default).

4. Install dan jalankan backend
   - Buka terminal di folder `backend`.
   - Install dependency:

```powershell
npm install
```

   - Jalankan server (development):

```powershell
npm run dev
```

   - Atau jalankan production:

```powershell
npm start
```

5. Verifikasi
   - Lihat log server; seharusnya muncul `Server running on http://localhost:5000` (atau port sesuai `.env`).
   - Coba buka endpoint produk: `http://localhost:5000/api/products`.

Autentikasi dengan JWT
 - Backend sekarang menggunakan JWT (JSON Web Tokens) untuk autentikasi.
 - Endpoint `/api/auth/login` dan `/api/auth/signup` mengembalikan token yang harus disimpan di frontend.
 - Frontend mengirim token di header `Authorization: Bearer <token>` untuk operasi yang memerlukan autentikasi (CREATE/UPDATE/DELETE produk).
 - Middleware `verifyToken` memverifikasi token sebelum mengeksekusi endpoint.
 - Endpoint GET `/api/products` dan `/api/products/:id` bersifat public (tidak memerlukan token).

Password & Security
 - Password disimpan dengan hash bcrypt (salt rounds: 10), bukan plain-text.
 - Login mencocokkan password input dengan hash yang tersimpan menggunakan bcrypt.compare().
 - Jika login gagal, pesan error generic "Username atau password salah" dikembalikan (mencegah username enumeration).

Default user admin
 - Username: `admin`
 - Password: `admin123`
 - Password admin juga di-hash saat database di-setup. Jika ingin mengubah password admin, update `backend/setup.sql` atau gunakan SQL mutation di phpMyAdmin.

Catatan produksi
 - JWT_SECRET harus diubah ke nilai random yang kuat.
 - Gunakan HTTPS dalam production untuk mengenkripsi token.
 - Token ditetapkan expire dalam 24 jam; pertimbangkan refresh token untuk session yang lebih panjang.
 - Validasi input di backend harus lebih ketat (sanitasi, rate limiting, etc).

