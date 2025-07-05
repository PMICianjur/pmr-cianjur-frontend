// components/admin/AdminLayout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiLogOut } from 'react-icons/fi';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const adminInfo = localStorage.getItem('admin_info');

        if (!token || !adminInfo) {
            router.replace('/admin/login'); // Jika tidak ada token, paksa ke login
        } else {
            setAdmin(JSON.parse(adminInfo));
        }
    }, [router]);
    
    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_info');
        router.push('/admin/login');
    };

    if (!admin) {
        // Tampilkan loading atau null selagi memeriksa token
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Sederhana */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 text-2xl font-bold text-red-700 border-b">
                    PMI CIANJUR 
                </div>
               <nav className="mt-6">
                <a className="block px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700"><Link href="/admin/dashboard/">Dashboard</Link></a>
                <a className="block px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700"><Link href="/admin/pendaftar/">Pendaftar</Link></a>
                {/* --- LINK BARU --- */}
                <a href="/admin/peserta" className="block px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700"><Link href="/admin/peserta/">Peserta</Link></a>
            </nav>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1">
                <header className="flex items-center justify-between p-4 bg-white border-b">
                    <div>
                        <h1 className="text-xl text-slate-800 font-semibold">Selamat Datang, {admin.nama_lengkap}!</h1>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                        <FiLogOut />
                        Logout
                    </button>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}