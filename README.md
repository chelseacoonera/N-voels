# NAVOELA VAN DERECTA — Website Angkatan

Website statis modern-classic dengan palet klasik dengan merah tua sebagai warna dominan dan cream sebagai aksen.

## Isi
- `index.html` — struktur halaman
- `style.css` — desain responsif
- `script.js` — kalender, catatan, agenda, galeri, dan chat demo

## Deploy ke GitHub Pages
1. Buat repository GitHub baru.
2. Upload ketiga file (`index.html`, `style.css`, `script.js`) ke root repository.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
6. Tunggu proses selesai; GitHub akan menampilkan URL website.

## Catatan penting tentang fitur bersama
Versi ini adalah website statis yang bisa langsung di-deploy ke GitHub Pages. Data kalender, catatan, event, foto, dan pesan chat saat ini disimpan di `localStorage` browser masing-masing. Artinya, data tidak otomatis tersinkron ke seluruh anggota atau antarperangkat. Chat bersama real-time, galeri publik, dan data bersama memerlukan backend/database (misalnya Firebase atau Supabase) serta konfigurasi project dan aturan akses. Jangan memasukkan data pribadi atau sensitif ke versi demo ini.

## Kustomisasi
- Link Instagram berada di `index.html` pada tautan `https://www.instagram.com/navoelavanderecta/...`.
- Judul, teks About Us, dan konten halaman bisa diedit langsung di `index.html`.
- Palet merah tua dan cream dapat diubah melalui variabel CSS di bagian `:root` pada `style.css`.
