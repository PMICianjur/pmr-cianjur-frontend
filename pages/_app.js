import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Script untuk Midtrans Snap.js */}
      {/* 
        Tambahkan Toaster di sini. 
        Ini adalah komponen yang akan menampilkan notifikasi.
      */}
      <Toaster 
        position="top-right" // Posisi notifikasi
        toastOptions={{
          // Opsi default untuk semua toast
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;