// components/pendaftaran/ParticipantPhotoUpload.js

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // <-- Impor useDropzone
import { FiUpload, FiImage, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const ParticipantPhotoUpload = ({ index, name, selectedFile, onFileChange }) => {
    const [preview, setPreview] = useState(null);

    // Fungsi yang akan dipanggil saat file diterima (baik via klik maupun drop)
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            onFileChange(index, acceptedFiles[0]);
        }
    }, [index, onFileChange]);

    // Konfigurasi Dropzone
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
        },
        multiple: false, // Hanya izinkan satu file per drop
        noClick: true, // Jangan buka dialog file saat area di-klik (kita punya tombol sendiri)
        noKeyboard: true,
    });

    // Membuat URL preview untuk gambar yang dipilih
    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [selectedFile]);

    const handleRemoveFile = (e) => {
        e.stopPropagation(); // Hentikan event agar tidak memicu dropzone/open dialog
        onFileChange(index, null);
    };
    
    // Fungsi open dipanggil dari tombol upload kustom kita
    const handleButtonClick = (e) => {
        e.stopPropagation();
        open();
    };

    return (
        // Terapkan getRootProps ke div utama
        <div 
            {...getRootProps()} 
            className={`relative flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200
            ${isDragActive ? 'border-red-500 ring-2 ring-red-300 bg-red-50' : ''}
            `}
        >
            {/* Overlay saat drag-and-drop aktif */}
            {isDragActive && (
                <div className="absolute inset-0 bg-red-100 bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                    <div className="text-center">
                        <FiUpload className="mx-auto h-8 w-8 text-red-600" />
                        <p className="font-semibold text-red-700">Jatuhkan foto di sini</p>
                    </div>
                </div>
            )}
            
            {/* Konten Utama */}
            <div className="flex items-center gap-4">
                {preview ? (
                    <img src={preview} alt="Preview" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <FiImage size={24} />
                    </div>
                )}
                <div>
                    <p className="font-semibold text-gray-800">{name}</p>
                    {selectedFile ? (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <FiCheckCircle />
                            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500">Klik tombol upload atau jatuhkan file foto di sini</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 z-20">
                {/* Gunakan fungsi `open` dari useDropzone */}
                <input {...getInputProps()} />
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="bg-red-50 text-red-700 hover:bg-red-100 p-2 rounded-full transition-colors"
                    title="Upload atau Ganti Foto"
                >
                    <FiUpload />
                </button>
                {selectedFile && (
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-2 rounded-full transition-colors"
                        title="Hapus Foto"
                    >
                        <FiTrash2 />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ParticipantPhotoUpload;