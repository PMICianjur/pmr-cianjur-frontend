// pages/admin/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/admin/login`, {
                username,
                password,
            });

            const { token, admin } = response.data;
            // Simpan token dan data admin di localStorage
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_info', JSON.stringify(admin));

            // Arahkan ke dashboard
            router.push('/admin/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Head><title>Admin Login</title></Head>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-red-700">Admin Login</h1>
                <p className="text-center text-gray-600">PMR Cianjur 2025</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 mt-1 text-gray-800 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-600 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 mt-1 text-gray-800 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                    </div>
                    {error && <p className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                        >
                            {isLoading ? 'Memproses...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}