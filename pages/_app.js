import '../styles/globals.css'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const midtransSnapUrl = process.env.NODE_ENV === 'production'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

  return (
    <>
      {/* Script untuk Midtrans Snap.js */}
      <Script
        type="text/javascript"
        src={midtransSnapUrl}
        data-client-key={midtransClientKey}
        strategy="beforeInteractive"
      />
      <Component {...pageProps} />
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
    </>
  );
}

export default MyApp;