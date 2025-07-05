/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Daftarkan hostname dari server backend Anda di sini
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Sesuaikan port jika berbeda
        pathname: '/uploads/**', // Izinkan semua path di dalam /uploads
      },
    ],
  },
  
};

export default nextConfig;
