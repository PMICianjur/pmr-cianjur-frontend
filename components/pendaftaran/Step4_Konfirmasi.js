// components/pendaftaran/Step4_Konfirmasi.js
import { FormSection } from './FormElements';
import { FiHome, FiUser, FiPhone, FiTag, FiUsers, FiMapPin } from 'react-icons/fi';
import { FaCampground } from 'react-icons/fa';

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start py-3 border-b border-gray-100">
        <div className="text-red-500 mr-4 mt-1">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

const Step4_Konfirmasi = ({ formData, tenda, excelCounts, kavling }) => {
    return (
        <FormSection title="Langkah 4: Konfirmasi Data Anda">
            <p className="mb-6 text-gray-600 text-sm">Mohon periksa kembali semua data yang telah Anda masukkan sebelum melanjutkan ke pembayaran. Data ini akan digunakan untuk sertifikat dan keperluan administrasi lainnya.</p>
            
            <div className="space-y-2">
                <InfoItem icon={<FiHome size={20}/>} label="Nama Sekolah" value={formData.nama_sekolah || "-"} />
                <InfoItem icon={<FiUser size={20}/>} label="Nama Pembina" value={formData.nama_pembina || "-"} />
                <InfoItem icon={<FiPhone size={20}/>} label="No. WhatsApp" value={formData.no_whatsapp || "-"} />
                <InfoItem icon={<FiTag size={20}/>} label="Kategori" value={formData.kategori === 'wira' ? 'PMR Wira' : 'PMR Madya'} />
                <InfoItem 
                    icon={<FiUsers size={20}/>} 
                    label="Jumlah Peserta & Pendamping" 
                    value={`${excelCounts.peserta} Peserta, ${excelCounts.pendamping} Pendamping`} 
                />
                <InfoItem 
                    icon={<FaCampground size={20}/>} 
                    label="Tenda" 
                    value={`${tenda.opsi === 'sewa' ? 'Sewa Tenda' : 'Bawa Sendiri'} (Kap. ${tenda.kapasitas} Orang)`}
                />
                <InfoItem icon={<FiMapPin size={20}/>} label="Nomor Kavling Pilihan" value={`Nomor ${kavling}` || "Belum dipilih"} />
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                <h4 className="font-bold">Perhatian!</h4>
                <p className="text-sm">Pastikan semua data di atas sudah benar. Setelah pembayaran berhasil, beberapa data mungkin tidak dapat diubah.</p>
            </div>
        </FormSection>
    );
};

export default Step4_Konfirmasi;