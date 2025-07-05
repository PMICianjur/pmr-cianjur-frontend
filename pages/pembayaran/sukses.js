import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import  Header  from '../../components/Header';
import  Footer  from '../components/Footer';

import KwitansiPDF from '../../components/pendaftaran/KwitansiPDF';
import { FiCheckCircle, FiDownload, FiLoader } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SuksesPage() {
  const router = useRouter();
  const { order_id } = router.query;

  const [pendaftaranData, setPendaftaranData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady || !order_id) {
      if (router.isReady && !order_id) {
        setError('ID Pesanan tidak ditemukan di URL.');
        setIsLoading(false);
      }
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/pendaftaran/by-order`, {
          params: { order_id }
        });
        setPendaftaranData(response.data);
      } catch (err) {
        console.error('Gagal mengambil data pendaftaran:', err);
        setError(
          err.response?.data?.message || 'Gagal mengambil data. Silakan hubungi panitia.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, order_id]);

  const handleDownloadPDF = async () => {
    const input = document.getElementById('kwitansi-pdf');
    if (!input) {
      alert('Elemen kwitansi tidak ditemukan.');
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const ratio = canvas.width / canvas.height;
      const finalHeight = pdfWidth / ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);

      const namaSekolah = pendaftaranData?.nama_sekolah || 'PMR_Cianjur';
      const filename = `Kwitansi_PMR_${namaSekolah.replace(/[\s/]/g, '_')}.pdf`;

      pdf.save(filename);
    } catch (error) {
      console.error('Gagal membuat PDF:', error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Pembayaran Berhasil - PMR Cianjur 2025</title>
      </Head>
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-6 sm:p-10 rounded-lg shadow-xl max-w-xl w-full text-center">
          {isLoading ? (
            <div className="space-y-4">
              <FiLoader className="text-gray-400 text-6xl mx-auto animate-spin" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-700">Memverifikasi Pembayaran...</h1>
              <p className="text-gray-500">Mohon tunggu sebentar.</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h1>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <FiCheckCircle className="text-green-500 text-7xl mx-auto" />
              <h1 className="text-3xl font-bold text-gray-800">Pembayaran Berhasil!</h1>
              <p className="text-gray-600">
                Terima kasih! Pendaftaran Anda untuk <strong>{pendaftaranData.nama_sekolah}</strong> telah dikonfirmasi.
              </p>
              <p className="text-sm text-gray-500">ID Pesanan: <strong>{order_id}</strong></p>

              <div className="pt-4 space-y-4">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isDownloading ? <FiLoader className="animate-spin" /> : <FiDownload />}
                  {isDownloading ? 'Mempersiapkan PDF...' : 'Unduh Bukti Pembayaran'}
                </button>

                <Link href="/" className="inline-block text-sm text-gray-600 hover:text-red-700 transition">
                  Kembali ke Halaman Utama
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {pendaftaranData && (
        <div className="absolute top-0 -left-full" style={{ zIndex: -100 }}>
          <KwitansiPDF
            pendaftaran={pendaftaranData}
            biaya={{
              peserta: pendaftaranData.jumlah_peserta * 35000,
              pendamping: pendaftaranData.jumlah_pendamping * 25000,
              tenda:
                pendaftaranData.opsi_tenda === 'sewa'
                  ? pendaftaranData.total_biaya -
                    pendaftaranData.jumlah_peserta * 35000 -
                    pendaftaranData.jumlah_pendamping * 25000
                  : 0
            }}
            excelCounts={{
              peserta: pendaftaranData.jumlah_peserta,
              pendamping: pendaftaranData.jumlah_pendamping
            }}
          />
        </div>
      )}
    </div>
  );
}
