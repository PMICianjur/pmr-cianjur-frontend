// components/pendaftaran/Step1_DataSekolah.js
import { FormSection, Input, Select } from './FormElements';
import { FiLoader, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const SchoolCheckMessage = ({ status, message }) => {
    if (status === 'idle') return null;

    let color = 'text-slate-500';
    let icon = <FiLoader className="animate-spin" />;

    if (status === 'valid') {
        color = 'text-green-600';
        icon = <FiCheckCircle />;
    } else if (status === 'invalid') {
        color = 'text-red-600';
        icon = <FiXCircle />;
    }
    
    return (
        <div className={`flex items-center text-sm mt-2 ${color}`}>
            {icon}
            <span className="ml-2">{message || (status === 'checking' && 'Mengecek ketersediaan...') }</span>
        </div>
    );
};

const Step1_DataSekolah = ({ formData, handleFormChange, errors, schoolCheck }) => { // Terima prop 'schoolCheck'
    return (
        <FormSection title="Langkah 1: Data Sekolah & Pembina">
            <div className="grid grid-cols-1 text-slate-800 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div className="sm:col-span-2">
                    <Input 
                        label="Nama Sekolah"
                        type="text" 
                        name="nama_sekolah" 
                        placeholder="Contoh: SMAN 1 CIANJUR" 
                        required 
                        value={formData.nama_sekolah} 
                        onChange={handleFormChange}
                        errors={errors}
                        // Teruskan status pengecekan ke komponen Input
                        schoolCheckStatus={schoolCheck.status}
                    />
                    {/* Tampilkan pesan hasil pengecekan */}
                    <SchoolCheckMessage status={schoolCheck.status} message={schoolCheck.message} />
                </div>
                
                <Input 
                    label="Nama Pembina/Pelatih"
                    type="text" 
                    name="nama_pembina" 
                    placeholder="Nama Lengkap" 
                    required 
                    value={formData.nama_pembina} 
                    onChange={handleFormChange}
                    errors={errors}
                />
                
                <Input 
                    label="Nomor WhatsApp Aktif"
                    type="tel" 
                    name="no_whatsapp" 
                    placeholder="08..." 
                    required 
                    value={formData.no_whatsapp} 
                    onChange={handleFormChange}
                    errors={errors}
                />

                <div className="sm:col-span-2">
                    <Select 
                        label="Kategori Lomba"
                        name="kategori" 
                        value={formData.kategori} 
                        required 
                        onChange={handleFormChange}
                        errors={errors}
                    >
                        <option value="wira">PMR Wira (SMA/SMK/MA)</option>
                        <option value="madya">PMR Madya (SMP/MTs)</option>
                    </Select>
                </div>
            </div>
        </FormSection>
    );
};

export default Step1_DataSekolah;