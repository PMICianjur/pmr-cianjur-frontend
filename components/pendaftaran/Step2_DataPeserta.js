// components/pendaftaran/Step2_DataPeserta.js

import { FormSection } from './FormElements';
import ParticipantPhotoUpload from './ParticipantPhotoUpload';
import { FiDownload, FiUpload, FiUsers, FiLoader } from 'react-icons/fi';

const FileInput = ({ name, errors = [], ...props }) => {
    const isError = errors.includes(name);
    return (
        <div className={`p-2 rounded-lg transition-all duration-200 ${isError ? 'bg-red-100 ring-1 ring-red-500' : ''}`}>
            <input 
                type="file"
                name={name} 
                {...props} 
                className="block w-full text-sm text-slate-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer transition-colors duration-200"
            />
        </div>
    );
};

const Step2_DataPeserta = ({ handleFileExcelChange, errors, participantList, fotoPeserta, onFotoChange, isLoading }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    return (
        <FormSection title="Langkah 2: Data Peserta & Pendamping">
            {/* Bagian Upload Excel */}
            <p className="text-slate-700 mb-4 text-sm leading-relaxed">
                Pertama, unggah file Excel yang sudah diisi. Setelah itu, daftar nama peserta akan muncul di bawah ini agar Anda dapat mengunggah foto mereka satu per satu.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <a 
                    href={`${API_URL}/public/templates/Template_Peserta_PMR.xlsx`} 
                    download 
                    className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg shadow-green-500/30"
                >
                    <FiDownload />
                    Unduh Template
                </a>
                <div>
                    <label className="flex items-center gap-2 text-md font-medium text-slate-700 mb-1.5">
                        <FiUpload className="text-red-600"/> Upload File Excel Anda
                    </label>
                    <FileInput 
                        name="file_excel" 
                        accept=".xlsx, .xls" 
                        required 
                        onChange={handleFileExcelChange} 
                        errors={errors} 
                    />
                </div>
            </div>

            {/* Bagian Upload Foto Per Peserta */}
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <FiLoader className="animate-spin text-red-500 mr-3" size={24} />
                    <span className="text-slate-700">Membaca file Excel...</span>
                </div>
            )}
            
            {participantList.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-slate-700 mb-4 border-t pt-6 flex items-center gap-2">
                        <FiUsers /> Unggah Foto Peserta
                    </h3>
                    {/* --- PERBARUI TEKS INSTRUKSI DI SINI --- */}
                    <p className="text-sm text-slate-700 mb-4">
                        Klik tombol upload atau seret & jatuhkan (drag & drop) file foto ke area masing-masing nama.
                    </p>
                    <div 
                        className={`space-y-4 ${errors.includes('foto_peserta_list') ? 'p-4 bg-red-50 rounded-lg border-2 border-dashed border-red-300' : ''}`}
                    >
                        {participantList.map((participant, index) => (
                            <ParticipantPhotoUpload
                                key={participant.id}
                                index={index}
                                name={participant.name}
                                selectedFile={fotoPeserta[index]}
                                onFileChange={onFotoChange}
                            />
                        ))}
                    </div>
                </div>
            )}
        </FormSection>
    );
};

export default Step2_DataPeserta;