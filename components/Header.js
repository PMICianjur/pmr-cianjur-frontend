// components/Header.js

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Gunakan komponen Image dari Next.js untuk optimasi
import { FiMenu, FiX } from 'react-icons/fi'; // Impor ikon

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" onClick={closeMenu} className="flex items-center space-x-2">
                    <Image 
                        src="/logo-pmi.png" 
                        alt="Logo PMI"
                        width={200}
                        height={200}
                        className="h-12 w-auto"
                    />
                </Link>

                <nav className="hidden md:flex space-x-6 items-center">
                    <Link href="/informasi" className="text-gray-600 hover:text-red-700 font-medium transition-colors">Informasi</Link>
                    <Link href="/admin/login" className="text-gray-600 hover:text-red-700 font-medium transition-colors">Admin</Link>
                    <Link href="/pendaftaran" className="bg-red-600 text-white font-bold py-2 px-5 rounded-md hover:bg-red-700 transition-transform transform hover:scale-105">
                        Daftar Sekarang
                    </Link>
                </nav>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} aria-label="Buka Menu">
                        {isOpen ? (
                            <FiX className="h-7 w-7 text-gray-800" />
                        ) : (
                            <FiMenu className="h-7 w-7 text-gray-800" />
                        )}
                    </button>
                </div>
            </div>

            <div 
                className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex justify-end p-4">
                    <button onClick={closeMenu} aria-label="Tutup Menu">
                        <FiX className="h-8 w-8 text-gray-800" />
                    </button>
                </div>
                <nav className="flex flex-col items-center justify-center h-full space-y-10 -mt-16">
                    <Link href="/informasi" onClick={closeMenu} className="text-2xl font-semibold text-gray-800 hover:text-red-700">Informasi</Link>
                    <Link href="/admin/login" onClick={closeMenu} className="text-2xl font-semibold text-gray-800 hover:text-red-700">Admin</Link>
                    <Link href="/pendaftaran" onClick={closeMenu} className="bg-red-600 text-white font-bold py-3 px-8 text-xl rounded-lg hover:bg-red-700 transition">
                        Daftar Sekarang
                    </Link>
                </nav>
            </div>
        </header>
    );
};