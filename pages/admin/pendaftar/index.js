// pages/admin/pendaftar/index.js

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Impor motion untuk animasi

import AdminLayout from '../../../components/admin/AdminLayout';
import { FiSearch, FiFilter } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Komponen untuk badge status pembayaran
const StatusBadge = ({ status }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-bold rounded-full";
    switch (status) {
        case 'success':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>Sukses</span>;
        case 'pending':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
        case 'failure':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>Gagal</span>;
        default:
            return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
};

// Komponen untuk baris skeleton saat data sedang dimuat
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
    </tr>
);

export default function PendaftarListPage() {
    const [pendaftar, setPendaftar] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State untuk filter dan search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            const token = localStorage.getItem('admin_token');
            if (!token) {
                setError('Otentikasi gagal. Silakan login kembali.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/admin/pendaftar`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendaftar(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Memoized filtered data untuk performa
    const filteredPendaftar = useMemo(() => {
        return pendaftar.filter(p => {
            const matchesSearch = p.nama_sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.nama_pembina.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter ? p.status_pembayaran === statusFilter : true;
            return matchesSearch && matchesStatus;
        });
    }, [pendaftar, searchTerm, statusFilter]);

    // Konfigurasi animasi untuk Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05, // Efek muncul satu per satu
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <AdminLayout>
            <Head><title>Data Pendaftar</title></Head>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                <h1 className="text-3xl font-bold text-gray-800">Data Pendaftar</h1>

                {/* Filter dan Search Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama sekolah atau pembina..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-auto p-2 pl-10 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-400 appearance-none"
                        >
                            <option value="">Semua Status</option>
                            <option value="success">Sukses</option>
                            <option value="pending">Pending</option>
                            <option value="failure">Gagal</option>
                        </select>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nama Sekolah</th>
                                <th scope="col" className="px-6 py-3">Pembina</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Total Biaya</th>
                                <th scope="col" className="px-6 py-3">Tgl Daftar</th>
                                <th scope="col" className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {isLoading ? (
                                <>
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </>
                            ) : error ? (
                                <tr><td colSpan="6" className="text-center py-6 text-red-600 bg-red-50">{error}</td></tr>
                            ) : filteredPendaftar.length > 0 ? (
                                filteredPendaftar.map(p => (
                                    <motion.tr 
                                        key={p.id} 
                                        variants={itemVariants}
                                        className="bg-white border-b hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">{p.nama_sekolah}</td>
                                        <td className="px-6 py-4">{p.nama_pembina}</td>
                                        <td className="px-6 py-4"><StatusBadge status={p.status_pembayaran} /></td>
                                        <td className="px-6 py-4">Rp{new Intl.NumberFormat('id-ID').format(p.total_biaya)}</td>
                                        <td className="px-6 py-4">{p.waktu_pendaftaran ? format(new Date(p.waktu_pendaftaran), 'dd MMM yyyy, HH:mm', { locale: id }) : 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/pendaftar/${p.id}`} className="font-medium text-red-600 hover:underline">
                                                Detail
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center py-6 text-gray-500">Tidak ada data ditemukan.</td></tr>
                            )}
                        </motion.tbody>
                    </table>
                </div>
            </motion.div>
        </AdminLayout>
    );
}