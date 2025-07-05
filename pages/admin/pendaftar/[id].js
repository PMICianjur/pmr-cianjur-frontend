// pages/admin/pendaftar/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FiArrowLeft, FiHome, FiUser, FiPhone, FiTag, FiUsers, FiMapPin, FiCalendar, FiDollarSign, FiUserCheck } from 'react-icons/fi';
import { FaCampground } from 'react-icons/fa'; // ini simbol tenda

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
const formatDate = (dateString, formatStr = 'dd MMMM yyyy, HH:mm') => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Tanggal Tidak Valid';
        return format(date, formatStr, { locale: id });
    } catch (e) { return 'N/A'; }
};

const InfoItem = ({ icon, label, value }) => ( <div className="flex items-start py-3 border-b border-gray-100 last:border-b-0"> <div className="text-red-500 mr-4 mt-1">{icon}</div> <div> <p className="text-sm text-gray-500">{label}</p> <p className="font-semibold text-gray-800">{value}</p> </div> </div> );
const StatusBadge = ({ status }) => { const baseClasses = "text-xs font-bold px-2.5 py-1 rounded-full"; switch (status) { case 'success': return <span className={`${baseClasses} bg-green-100 text-green-800`}>Sukses</span>; case 'pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>; case 'failure': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Gagal</span>; default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>; } };

export default function DetailPendaftarPage() {
    const router = useRouter();
    const { id: pendaftaranId } = router.query;
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log(`useEffect triggered. router.isReady: ${router.isReady}, pendaftaranId: ${pendaftaranId}`);
        if (!router.isReady) {
            console.log("Router belum siap, menunggu...");
            return;
        }
        if (!pendaftaranId) {
            console.log("Router sudah siap, tetapi pendaftaranId tidak ada. Menghentikan fetch.");
            setError('ID Pendaftaran tidak ditemukan di URL.');
            setIsLoading(false);
            return;
        }
        console.log(`Memulai fetch untuk pendaftaranId: ${pendaftaranId}`);
        const fetchData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('admin_token');
            if (!token) {
                setError('Otentikasi gagal.');
                setIsLoading(false); return;
            }
            try {
                const response = await axios.get(`${API_URL}/api/admin/pendaftar/${pendaftaranId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat data detail.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [router.isReady, pendaftaranId]);

    if (isLoading) return <AdminLayout><div className="text-center p-10">Memuat detail pendaftar...</div></AdminLayout>;
    if (error) return <AdminLayout><div className="text-center p-10 text-red-600">{error}</div></AdminLayout>;
    if (!data) return <AdminLayout><div className="text-center p-10">Data tidak ditemukan.</div></AdminLayout>;

    const { pendaftaran, peserta, pendamping } = data;

    return (
        <AdminLayout>
            <Head><title>Detail Pendaftar: {pendaftaran.nama_sekolah}</title></Head>
            <div className="space-y-8">
                <div>
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"> <FiArrowLeft /> Kembali ke Daftar </button>
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-gray-800">Detail Pendaftaran: {pendaftaran.nama_sekolah}</h1>
                        <StatusBadge status={pendaftaran.status_pembayaran} />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-2"> <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-3">Informasi Utama</h2> <InfoItem icon={<FiHome size={20}/>} label="Nama Sekolah" value={pendaftaran.nama_sekolah} /> <InfoItem icon={<FiUser size={20}/>} label="Nama Pembina" value={pendaftaran.nama_pembina} /> <InfoItem icon={<FiPhone size={20}/>} label="No. WhatsApp" value={pendaftaran.no_whatsapp} /> <InfoItem icon={<FiCalendar size={20}/>} label="Waktu Pendaftaran" value={formatDate(pendaftaran.waktu_pendaftaran)} /> <InfoItem icon={<FiDollarSign size={20}/>} label="Total Biaya" value={formatRupiah(pendaftaran.total_biaya)} /> </div>
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-2"> <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-3">Informasi Lomba</h2> <InfoItem icon={<FiTag size={20}/>} label="Kategori" value={pendaftaran.kategori === 'wira' ? 'PMR Wira' : 'PMR Madya'} /> <InfoItem icon={<FiUsers size={20}/>} label="Jumlah Peserta" value={`${pendaftaran.jumlah_peserta} orang`} /> <InfoItem icon={<FiUserCheck size={20}/>} label="Jumlah Pendamping" value={`${pendaftaran.jumlah_pendamping} orang`} /> <InfoItem icon={<FaCampground size={20}/>} label="Opsi Tenda" value={`${pendaftaran.opsi_tenda === 'sewa' ? 'Sewa Tenda' : 'Bawa Sendiri'} (Kap. ${pendaftaran.kapasitas_tenda})`} /> <InfoItem icon={<FiMapPin size={20}/>} label="Nomor Kavling" value={pendaftaran.nomor_kavling} /> </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Peserta ({peserta.length})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {peserta.map(p => (
                            <div key={p.id} className="text-center">
                                <Image
                                        src={`${BASE_URL}/${p.path_foto}`}
                                        alt={`Foto ${p.nama_lengkap}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-full border-4 border-white shadow-lg"
                                        crossOrigin="anonymous" 
                                    />
                                <p className="mt-2 text-slate-800 font-semibold text-sm">{p.nama_lengkap}</p>
                                <p className="text-xs text-gray-500">{formatDate(p.tanggal_lahir, 'dd MMM yyyy')}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {pendamping.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Daftar Pendamping ({pendamping.length})</h2>
                        <ul className="list-disc text-slate-800 list-inside space-y-1 columns-2 md:columns-3">
                            {pendamping.map(p => ( <li key={p.id}>{p.nama_lengkap}</li> ))}
                        </ul>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}