// components/pendaftaran/KavlingMap.js
import React from 'react';

const KavlingMap = ({ range, takenKavlings, selectedKavling, onSelectKavling }) => {
    if (!range) {
        return <p className="text-center text-slate-800">Pilih kategori dan kapasitas tenda untuk melihat denah kavling.</p>;
    }

    const kavlings = [];
    for (let i = range.min; i <= range.max; i++) {
        kavlings.push(i);
    }

    return (
        <div>
            {/* Legend / Keterangan Warna */}
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs">
                <div className="flex items-center text-slate-800 gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Tersedia</div>
                <div className="flex items-center text-slate-800 gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div> Terisi</div>
                <div className="flex items-center text-slate-800 gap-2"><div className="w-4 h-4 bg-blue-600 rounded"></div> Pilihan Anda</div>
            </div>

            {/* Grid Kavling */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 p-4 bg-slate-100 rounded-lg border">
                {kavlings.map(nomor => {
                    const isTaken = takenKavlings.includes(nomor);
                    const isSelected = selectedKavling === String(nomor);

                    let classes = "w-full h-12 flex items-center justify-center rounded-md font-bold text-white transition-transform transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50";

                    if (isSelected) {
                        classes += " bg-blue-600 ring-2 ring-offset-2 ring-blue-600";
                    } else if (isTaken) {
                        classes += " bg-red-500";
                    } else {
                        classes += " bg-green-500 hover:bg-green-600 cursor-pointer";
                    }

                    return (
                        <button
                            key={nomor}
                            type="button"
                            disabled={isTaken}
                            onClick={() => onSelectKavling(String(nomor))}
                            className={classes}
                        >
                            {nomor}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default KavlingMap;