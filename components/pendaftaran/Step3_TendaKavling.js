// components/pendaftaran/Step3_TendaKavling.js

import { FormSection, Select } from './FormElements';
import KavlingMap from './KavlingMap';
import { FiLoader, FiZoomIn } from 'react-icons/fi';
import Image from 'next/image';

// --- Impor library baru ---
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'; // <-- Jangan lupa impor CSS-nya

const Step3_TendaKavling = ({ tenda, handleTendaChange, kavling, setKavling, isKavlingLoading, kavlingData, errors }) => {
    return (
        <FormSection title="Langkah 3: Tenda & Denah Kavling">
            {/* Opsi Tenda & Kapasitas */}
            <div className="grid grid-cols-1 text-slate-800 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
                <Select
                    label="Opsi Tenda"
                    name="opsi" 
                    value={tenda.opsi} 
                    onChange={handleTendaChange}
                >
                    <option value="bawa_sendiri">Bawa Tenda Sendiri</option>
                    <option value="sewa">Sewa dari Panitia</option>
                </Select>

                <Select
                    label="Kapasitas Tenda"
                    name="kapasitas" 
                    value={tenda.kapasitas} 
                    onChange={handleTendaChange}
                >
                    <option value="15">Kapasitas 15 Orang</option>
                    <option value="20">Kapasitas 20 Orang</option>
                    <option value="50">Kapasitas 50 Orang</option>
                </Select>
            </div>

            {/* Layout Satu Kolom yang Baru */}
            <div className="space-y-8 border-t pt-8">
                
                {/* 1. Denah Lokasi dengan Fitur Zoom */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Denah Lokasi Camp</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <FiZoomIn /> Klik gambar denah untuk memperbesar.
                    </p>
                    <div className="bg-slate-100 p-2 rounded-lg border shadow-inner cursor-zoom-in">
                        {/* Bungkus komponen Image dengan Zoom */}
                        <Zoom overlayBgColorEnd="rgba(0, 0, 0, 0.9)">
                            <Image 
                                src="/images/denah-lokasi.webp" // Pastikan path ini benar
                                alt="Denah Lokasi Mandala Kitri Scout Camp"
                                width={1920} 
                                height={1080}
                                layout="responsive"
                                className="rounded-md"
                            />
                        </Zoom>
                    </div>
                </div>

                {/* 2. Peta Kavling Interaktif */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Pilih Nomor Kavling Anda</h3>
                    {isKavlingLoading ? (
                        <div className="flex items-center justify-center gap-2 text-lg text-slate-500 h-full py-10">
                            <FiLoader className="animate-spin" />
                            <span>Memuat denah kavling...</span>
                        </div>
                    ) : (
                        <KavlingMap 
                            range={kavlingData.range}
                            takenKavlings={kavlingData.taken}
                            selectedKavling={kavling}
                            onSelectKavling={setKavling}
                        />
                    )}
                </div>
            </div>
        </FormSection>
    );
};

export default Step3_TendaKavling;