// pages/pembayaran/gagal.js

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// PERBAIKAN FINAL: Hapus kurung kurawal {} karena Header dan Footer menggunakan 'export default'
import  Header  from '../../components/Header';
import  Footer  from '../../components/Footer';


export default function Gagal() {
    const router = useRouter();
    const orderId = router.query.order_id || 'Tidak Ditemukan';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Head><title>Pembayaran Gagal</title></Head>
            <Header />
            <main className="flex-grow flex items-center justify-center text-center p-4">
                <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg w-full">
                     <svg className="w-24 h-24 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h1 className="text-3xl font-bold text-gray-800">Pembayaran Gagal</h1>
                    <p className="text-gray-600 mt-2">Mohon maaf, terjadi masalah saat memproses pembayaran Anda. Silakan coba lagi.</p>
                     <p className="text-sm text-gray-500 mt-6">
                        Nomor Pesanan: <span className="font-mono bg-gray-100 p-1 rounded">{orderId}</span>
                    </p>
                    <Link href="/pendaftaran" className="inline-block mt-8 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition">
                        Coba Daftar Lagi
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}