// pages/admin/peserta/index.js

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { saveAs } from 'file-saver'; // Impor file-saver

import AdminLayout from '../../../components/admin/AdminLayout';
import { FiSearch, FiHome, FiMapPin, FiCalendar, FiDownload, FiLoader } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

// Fungsi helper untuk format tanggal
const formatDate = (dateString, formatStr = 'dd MMMM yyyy') => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Tanggal Tidak Valid';
        return format(date, formatStr, { locale: id });
    } catch (e) {
        return 'N/A';
    }
};

export default function SemuaPesertaPage() {
    const [allPeserta, setAllPeserta] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false); // State baru untuk loading export
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Mengambil data dari API saat halaman dimuat
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('admin_token');
            if (!token) {
                setError('Otentikasi gagal.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/admin/peserta`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllPeserta(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat data peserta.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter data berdasarkan input pencarian
    const filteredPeserta = useMemo(() => {
        if (!searchTerm) return allPeserta;
        return allPeserta.filter(p =>
            p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.nama_sekolah.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allPeserta, searchTerm]);

const handleExport = async () => {
    setIsExporting(true);
    setError('');

    const token = localStorage.getItem('admin_token');
    if (!token) {
        setError('Otentikasi gagal.');
        setIsExporting(false);
        return;
    }

    try {
        console.log("Meminta file Excel dari backend...");
        const response = await axios.get(`${API_URL}/api/admin/export-peserta`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob', // Sangat penting: minta respons sebagai data biner
        });

        // Gunakan file-saver untuk men-trigger download
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Data_Peserta_PMR_2025.xlsx');
        console.log("Download berhasil di-trigger.");

    } catch (err) {
        console.error("Gagal mengunduh file Excel:", err);
        setError("Gagal membuat atau mengunduh file Excel dari server.");
    } finally {
        setIsExporting(false);
    }
};
    return (
        <AdminLayout>
            <Head><title>Data Seluruh Peserta</title></Head>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Data Seluruh Peserta</h1>
                        {!isLoading && <p className="text-gray-600">{filteredPeserta.length} Peserta ditemukan</p>}
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isLoading || isExporting || filteredPeserta.length === 0}
                        className="flex items-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isExporting ? <FiLoader className="animate-spin" /> : <FiDownload />}
                        {isExporting ? 'Mengekspor...' : 'Export ke Excel'}
                    </button>
                </div>

                <div className="relative">
                    <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama peserta atau sekolah..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <FiLoader className="animate-spin text-red-500 mx-auto" size={40}/>
                        <p className="mt-4">Memuat data peserta...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg">
                        <p><strong>Error:</strong> {error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredPeserta.length > 0 ? filteredPeserta.map(p => (
                            <div key={p.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-200">
                                <Image
                                    src={`${BASE_URL}/${p.path_foto}`}
                                    alt={`Foto ${p.nama_lengkap}`}
                                    width={200}
                                    height={200}
                                    className="w-full h-48 object-cover object-top"
                                    unoptimized={true}
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 truncate" title={p.nama_lengkap}>{p.nama_lengkap}</h3>
                                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5 mt-1" title={p.nama_sekolah}>
                                        <FiHome size={12}/> {p.nama_sekolah}
                                    </p>
                                    <div className="text-xs text-gray-600 mt-2 space-y-1">
                                        <p className="flex items-center gap-1.5" title={p.tempat_lahir}>
                                            <FiMapPin size={12}/> {p.tempat_lahir || 'N/A'}
                                        </p>
                                        <p className="flex items-center gap-1.5" title={formatDate(p.tanggal_lahir)}>
                                            <FiCalendar size={12}/> {formatDate(p.tanggal_lahir)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="col-span-full text-center py-10 text-gray-500">Tidak ada data peserta yang cocok dengan pencarian Anda.</p>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}