// components/admin/AdminLayout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiGrid, FiList, FiUsers, FiLogOut } from 'react-icons/fi';
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

     const navItems = [
        { href: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
        { href: '/admin/pendaftar', icon: <FiList />, label: 'Pendaftar' },
        { href: '/admin/peserta', icon: <FiUsers />, label: 'Peserta' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Head>
                <title>Admin Dashboard PMR</title>
            </Head>
            
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
                <div className="h-16 flex items-center justify-center border-b">
                    <h1 className="text-xl font-bold text-red-600">ADMIN PMR</h1>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link href={item.href} key={item.href}>
                            <a className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                router.pathname.startsWith(item.href) 
                                ? 'bg-red-500 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-200'
                            }`}>
                                {item.icon}
                                <span>{item.label}</span>
                            </a>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
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