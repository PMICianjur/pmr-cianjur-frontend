import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import readXlsxFile from 'read-excel-file';
import { AnimatePresence, motion } from 'framer-motion';

// Import komponen UI
import Header from '../components/Header';
import Footer from '../components/Footer';
import RingkasanBiaya from '../components/RingkasanBiaya';
import Stepper from '../components/pendaftaran/Stepper';
import Step1_DataSekolah from '../components/pendaftaran/Step1_DataSekolah';
import Step2_DataPeserta from '../components/pendaftaran/Step2_DataPeserta';
import Step3_TendaKavling from '../components/pendaftaran/Step3_TendaKavling';
import Step4_Konfirmasi from '../components/pendaftaran/Step4_Konfirmasi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOTAL_STEPS = 4;
// Kunci unik untuk data formulir di localStorage
const FORM_DATA_KEY = 'pmrCianjurPendaftaranForm';

export default function Pendaftaran() {
    const router = useRouter();

    // --- State Management ---
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        nama_sekolah: '',
        nama_pembina: '',
        no_whatsapp: '',
        kategori: 'wira',
    });
    const [schoolCheck, setSchoolCheck] = useState({ status: 'idle', message: '' });
    const [fileExcel, setFileExcel] = useState(null);
    const [excelCounts, setExcelCounts] = useState({ peserta: 0, pendamping: 0 });
    const [participantList, setParticipantList] = useState([]);
    const [fotoPeserta, setFotoPeserta] = useState({});
    const [tenda, setTenda] = useState({ opsi: 'bawa_sendiri', kapasitas: '15' });
    const [biaya, setBiaya] = useState({ peserta: 0, pendamping: 0, tenda: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ message: '', fields: [] });
    const [isClient, setIsClient] = useState(false);
    const [kavlingData, setKavlingData] = useState({ range: null, taken: [] });
    const [kavling, setKavling] = useState('');
    const [isKavlingLoading, setIsKavlingLoading] = useState(false);

    // --- EFFECT BARU: Memuat data dari localStorage saat halaman pertama kali dimuat ---
    useEffect(() => {
        setIsClient(true); // Set isClient di sini agar bisa akses localStorage
        try {
            const savedData = localStorage.getItem(FORM_DATA_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                console.log("Data ditemukan di localStorage, memuat...", parsedData);

                // Muat data ke state, kecuali file.
                setFormData(parsedData.formData || { nama_sekolah: '', nama_pembina: '', no_whatsapp: '', kategori: 'wira' });
                setTenda(parsedData.tenda || { opsi: 'bawa_sendiri', kapasitas: '15' });
                setKavling(parsedData.kavling || '');
                setStep(parsedData.step || 1);
                
                // Beri pesan kepada pengguna bahwa file perlu di-upload ulang jika ada
                if (parsedData.hasFiles) {
                     setError({ message: 'Data formulir Anda telah dipulihkan. Mohon unggah kembali file Excel dan foto peserta.', fields: [] });
                }
            }
        } catch (error) {
            console.error("Gagal memuat data dari localStorage:", error);
            localStorage.removeItem(FORM_DATA_KEY); // Hapus data korup jika ada
        }
    }, []); // Array dependensi kosong berarti hanya berjalan sekali saat mount

    // --- EFFECT BARU: Menyimpan data ke localStorage setiap kali ada perubahan ---
    useEffect(() => {
        // Jangan simpan jika belum ada interaksi atau belum client-side
        if (!isClient || (formData.nama_sekolah === '' && formData.nama_pembina === '')) {
            return;
        }

        const dataToSave = {
            formData,
            tenda,
            kavling,
            step,
            // Simpan penanda bahwa file pernah ada
            hasFiles: fileExcel !== null || Object.keys(fotoPeserta).length > 0
        };

        try {
            localStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Gagal menyimpan data ke localStorage:", error);
        }
    }, [formData, tenda, kavling, step, fileExcel, fotoPeserta, isClient]);
    // --- Handlers ---
  const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'kategori') setKavling('');
    };

    const handleTendaChange = (e) => {
        setTenda(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setKavling('');
    };

    const handleFileExcelChange = async (e) => {
        const file = e.target.files[0];
        setFileExcel(file);
        setParticipantList([]);
        setFotoPeserta({});
        setExcelCounts({ peserta: 0, pendamping: 0 });
        if (!file) return;
        setIsLoading(true);
        setError({ message: '', fields: [] });
        try {
            const rows = await readXlsxFile(file, { sheet: 'Data Peserta' });
            if (rows.length <= 1) throw new Error("Sheet 'Data Peserta' tidak berisi data.");
            const participants = rows.slice(1).map((row, index) => ({ id: index, name: row[0] || `Peserta #${index + 1}` }));
            setParticipantList(participants);
            const jumlahPeserta = participants.length;
            let jumlahPendamping = 0;
            try {
                const pendampingRows = await readXlsxFile(file, { sheet: 'Data Pendamping' });
                jumlahPendamping = pendampingRows.length > 1 ? pendampingRows.length - 1 : 0;
            } catch (sheetError) { /* ignore */ }
            setExcelCounts({ peserta: jumlahPeserta, pendamping: jumlahPendamping });
        } catch (err) {
            setError({ message: err.message || "Gagal membaca file Excel.", fields: ['file_excel'] });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSingleFotoChange = (participantIndex, file) => {
        setFotoPeserta(prev => {
            const newFotos = { ...prev };
            if (file) newFotos[participantIndex] = file;
            else delete newFotos[participantIndex];
            return newFotos;
        });
    };
    
    // --- useEffect Hooks ---
        useEffect(() => {
        const biayaPeserta = excelCounts.peserta * 35000;
        const biayaPendamping = excelCounts.pendamping * 25000;
        let biayaTenda = 0;
        if (tenda.opsi === 'sewa') {
            if (tenda.kapasitas === '15') biayaTenda = 250000;
            if (tenda.kapasitas === '20') biayaTenda = 450000;
            if (tenda.kapasitas === '50') biayaTenda = 750000;
        }
        setBiaya({ peserta: biayaPeserta, pendamping: biayaPendamping, tenda: biayaTenda, total: biayaPeserta + biayaPendamping + biayaTenda });
    }, [excelCounts, tenda]);

 useEffect(() => {
        // Jangan panggil API jika belum client-side atau data belum lengkap
        if (!isClient || !formData.kategori || !tenda.kapasitas) return;

        setIsKavlingLoading(true);
        // Reset data kavling saat pilihan berubah
        setKavlingData({ range: null, taken: [] });
        
        axios.get(`${API_URL}/api/pendaftaran/kavling-status`, { // <-- Ganti URL API
            params: { 
                kategori: formData.kategori, 
                kapasitas_tenda: tenda.kapasitas 
            }
        })
        .then(res => {
            setKavlingData(res.data); // <-- Simpan data baru (range dan taken)
        })
        .catch(err => {
            setError({ message: 'Gagal memuat data denah kavling.', fields: [] });
            console.error("Gagal memuat data kavling:", err);
        })
        .finally(() => {
            setIsKavlingLoading(false);
        });

    }, [formData.kategori, tenda.kapasitas, isClient]);

    useEffect(() => {
        if (!isClient) return;
        const schoolName = formData.nama_sekolah.trim();
        if (schoolName.length < 3) {
            setSchoolCheck({ status: 'idle', message: '' });
            return;
        }
        setSchoolCheck({ status: 'checking', message: '' });
        const handler = setTimeout(() => {
            axios.get(`${API_URL}/api/pendaftaran/check-sekolah`, { params: { nama: schoolName } })
                .then(res => {
                    if (res.data.exists) setSchoolCheck({ status: 'invalid', message: 'Nama sekolah ini sudah terdaftar.' });
                    else setSchoolCheck({ status: 'valid', message: 'Nama sekolah tersedia.' });
                })
                .catch(err => {
                    console.error("Error checking school name:", err);
                    setSchoolCheck({ status: 'idle', message: '' });
                });
        }, 500);
        return () => clearTimeout(handler);
    }, [formData.nama_sekolah, isClient]);


    // --- Logika Validasi ---
    const validateCurrentStep = useCallback((targetStep = step) => {
        // Pengecekan baru: apakah file sudah diupload jika kita mencoba melewati step 2
        if (targetStep > 2 && !fileExcel) {
            setError({
                message: "Anda harus menyelesaikan Langkah 2 (upload data peserta) terlebih dahulu.",
                fields: ['file_excel']
            });
            // Langsung arahkan ke Step 2
            setStep(2);
            return false;
        }

        const newError = { message: '', fields: [] };
        switch (step) {
            case 1:
                if (formData.nama_sekolah.trim() === '') newError.fields.push('nama_sekolah');
                if (formData.nama_pembina.trim() === '') newError.fields.push('nama_pembina');
                if (formData.no_whatsapp.trim() === '') newError.fields.push('no_whatsapp');
                if (schoolCheck.status === 'invalid') {
                    newError.fields.push('nama_sekolah');
                    newError.message = 'Nama sekolah ini sudah terdaftar dan tidak bisa digunakan.';
                } else if (newError.fields.length > 0) {
                    newError.message = 'Mohon lengkapi semua data yang ditandai.';
                }
                break;
            case 2:
                if (!fileExcel) {
                    newError.message = 'File Excel data peserta wajib di-upload.';
                    newError.fields.push('file_excel');
                } else if (participantList.length === 0) {
                    newError.message = 'Gagal membaca daftar peserta dari Excel.';
                    newError.fields.push('file_excel');
                } else if (Object.keys(fotoPeserta).length !== participantList.length) {
                    const uploadedCount = Object.keys(fotoPeserta).length;
                    const totalCount = participantList.length;
                    newError.message = `Mohon upload foto untuk SEMUA peserta. (${uploadedCount}/${totalCount} terupload)`;
                    newError.fields.push('foto_peserta_list');
                }
                break;
            case 3:
                if (kavling.trim() === '') {
                    newError.message = 'Mohon pilih nomor kavling yang tersedia.';
                    newError.fields.push('kavling');
                }
                break;
            default: break;
        }
        setError(newError);
        return newError.fields.length === 0 && newError.message === '';
    }, [step, formData, fileExcel, participantList, fotoPeserta, kavling, schoolCheck.status]);
    
    // --- FUNGSI nextStep YANG DIPERBARUI ---
    const nextStep = () => {
        const nextStepNumber = step + 1;

        // Validasi khusus saat mencoba melewati step 2
        if (nextStepNumber > 2 && !fileExcel) {
            setError({
                message: "Anda harus menyelesaikan Langkah 2 (upload data peserta) terlebih dahulu.",
                fields: ['file_excel']
            });
            setStep(2); // Paksa kembali ke step 2
            return;
        }

        // Jalankan validasi untuk step saat ini
        if (validateCurrentStep()) {
            setStep(nextStepNumber);
        }
    };
    const prevStep = () => { setError({ message: '', fields: [] }); setStep(prev => Math.max(prev - 1, 1)); };
    
    // --- Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateCurrentStep()) return;
        setIsLoading(true);
        setError({ message: '', fields: [] });

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('file_excel', fileExcel);
        data.append('opsi_tenda', tenda.opsi);
        data.append('kapasitas_tenda', tenda.kapasitas);
        data.append('nomor_kavling', kavling);

        const orderedPhotos = [];
        for (let i = 0; i < participantList.length; i++) {
            if (fotoPeserta[i]) {
                orderedPhotos.push(fotoPeserta[i]);
            } else {
                setError({ message: `Foto untuk peserta ${participantList[i].name} tidak ditemukan.`, fields: [] });
                setIsLoading(false);
                return;
            }
        }
        orderedPhotos.forEach(foto => data.append('foto_peserta', foto));

        try {
            const response = await axios.post(`${API_URL}/api/pendaftaran/register`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            const { snap_token, id_order_midtrans } = response.data;
            if (window.snap) {
                window.snap.pay(snap_token, {
                    onSuccess: result => {
                        localStorage.removeItem(FORM_DATA_KEY); // Hapus data setelah sukses
                        router.push(`/pembayaran/sukses?order_id=${id_order_midtrans}`);
                    },
                    onPending: result => {
                        localStorage.removeItem(FORM_DATA_KEY); // Hapus data juga saat pending
                        router.push(`/pembayaran/pending?order_id=${id_order_midtrans}`);
                    },
                    onError: result => {
                        setIsLoading(false);
                        setError({ message: 'Terjadi kesalahan pada proses pembayaran.', fields: [] });
                    },
                    onClose: () => {
                        setIsLoading(false);
                        setError({ message: 'Anda menutup jendela pembayaran. Klik "Lanjutkan ke Pembayaran" untuk mencoba lagi.', fields: [] });
                    }
                });
            } else { throw new Error("Midtrans Snap.js tidak dapat dimuat."); }
        } catch (err) {
            setIsLoading(false);
            setError({ message: err.response?.data?.message || 'Terjadi kesalahan pada server.', fields: [] });
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Head>
                <title>Pendaftaran Peserta - PMR Cianjur 2025</title>
                <script type="text/javascript" src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL} data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}></script>
            </Head>
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <Stepper currentStep={step} />
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
                        <div className="lg:col-span-2">
                           <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {step === 1 && <Step1_DataSekolah formData={formData} handleFormChange={handleFormChange} errors={error.fields} schoolCheck={schoolCheck} />}
                                    {step === 2 && <Step2_DataPeserta handleFileExcelChange={handleFileExcelChange} errors={error.fields} participantList={participantList} fotoPeserta={fotoPeserta} onFotoChange={handleSingleFotoChange} isLoading={isLoading} />}
                                    {step === 3 && <Step3_TendaKavling 
                                        tenda={tenda} 
                                        handleTendaChange={handleTendaChange} 
                                        kavling={kavling} 
                                        setKavling={setKavling} 
                                        isKavlingLoading={isKavlingLoading} 
                                        kavlingData={kavlingData} // <-- Kirim kavlingData, bukan kavlingTersedia
                                        errors={error.fields}
                                    />}
                                    {step === 4 && <Step4_Konfirmasi formData={formData} tenda={tenda} excelCounts={excelCounts} kavling={kavling} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        
                        <div className="lg:col-span-1 mt-8 lg:mt-0">
                            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-red-200 pb-3 mb-4">Ringkasan Pendaftaran</h2>
                                {isClient ? <RingkasanBiaya biaya={biaya} excelCounts={excelCounts} /> : <div className="animate-pulse">...</div>}
                                <AnimatePresence>
                                {error.message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-100 text-red-800 p-3 rounded-lg mt-4 text-sm font-medium"
                                    >
                                        {error.message}
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-between items-center max-w-4xl mx-auto">
                        <div>
                            {step > 1 && (
                                <button onClick={prevStep} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                                    Kembali
                                </button>
                            )}
                        </div>
                        <div>
                            {step < TOTAL_STEPS && (
                                <button onClick={nextStep} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg shadow-red-500/30">
                                    Selanjutnya
                                </button>
                            )}
                            {step === TOTAL_STEPS && (
                               <button 
                                onClick={handleSubmit} 
                                // Sekarang disabled ini akan berfungsi dengan benar
                                disabled={isLoading || !isClient} 
                                className="w-full bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                            >
                                {isLoading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
                            </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}