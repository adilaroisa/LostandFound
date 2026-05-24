import React, { useState } from 'react';
import '../styleAdmin/AdminDashboard.css'; 
import DashboardHome from '../DashboardHome';
import LaporanMasuk from '../LaporanMasuk';
import ActiveItems from '../ListBarang';
import Arsip from '../Arsip';

import { 
    Squares2X2Icon, 
    InboxArrowDownIcon, 
    QueueListIcon, 
    ArchiveBoxIcon 
} from '@heroicons/react/24/solid';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('home'); 

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <DashboardHome />;
            case 'pending': return <LaporanMasuk />;
            case 'active': return <ActiveItems />;   
            case 'archived': return <Arsip />; 
            default: return <DashboardHome />;
        }
    };

    return (
        <div className="admin-layout">
            <div className="sidebar">
                <div className="sidebar-header">
                    <img src="/images/LogoLostFound.png" alt="Logo" className="sidebar-logo"/>
                    <h2>LOST & FOUND<br/><span>ADMIN DASHBOARD</span></h2>
                </div>
                
                <div className={`menu-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                    <Squares2X2Icon style={{ width: '20px', height: '20px', marginRight: '10px' }} /> 
                    Ringkasan
                </div>
                
                <div className={`menu-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                    <InboxArrowDownIcon style={{ width: '20px', height: '20px', marginRight: '10px' }} /> 
                    Laporan Masuk
                </div>

                <div className={`menu-item ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                    <QueueListIcon style={{ width: '20px', height: '20px', marginRight: '10px' }} /> 
                    List Barang
                </div>

                <div className={`menu-item ${activeTab === 'archived' ? 'active' : ''}`} onClick={() => setActiveTab('archived')}>
                    <ArchiveBoxIcon style={{ width: '20px', height: '20px', marginRight: '10px' }} /> 
                    Arsip
                </div>
            </div>
            <div className="content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;