// components/pendaftaran/KwitansiPDF.js
import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number || 0);

const formatDate = (dateString, formatStr = 'dd MMMM yyyy') => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), formatStr, { locale: id });
  } catch (e) {
    return 'N/A';
  }
};

const KwitansiPDF = ({ pendaftaran }) => {
  if (!pendaftaran) return null;

  const BIAYA_PESERTA = 35000;
  const BIAYA_PENDAMPING = 25000;

  const colors = {
    white: '#FFFFFF',
    black: '#000000',
    lightGray: '#F3F4F6'
  };

  const subtotalPeserta = pendaftaran.jumlah_peserta * BIAYA_PESERTA;
  const subtotalPendamping = pendaftaran.jumlah_pendamping * BIAYA_PENDAMPING;
  const subtotalTenda =
    pendaftaran.total_biaya - subtotalPeserta - subtotalPendamping;

  return (
    <div
      id="kwitansi-pdf"
      style={{
        width: '210mm',
        padding: '15mm',
        backgroundColor: colors.white,
        color: colors.black,
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5'
      }}
    >
      {/* KOP SURAT - Logo tengah + alamat */}
      <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: `4px solid ${colors.black}`,
    paddingBottom: '12px'
  }}
>

   {/* Perubahan: Tambahkan komentar ini untuk menonaktifkan aturan linting no-img-element */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src="/logo-pmi.png"
    alt="Logo PMI"
    style={{
      width: 'auto',
      height: '80px',
      objectFit: 'contain',
      marginBottom: '8px',
      display: 'block'
    }}
  />
</div>

      {/* JUDUL */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>
          BUKTI PEMBAYARAN
        </h1>
        <p style={{ margin: 0 }}>Nomor: {pendaftaran.id_order_midtrans}</p>
      </div>

      {/* INFORMASI UMUM */}
      <table style={{ width: '100%', marginBottom: '24px' }}>
        <tbody>
          <tr>
            <td style={{ width: '35%', padding: '4px 0' }}>Telah diterima dari</td>
            <td style={{ width: '65%', padding: '4px 0' }}>
              : {pendaftaran.nama_sekolah}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Pembina/Pelatih</td>
            <td style={{ padding: '4px 0' }}>: {pendaftaran.nama_pembina}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0' }}>Sebesar</td>
            <td style={{ padding: '4px 0', fontWeight: 'bold' }}>
              : {formatRupiah(pendaftaran.total_biaya)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* RINCIAN BIAYA */}
      <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Untuk pembayaran:</p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '24px'
        }}
      >
        <thead>
          <tr style={{ backgroundColor: colors.lightGray }}>
            <th
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'left'
              }}
            >
              Deskripsi
            </th>
            <th
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'center'
              }}
            >
              Jumlah
            </th>
            <th
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'right'
              }}
            >
              Biaya Satuan
            </th>
            <th
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'right'
              }}
            >
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: `1px solid ${colors.black}`, padding: '8px' }}>
              Biaya Pendaftaran Peserta
            </td>
            <td
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'center'
              }}
            >
              {pendaftaran.jumlah_peserta}
            </td>
            <td
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'right'
              }}
            >
              {formatRupiah(BIAYA_PESERTA)}
            </td>
            <td
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'right'
              }}
            >
              {formatRupiah(subtotalPeserta)}
            </td>
          </tr>

          {pendaftaran.jumlah_pendamping > 0 && (
            <tr>
              <td style={{ border: `1px solid ${colors.black}`, padding: '8px' }}>
                Biaya Pendaftaran Pendamping
              </td>
              <td style={{ border: `1px solid ${colors.black}`, padding: '8px', textAlign: 'center' }}>
                {pendaftaran.jumlah_pendamping}
              </td>
              <td style={{ border: `1px solid ${colors.black}`, padding: '8px', textAlign: 'right' }}>
                {formatRupiah(BIAYA_PENDAMPING)}
              </td>
              <td style={{ border: `1px solid ${colors.black}`, padding: '8px', textAlign: 'right' }}>
                {formatRupiah(subtotalPendamping)}
              </td>
            </tr>
          )}

          {pendaftaran.opsi_tenda === 'sewa' && (
            <tr>
              <td style={{ border: `1px solid ${colors.black}`, padding: '8px' }}>
                Sewa Tenda Kapasitas {pendaftaran.kapasitas_tenda}
              </td>
              <td style={{ border: `1px solid ${colors.black}`, padding: '8px', textAlign: 'center' }}>
                1
              </td>
              <td style={{ border: `1px solid ${colors.black}`, padding: '8px', textAlign: 'right' }}>
                {formatRupiah(subtotalTenda)}
              </td>
              <td style={{ border: `1px solid ${colors.black}`, padding: '8px', textAlign: 'right' }}>
                {formatRupiah(subtotalTenda)}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: colors.lightGray, fontWeight: 'bold' }}>
            <td
              colSpan="3"
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'right'
              }}
            >
              TOTAL
            </td>
            <td
              style={{
                border: `1px solid ${colors.black}`,
                padding: '8px',
                textAlign: 'right'
              }}
            >
              {formatRupiah(pendaftaran.total_biaya)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* TANDA TANGAN */}
      <div style={{ textAlign: 'right', marginTop: '48px' }}>
        <p>Cianjur, {formatDate(pendaftaran.waktu_pendaftaran)}</p>
        <p>Panitia PMR Cianjur 2025</p>
        <div style={{ height: '80px' }}></div>
        <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
          (.............................)
        </p>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px' }}>
        <p style={{ fontWeight: 'bold' }}>
          KWITANSI INI SAH MESKIPUN TANPA TANDA TANGAN DAN CAP BASAH
        </p>
        <p>Dicetak oleh sistem pada {formatDate(new Date(), 'dd MMMM yyyy, HH:mm:ss')}</p>
      </div>
    </div>
  );
};

export default KwitansiPDF;
