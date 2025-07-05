import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';


export default function Pending() {
    const router = useRouter();
    const orderId = router.query.order_id || 'Tidak Ditemukan';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Head><title>Pembayaran Tertunda</title></Head>
            <Header />
            <main className="flex-grow flex items-center justify-center text-center">
                 <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg">
                    <svg className="w-24 h-24 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h1 className="text-3xl font-bold text-gray-800">Pembayaran Anda Tertunda</h1>
                    <p className="text-gray-600 mt-2">Anda belum menyelesaikan pembayaran. Pesanan Anda sudah kami simpan.</p>
                     <p className="text-sm text-gray-500 mt-6">
                        Nomor Pesanan: <span className="font-mono bg-gray-100 p-1 rounded">{orderId}</span>
                    </p>
                    <Link href="/pendaftaran" className="inline-block mt-8 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition">
                        Kembali ke Halaman Pendaftaran
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}