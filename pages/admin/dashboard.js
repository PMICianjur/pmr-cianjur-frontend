// pages/admin/dashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { FiUsers, FiUserCheck, FiDollarSign, FiHome } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('admin_token');
            if (!token) {
                setError('Otentikasi gagal.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat statistik.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Format data untuk grafik
    const chartData = stats?.kategori.map(item => ({
        name: item.kategori === 'wira' ? 'Wira' : 'Madya',
        jumlah: item.jumlah
    })) || [];
    
    return (
        <AdminLayout>
            <Head><title>Admin Dashboard</title></Head>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
            <div className="space-y-8">
                {/* Bagian Kartu Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Pendapatan" 
                        value={stats ? formatRupiah(stats.main.total_pendapatan) : '...'}
                        icon={<FiDollarSign />}
                        isLoading={isLoading}
                    />
                    <StatCard 
                        title="Sekolah Terdaftar" 
                        value={stats ? stats.main.total_pendaftar : '...'}
                        icon={<FiHome />}
                        isLoading={isLoading}
                    />
                    <StatCard 
                        title="Total Peserta" 
                        value={stats ? stats.main.total_peserta : '...'}
                        icon={<FiUsers />}
                        isLoading={isLoading}
                    />
                    <StatCard 
                        title="Total Pendamping" 
                        value={stats ? stats.main.total_pendamping : '...'}
                        icon={<FiUserCheck />}
                        isLoading={isLoading}
                    />
                </div>

                {/* Bagian Grafik dan Pendaftar Terbaru */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Grafik Pendaftar per Kategori */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Pendaftar per Kategori</h2>
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center">Memuat grafik...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value} sekolah`} />
                                    <Legend />
                                    <Bar dataKey="jumlah" fill="#EF4444" name="Jumlah Sekolah" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Pendaftar Sukses Terbaru */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Pembayaran Sukses Terbaru</h2>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>)}
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {stats?.recentSuccess.length > 0 ? stats.recentSuccess.map(p => (
                                    <li key={p.id_pendaftaran} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800">{p.nama_sekolah}</p>
                                            <p className="text-xs text-gray-500">{format(new Date(p.waktu_pendaftaran), 'dd MMM yyyy', { locale: id })}</p>
                                        </div>
                                        <p className="font-bold text-green-600">{formatRupiah(p.total_biaya)}</p>
                                    </li>
                                )) : (
                                    <p className="text-sm text-gray-500">Belum ada pembayaran sukses.</p>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
            </motion.div>
        </AdminLayout>
    );
}