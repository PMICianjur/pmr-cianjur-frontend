export default function RingkasanBiaya({ biaya, excelCounts }) {
    
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    return (
        <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 mb-4 rounded-r-md">
                <p className="font-bold">Rincian Otomatis dari Excel:</p>
                <p>Jumlah peserta dan pendamping dihitung langsung dari file yang Anda upload.</p>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Biaya Peserta ({excelCounts.peserta} org)</span>
                <span className="font-semibold text-gray-800">{formatRupiah(biaya.peserta)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Biaya Pendamping ({excelCounts.pendamping} org)</span>
                <span className="font-semibold text-gray-800">{formatRupiah(biaya.pendamping)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Biaya Sewa Tenda</span>
                <span className="font-semibold text-gray-800">{formatRupiah(biaya.tenda)}</span>
            </div>
            <hr className="my-2 border-dashed"/>
            <div className="flex justify-between items-center text-lg font-bold text-red-700">
                <span>Total Biaya:</span>
                <span>{formatRupiah(biaya.total)}</span>
            </div>
        </div>
    )
}