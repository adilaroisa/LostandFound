import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styleUser/ProsedurPage.css';

const ProsedurPage = () => {
  // State untuk melacak tab mana yang sedang aktif
  const [activeTab, setActiveTab] = useState('kehilangan');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="prosedur-page">
      <Navbar />
      
      <div className="prosedur-header">
        <div className="header-content">
          <h1>Prosedur Lost & Found UMY</h1>
          <p>Panduan lengkap tata cara pelaporan barang hilang dan temuan di area kampus</p>
        </div>
      </div>

      <main className="prosedur-container">
        {/* Tombol Navigasi Tab */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'kehilangan' ? 'active' : ''}`}
            onClick={() => setActiveTab('kehilangan')}
          >
            Lapor Kehilangan
          </button>
          <button 
            className={`tab-button ${activeTab === 'penemuan' ? 'active' : ''}`}
            onClick={() => setActiveTab('penemuan')}
          >
            Lapor Penemuan
          </button>
          <button 
            className={`tab-button ${activeTab === 'pengambilan' ? 'active' : ''}`}
            onClick={() => setActiveTab('pengambilan')}
          >
            Pengambilan Barang
          </button>
        </div>

        {/* Konten Tab yang Berganti Sesuai State */}
        <div className="tab-content">
          
          {/* KONTEN TAB: KEHILANGAN */}
          {activeTab === 'kehilangan' && (
            <div className="tab-pane">
              <h2>Prosedur Pelaporan Kehilangan</h2>
              
              <div className="prosedur-step">
                <div className="step-number">1</div>
                <div className="step-text">
                  <h3>Cek Daftar Barang Temuan Terlebih Dahulu</h3>
                  <p>Sebelum melaporkan kehilangan, pastikan Anda mengecek halaman "List Barang Temuan". Mungkin saja barang Anda sudah ditemukan oleh orang lain dan diamankan oleh pihak kampus.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">2</div>
                <div className="step-text">
                  <h3>Isi Formulir Kehilangan Secara Detail</h3>
                  <p>Jika barang belum terdaftar, akses menu "Form Kehilangan". Isi data diri Anda dan deskripsikan ciri-ciri barang sedetail mungkin (warna, merek, isi dalam dompet/tas, lokasi terakhir terlihat) agar memudahkan pencarian.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">3</div>
                <div className="step-text">
                  <h3>Menunggu Verifikasi Admin</h3>
                  <p>Laporan Anda akan ditinjau oleh Admin. Setelah divalidasi, laporan akan ditayangkan di halaman "List Barang Hilang" agar seluruh sivitas akademika UMY dapat membantu mencari.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">4</div>
                <div className="step-text">
                  <h3>Pemberitahuan Penemuan</h3>
                  <p>Jika ada mahasiswa atau petugas yang menemukan barang dengan ciri-ciri yang sesuai dengan laporan Anda, Admin akan segera menghubungi Anda melalui nomor WhatsApp yang terdaftar.</p>
                </div>
              </div>
            </div>
          )}

          {/* KONTEN TAB: PENEMUAN */}
          {activeTab === 'penemuan' && (
            <div className="tab-pane">
              <h2>Prosedur Pelaporan Penemuan</h2>
              
              <div className="prosedur-step">
                <div className="step-number">1</div>
                <div className="step-text">
                  <h3>Amankan Barang di Lokasi</h3>
                  <p>Jika Anda menemukan barang tertinggal, amankan barang tersebut. Pastikan barang dalam kondisi utuh dan tidak ada barang berharga (seperti uang) yang berkurang.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">2</div>
                <div className="step-text">
                  <h3>Isi Formulir Penemuan beserta Bukti Foto</h3>
                  <p>Akses menu "Form Penemuan". Masukkan identitas Anda sebagai penemu, tuliskan ciri-ciri fisik barang, lokasi penemuan, dan <b>wajib mengunggah foto</b> barang tersebut dengan jelas.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">3</div>
                <div className="step-text">
                  <h3>Serahkan Fisik Barang ke Pos Satpam / LPPI</h3>
                  <p>Sangat disarankan untuk segera menyerahkan fisik barang berharga (dompet, laptop, dokumen penting) ke Pos Satpam terdekat atau pihak berwenang di kampus untuk menghindari risiko tanggung jawab.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">4</div>
                <div className="step-text">
                  <h3>Proses Pencocokan oleh Admin</h3>
                  <p>Admin akan mencocokkan data barang temuan Anda dengan laporan kehilangan yang ada. Anda telah membantu sesama sivitas akademika UMY!</p>
                </div>
              </div>
            </div>
          )}

          {/* KONTEN TAB: PENGAMBILAN */}
          {activeTab === 'pengambilan' && (
            <div className="tab-pane">
              <h2>Prosedur Pengambilan Barang</h2>
              
              <div className="prosedur-step">
                <div className="step-number">1</div>
                <div className="step-text">
                  <h3>Konfirmasi Barang Tersedia</h3>
                  <p>Pastikan barang yang Anda maksud memang ada di halaman "List Barang Temuan" dan statusnya belum diklaim oleh orang lain.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">2</div>
                <div className="step-text">
                  <h3>Hubungi Admin via WhatsApp</h3>
                  <p>Hubungi nomor WhatsApp Admin yang tertera pada detail barang untuk melakukan konfirmasi jadwal dan lokasi serah terima barang.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">3</div>
                <div className="step-text">
                  <h3>Bawa Bukti Kepemilikan Sah</h3>
                  <p>Saat pengambilan, <b>wajib membawa Kartu Identitas (KTM/KTP)</b>. Anda juga harus bisa membuktikan kepemilikan, misalnya dengan membuka <i>password</i> HP/Laptop, menyebutkan isi dompet secara spesifik, atau membawa nota pembelian.</p>
                </div>
              </div>
              
              <div className="prosedur-step">
                <div className="step-number">4</div>
                <div className="step-text">
                  <h3>Serah Terima & Penyelesaian Laporan</h3>
                  <p>Setelah kepemilikan terbukti sah, barang akan diserahkan. Admin akan menutup laporan dan memperbarui status barang menjadi "Selesai/Dikembalikan".</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProsedurPage;