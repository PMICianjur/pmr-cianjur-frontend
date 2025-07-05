// pages/index.js

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Impor komponen
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionWrapper from '../components/home/SectionWrapper';
import HighlightCard from '../components/home/HighlightCard';

// Impor ikon
import { FaAward, FaHeartbeat, FaUsers, FaShieldAlt, FaCampground, FaBookOpen, FaCheckCircle } from 'react-icons/fa';

// Data untuk highlight kegiatan
const activities = [
  { title: "Pertolongan Pertama", icon: <FaHeartbeat size={30} />, description: "Kuasai teknik dasar penyelamatan jiwa dalam situasi darurat." },
  { title: "Kepemimpinan & Tim", icon: <FaUsers size={30} />, description: "Asah kemampuan memimpin dan bekerja sama dalam tim yang solid." },
  { title: "Manajemen Posko", icon: <FaCampground size={30} />, description: "Pelajari cara mendirikan dan mengelola posko bantuan secara efektif." },
  { title: "Ayo Siaga Bencana", icon: <FaShieldAlt size={30} />, description: "Tingkatkan kesiapsiagaan melalui simulasi dan materi kebencanaan." },
  { title: "Sejarah Kepalangmerahan", icon: <FaBookOpen size={30} />, description: "Pahami 7 Prinsip Dasar Gerakan Palang Merah dan Bulan Sabit Merah." },
  { title: "Pelantikan & Penghargaan", icon: <FaAward size={30} />, description: "Momen puncak pengukuhan sebagai relawan PMR yang kompeten." }
];

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>PMR Cianjur 2025 - Pelatihan & Pelantikan</title>
        <meta name="description" content="Website Resmi Pelatihan dan Pelantikan PMR Se-Kabupaten Cianjur Tahun 2025. Bangun Generasi Relawan Tangguh." />
      </Head>

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-white min-h-[80vh] flex items-center">
          <div className="absolute inset-0 bg-black">
            <Image src="/images/bg.jpg" alt="Kegiatan PMR" layout="fill" objectFit="cover" className="opacity-40" priority />
          </div>
          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-xl">
                GENERASI RELAWAN TANGGUH
              </motion.h1>
              <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-200 drop-shadow-sm">
                Ikuti Pelatihan & Pelantikan Palang Merah Remaja (PMR) Se-Kabupaten Cianjur 2025. Asah keterampilan, bangun karakter, dan jadilah pahlawan kemanusiaan.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link href="/pendaftaran" className="mt-10 inline-block bg-red-600 text-white font-bold py-4 px-12 rounded-full text-lg shadow-lg hover:bg-red-700 transform hover:scale-105 transition-transform duration-300">
                  Daftar Sekarang
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Tentang Section */}
        <SectionWrapper className="py-20 lg:py-24">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h2 className="text-base font-semibold text-red-600 tracking-wider uppercase">Tentang Acara</h2>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">Mencetak Relawan Masa Depan</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ini bukan sekadar acara tahunan. Ini adalah kawah candradimuka bagi calon relawan PMR tingkat Madya dan Wira di Cianjur. Kami mengundang Anda untuk bergabung dalam 3 hari pelatihan intensif yang akan mengubah cara Anda memandang dunia.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3" /> Pelatihan praktis dari instruktur berpengalaman.</li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3" /> Simulasi nyata untuk kesiapsiagaan bencana.</li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3" /> Sertifikat resmi dari PMI Kabupaten Cianjur.</li>
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <Image src="/images/about-image.jpeg" alt="Peserta PMR" width={600} height={400} objectFit="cover" />
            </div>
          </div>
        </SectionWrapper>

        {/* Highlight Kegiatan */}
        <SectionWrapper className="py-20 lg:py-24 bg-red-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-base font-semibold text-red-600 tracking-wider uppercase">Fokus Pelatihan</h2>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Keterampilan yang Akan Kamu Kuasai</h3>
            </div>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((item, idx) => (
                <HighlightCard key={idx} icon={item.icon} title={item.title} description={item.description} />
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* CTA Kedua (Glassmorphism) */}
        <SectionWrapper className="py-20 lg:py-24 bg-cover bg-center" style={{ backgroundImage: "url('/images/cta-bg.jpg')"}}>
          <div className="container mx-auto px-6 text-center">
            <div className="bg-white/20 backdrop-blur-xl p-8 md:p-12 rounded-2xl max-w-3xl mx-auto border border-white/30 shadow-lg">
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-4 drop-shadow-lg">
                Siap Menjadi Relawan Tangguh Berikutnya?
              </h3>
              <p className="mb-8 text-gray-800 text-lg drop-shadow-md">
                Waktu terbatas, tempat terbatas. Daftarkan sekolahmu sekarang dan jadilah bagian dari gerakan kemanusiaan terbesar di Cianjur.
              </p>
              <Link href="/pendaftaran" className="inline-block bg-white text-red-700 font-bold py-3 px-10 rounded-full text-lg shadow-xl hover:bg-gray-200 transform hover:scale-105 transition-transform duration-300">
                Ambil Langkah Pertamamu
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  )
}