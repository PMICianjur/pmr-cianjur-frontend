import Head from 'next/head';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';


export default function Informasi() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Informasi Acara - PMR Cianjur 2025</title>
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-red-700 mb-10">Informasi Lengkap Acara</h1>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Jadwal Acara */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Jadwal Acara</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Hari 1:</strong> Registrasi Ulang, Pendirian Tenda, Upacara Pembukaan, Materi Kepemimpinan.</li>
              <li><strong>Hari 2:</strong> Materi Pertolongan Pertama, Simulasi Bencana Skala Kecil, Pentas Seni.</li>
              <li><strong>Hari 3:</strong> Outbound Kemanusiaan, Upacara Pelantikan, Sayonara.</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Apa saja yang harus dibawa peserta?</h3>
                <p className="text-gray-600">Seragam PMR lengkap, pakaian ganti, alat tulis, perlengkapan mandi, obat-obatan pribadi, dan semangat yang membara!</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Bagaimana sistem pendaftarannya?</h3>
                <p className="text-gray-600">Pendaftaran dilakukan secara online melalui halaman pendaftaran di website ini. Satu sekolah cukup mendaftar satu kali melalui Pembina/Pelatih.</p>
              </div>
            </div>
          </div>
          
           {/* Biaya */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rincian Biaya</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Biaya Peserta:</strong> Rp 35.000 / orang (Termasuk T-Shirt, ID Card, Sertifikat, Konsumsi)</li>
              <li><strong>Biaya Pendamping:</strong> Rp 25.000 / orang (Termasuk ID Card, Konsumsi)</li>
              <li className="mt-4"><strong>Sewa Tenda (Opsional):</strong></li>
              <ul className="list-disc list-inside ml-6">
                 <li>Kapasitas 15 orang: Rp 250.000</li>
                 <li>Kapasitas 20 orang: Rp 450.000</li>
                 <li>Kapasitas 50 orang: Rp 750.000</li>
              </ul>
            </ul>
          </div>

          {/* Kontak Panitia */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Kontak Panitia</h2>
            <p className="text-gray-600">Jika ada pertanyaan lebih lanjut, silakan hubungi:</p>
            <p className="text-gray-600 mt-2"><strong>Kak Budi:</strong> 0812-3456-7890 (WhatsApp)</p>
            <p className="text-gray-600"><strong>Kak Siti:</strong> 0898-7654-3210 (WhatsApp)</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}