import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReCAPTCHA from "react-google-recaptcha";
import AlertWaspada from './components/AlertWaspada'; 
import './styleUser/FormKehilanganPage.css'; 
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2'; 

const CATEGORIES = [
  { id: '1', name: 'Elektronik' },
  { id: '2', name: 'Dokumen (KTP/KTM)' },
  { id: '3', name: 'Dompet/Tas' },
  { id: '4', name: 'Kunci' },
  { id: '5', name: 'Pakaian' },
  { id: '6', name: 'Lainnya' },
];

const FormKehilanganPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    reporter_name: '',
    reporter_phone: '',
    reporter_status: 'mahasiswa',
    identification_number: '',
    item_name: '',
    category_id: '',
    description: '',
    date_event: '',
    location: '',
  });

  const [errors, setErrors] = useState({});
  
  const [identityRules, setIdentityRules] = useState({
    label: 'NIM',
    subLabel: '(Wajib 11 Digit Angka)',
    placeholder: 'Contoh: 20210140001',
    maxLength: 11,
    minLength: 11,
    inputType: 'numeric'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const status = formData.reporter_status;
    let rules = {};
    switch (status) {
      case 'mahasiswa': rules = { label: 'NIM', subLabel: '(Wajib 11 Digit Angka)', placeholder: 'Contoh: 20210140001', maxLength: 11, minLength: 11, inputType: 'numeric' }; break;
      case 'lainnya': rules = { label: 'NIK KTP', subLabel: '(Wajib 16 Digit Angka)', placeholder: 'Masukkan 16 Digit NIK', maxLength: 16, minLength: 16, inputType: 'numeric' }; break;
      case 'foreign_student': rules = { label: 'Passport Number', subLabel: '(5 - 10 Karakter)', placeholder: 'Enter Passport Number', maxLength: 10, minLength: 5, inputType: 'text' }; break;
      case 'dosen': case 'tendik': rules = { label: 'NIP / NIK Pegawai', subLabel: '(Maksimal 18 Digit Angka)', placeholder: 'Masukkan NIP / NIK Pegawai', maxLength: 18, minLength: 16, inputType: 'numeric' }; break;
      default: rules = { label: 'Nomor Identitas', subLabel: '', placeholder: 'Nomor Identitas', maxLength: 20, minLength: 1, inputType: 'text' };
    }
    setIdentityRules(rules);
    setFormData(prev => ({ ...prev, identification_number: '' }));
    setErrors(prev => ({ ...prev, identification_number: null }));
  }, [formData.reporter_status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'identification_number') {
        if (identityRules.inputType === 'numeric') {
            setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    } else if (name === 'reporter_phone') {
        setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else if (name === 'reporter_name') {
        setFormData({ ...formData, [name]: value.replace(/[^a-zA-Z\s]/g, '') });
    } else {
        setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: null });
    if (submitError) setSubmitError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        setErrors(prev => ({ ...prev, item_image: 'Ukuran file terlalu besar. Maksimal 2MB.' }));
        clearFile(); return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      if (errors.item_image) setErrors(prev => ({ ...prev, item_image: null }));
    }
  };

  const clearFile = () => {
    setImageFile(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
    if (value && errors.recaptcha) setErrors(prev => ({ ...prev, recaptcha: null }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.reporter_name) newErrors.reporter_name = "Nama wajib diisi.";
      if (!formData.reporter_phone) {
          newErrors.reporter_phone = "Nomor WhatsApp wajib diisi.";
      } else {
          if (!formData.reporter_phone.startsWith('08')) newErrors.reporter_phone = "Wajib diawali '08'.";
          else if (formData.reporter_phone.length < 10) newErrors.reporter_phone = "Nomor terlalu pendek (Min 10).";
          else if (formData.reporter_phone.length > 13) newErrors.reporter_phone = "Nomor terlalu panjang (Max 13).";
      }
      if (!formData.identification_number) {
          newErrors.identification_number = `${identityRules.label} wajib diisi.`;
      } else {
          const len = formData.identification_number.length;
          if (formData.reporter_status === 'mahasiswa' && len !== 11) newErrors.identification_number = `NIM wajib 11 digit.`;
          else if (formData.reporter_status === 'lainnya' && len !== 16) newErrors.identification_number = `NIK KTP wajib 16 digit.`;
          else if (formData.reporter_status === 'foreign_student' && len < 5) newErrors.identification_number = `Passport Number minimal 5 karakter.`;
      }
    } else if (step === 2) {
      if (!formData.category_id) newErrors.category_id = "Pilih kategori barang.";
      if (!formData.item_name) newErrors.item_name = "Nama barang wajib diisi.";
      if (!formData.description) newErrors.description = "Deskripsi wajib diisi.";
      if (!formData.date_event) newErrors.date_event = "Tanggal wajib diisi.";
      if (!formData.location) newErrors.location = "Lokasi wajib diisi.";
    } else if (step === 3) {
      if (!captchaValue) newErrors.recaptcha = "Mohon centang kotak konfirmasi di atas.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const firstError = document.querySelector('.error-text');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
        title: 'Batalkan Laporan?',
        text: "Data yang sudah Anda isi akan hilang.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Ya, Batalkan',
        cancelButtonText: 'Tidak'
    });
    if (result.isConfirmed) navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateStep(3)) {
      setTimeout(() => {
        const firstError = document.querySelector('.error-text');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'Kirim Laporan Kehilangan?',
      text: "Pastikan data diri dan ciri-ciri barang sudah benar.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#065F46',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Kirim',
      cancelButtonText: 'Cek Kembali'
    });

    if (!confirmResult.isConfirmed) return;

    setLoading(true);
    const payload = new FormData();
    Object.keys(formData).forEach(key => payload.append(key, formData[key]));
    payload.append('type', 'lost');
    if (imageFile) payload.append('item_image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/api/reports', { method: 'POST', body: payload });
      const result = await response.json();
      
      if (result.success || response.ok) {
        setShowSuccessModal(true);
      } else {
        setSubmitError(result.message || 'Gagal menyimpan data.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setSubmitError('Terjadi kesalahan koneksi. Pastikan sistem Backend menyala.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <Navbar />
      <div className="form-header">
        <h1>Lapor Kehilangan Barang</h1>
        <p>Laporkan barang yang hilang di area kampus UMY.</p>
      </div>

      <main>
        <div className="form-card">
          <div className="stepper-container">
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-circle">1</div>
              <span className="step-label">Identitas</span>
            </div>
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span className="step-label">Barang</span>
            </div>
            <div className={`step-indicator ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span className="step-label">Konfirmasi</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <p className="text-red-700 font-bold">{submitError}</p>
              </div>
            )}

            {currentStep === 1 && (
              <div className="step-content">
                <h2 className="form-section-title">Identitas Pelapor</h2>
                
                <div className="input-group">
                  <label className="form-label">Nama Lengkap<span className="required-star">*</span></label>
                  <input type="text" name="reporter_name" value={formData.reporter_name} onChange={handleChange} className={`custom-input ${errors.reporter_name ? 'error' : ''}`} placeholder="Masukkan nama lengkap Anda" />
                  {errors.reporter_name && <p className="error-text">{errors.reporter_name}</p>}
                </div>

                <div className="input-group">
                  <label className="form-label">Nomor WhatsApp<span className="required-star">*</span></label>
                  <input type="tel" name="reporter_phone" value={formData.reporter_phone} onChange={handleChange} className={`custom-input ${errors.reporter_phone ? 'error' : ''}`} placeholder="Contoh: 08123456789" maxLength="13" />
                  {errors.reporter_phone && <p className="error-text">{errors.reporter_phone}</p>}
                </div>

                <div className="input-group">
                  <label className="form-label">Status Pelapor<span className="required-star">*</span></label>
                  <div className="status-box">
                    {['mahasiswa', 'dosen', 'tendik', 'foreign_student', 'lainnya'].map((status) => (
                      <label key={status}>
                        <input type="radio" name="reporter_status" value={status} checked={formData.reporter_status === status} onChange={handleChange}/>
                        <span>{status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label">{identityRules.label}<span className="required-star">*</span> <span className="sub-label">{identityRules.subLabel}</span></label>
                  <input type={identityRules.inputType === 'numeric' ? 'tel' : 'text'} name="identification_number" value={formData.identification_number} onChange={handleChange} className={`custom-input ${errors.identification_number ? 'error' : ''}`} placeholder={identityRules.placeholder} maxLength={identityRules.maxLength} />
                  {errors.identification_number && <p className="error-text">{errors.identification_number}</p>}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h2 className="form-section-title">Data Barang Hilang</h2>

                <div className="input-group">
                  <label className="form-label">Kategori Barang<span className="required-star">*</span></label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} className={`custom-select ${errors.category_id ? 'error' : ''}`}>
                    <option value="" disabled>Pilih Kategori Barang</option>
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                  {errors.category_id && <p className="error-text">{errors.category_id}</p>}
                </div>

                <div className="input-group">
                  <label className="form-label">Nama Barang<span className="required-star">*</span></label>
                  <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} className={`custom-input ${errors.item_name ? 'error' : ''}`} placeholder="Contoh: Dompet kulit coklat" />
                  {errors.item_name && <p className="error-text">{errors.item_name}</p>}
                </div>

                <div className="input-group">
                  <label className="form-label">Deskripsi Detail<span className="required-star">*</span></label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className={`custom-textarea ${errors.description ? 'error' : ''}`} placeholder="Jelaskan ciri-ciri khusus barang yang hilang..."></textarea>
                  {errors.description && <p className="error-text">{errors.description}</p>}
                </div>

                <div className="two-col">
                  <div className="input-group">
                    <label className="form-label">Tanggal Kehilangan<span className="required-star">*</span></label>
                    <input type="date" name="date_event" max={new Date().toISOString().split("T")[0]} value={formData.date_event} onChange={handleChange} className={`custom-input ${errors.date_event ? 'error' : ''}`}/>
                    {errors.date_event && <p className="error-text">{errors.date_event}</p>}
                  </div>
                  <div className="input-group">
                    <label className="form-label">Lokasi Kehilangan<span className="required-star">*</span></label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className={`custom-input ${errors.location ? 'error' : ''}`} placeholder="Contoh: Gedung AR Fachruddin" />
                    {errors.location && <p className="error-text">{errors.location}</p>}
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label">Foto Barang <span className="sub-label">(Opsional)</span></label>
                  <div className={`upload-box ${errors.item_image ? 'error' : ''}`} onClick={() => !imagePreview && fileInputRef.current.click()}>
                    <input ref={fileInputRef} type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    {!imagePreview ? (
                      <div>
                        <PhotoIcon style={{width: 36, color: '#9ca3af', margin:'0 auto'}} />
                        <p>Klik untuk unggah foto referensi (Max 2MB)</p>
                      </div>
                    ) : (
                      <div style={{position:'relative', display: 'inline-block'}}>
                        <img src={imagePreview} alt="Preview" style={{maxWidth:'100%', maxHeight: '200px', borderRadius: 8}} />
                        <button type="button" onClick={(e) => { e.stopPropagation(); clearFile(); }} className="btn-cancel" style={{position:'absolute', top: -10, right: -10, padding: 4, borderRadius: '50%'}}>
                          <XMarkIcon width={20} />
                        </button>
                      </div>
                    )}
                  </div>
                  {errors.item_image && <p className="error-text">{errors.item_image}</p>}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <h2 className="form-section-title">Konfirmasi Keamanan</h2>
                <div className="input-group">
                  <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} />
                  {errors.recaptcha && <p className="error-text">{errors.recaptcha}</p>}
                </div>
                <AlertWaspada />
              </div>
            )}

            <div className="button-row">
              {currentStep === 1 ? (
                <button type="button" onClick={handleCancel} className="btn-cancel">Batalkan Laporan</button>
              ) : (
                <button type="button" onClick={handlePrev} className="btn-secondary">Kembali</button>
              )}
              
              <div className="btn-nav-group">
                {currentStep < 3 && (
                  <button type="button" onClick={handleNext} className="btn-primary">Selanjutnya</button>
                )}
                {currentStep === 3 && (
                  <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Mengirim...' : 'Kirim Laporan'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      {showSuccessModal && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-icon"><CheckCircleIcon width={48} /></div>
            <h3>Laporan Terkirim!</h3>
            <p>Data Anda berhasil disimpan dan akan segera ditinjau oleh Admin.</p>
            <div className="popup-buttons">
              <button onClick={() => navigate('/list-kehilangan')} className="popup-primary">Lihat Daftar Barang</button>
              <button onClick={() => navigate('/')} className="popup-secondary">Kembali ke Beranda</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FormKehilanganPage;