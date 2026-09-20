import React, { useState } from 'react';
import { logoutAdmin, createEvent, createLecture } from '../services/adminService';
import './AdminDashboard.css';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('doubts');
  
  const handleLogout = async () => {
    await logoutAdmin();
    if (onLogout) onLogout();
  };

  return (
    <div className="page admin-dashboard">
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Topbar */}
        <div className="admin-dash__topbar">
          <div className="admin-dash__title-wrap">
            <span className="admin-dash__badge">Authorized</span>
            <h1 className="admin-dash__title">JYC Tech Admin</h1>
          </div>
          <button onClick={handleLogout} className="admin-dash__logout">
            End Session
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-dash__tabs">
          <button 
            className={`admin-dash__tab ${activeTab === 'doubts' ? 'admin-dash__tab--active' : ''}`}
            onClick={() => setActiveTab('doubts')}
          >
            Doubts & Mentorship
          </button>
          <button 
            className={`admin-dash__tab ${activeTab === 'events' ? 'admin-dash__tab--active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Event Manager
          </button>
          <button 
            className={`admin-dash__tab ${activeTab === 'lectures' ? 'admin-dash__tab--active' : ''}`}
            onClick={() => setActiveTab('lectures')}
          >
            Lecture Publisher
          </button>
        </div>

        {/* Panels */}
        <div className="admin-dash__panel">
          {activeTab === 'doubts' && <DoubtsPanel />}
          {activeTab === 'events' && <EventsPanel />}
          {activeTab === 'lectures' && <LecturesPanel />}
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// DOUBTS PANEL
// -------------------------------------------------------------
function DoubtsPanel() {
  return (
    <div>
      <h2 className="admin-section-title">Community Doubts Workspace</h2>
      <div className="admin-toolbar">
        <a 
          href="https://docs.google.com/spreadsheets/d/10J4gAOhg6RLd5c5rhFhJWsxiveMF3ygBahZ8oI2nN0U/edit?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="admin-toolbar__btn"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open Spreadsheet in New Tab
        </a>
      </div>
      
      <div className="admin-sheets-embed">
        <iframe 
          src="https://docs.google.com/spreadsheets/d/10J4gAOhg6RLd5c5rhFhJWsxiveMF3ygBahZ8oI2nN0U/htmlembed?widget=true&headers=false"
          title="Doubts Spreadsheet"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// EVENTS PANEL
// -------------------------------------------------------------
function EventsPanel() {
  const [formData, setFormData] = useState({
    title: '', category: 'Hackathon', status: 'Upcoming', 
    date: '', time: '', location: '', registrationUrl: '', description: '', tags: ''
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    const res = await createEvent({
      ...formData,
      tags: tagsArray
    }, bannerFile);

    setLoading(false);
    if (!res.error) {
      setSuccessMsg('Event created successfully!');
      setFormData({
        title: '', category: 'Hackathon', status: 'Upcoming', 
        date: '', time: '', location: '', registrationUrl: '', description: '', tags: ''
      });
      setBannerFile(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <h2 className="admin-section-title">Create New Event</h2>
      
      {successMsg && (
        <div className="admin-success-toast" style={{ marginBottom: '20px' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      <form className="admin-form" onSubmit={handleCreate}>
        
        <div className="admin-form__row">
          <div className="admin-form__group">
            <label className="admin-form__label">Event Title</label>
            <input className="admin-form__input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Hack-a-Sol 3.0" />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__group">
            <label className="admin-form__label">Category</label>
            <select className="admin-form__select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Guest Lecture">Guest Lecture</option>
              <option value="Tech Fest">Tech Fest</option>
            </select>
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Status</label>
            <select className="admin-form__select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="Upcoming">Upcoming</option>
              <option value="Past">Past</option>
            </select>
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__group">
            <label className="admin-form__label">Date</label>
            <input className="admin-form__input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="e.g. Nov 15, 2026" />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Time</label>
            <input className="admin-form__input" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} placeholder="e.g. 10:00 AM - 5:00 PM" />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__group">
            <label className="admin-form__label">Location</label>
            <input className="admin-form__input" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. J128 LT" />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Registration URL</label>
            <input className="admin-form__input" value={formData.registrationUrl} onChange={e => setFormData({...formData, registrationUrl: e.target.value})} placeholder="https://..." />
          </div>
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Description</label>
          <textarea className="admin-form__textarea" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Short description of the event..." />
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Tags (comma-separated)</label>
          <input className="admin-form__input" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="web, hackathon, prize" />
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Banner Image</label>
          <label className={`admin-upload-zone ${bannerFile ? 'admin-upload-zone--has-file' : ''}`}>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setBannerFile(e.target.files[0])} />
            {bannerFile ? bannerFile.name : 'Click to select an image...'}
          </label>
        </div>

        <button type="submit" className="admin-form__submit" disabled={loading}>
          {loading ? 'Creating...' : 'Publish Event'}
        </button>

      </form>
    </div>
  );
}

// -------------------------------------------------------------
// LECTURES PANEL
// -------------------------------------------------------------
function LecturesPanel() {
  const [formData, setFormData] = useState({
    title: '', speaker: '', speakerRole: '', date: '', category: 'Web', 
    duration: '', videoUrl: '', description: '', tags: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    let youtubeId = '';
    let finalVideoUrl = formData.videoUrl;

    if (finalVideoUrl.includes('youtube.com/watch?v=')) {
      youtubeId = finalVideoUrl.split('v=')[1].split('&')[0];
    } else if (finalVideoUrl.includes('youtu.be/')) {
      youtubeId = finalVideoUrl.split('youtu.be/')[1].split('?')[0];
    } else if (finalVideoUrl.length === 11 && !finalVideoUrl.includes('://')) {
      youtubeId = finalVideoUrl;
    }

    if (youtubeId) {
      finalVideoUrl = ''; // We use youtubeId instead
    }

    const res = await createLecture({
      ...formData,
      videoUrl: finalVideoUrl,
      youtubeId,
      tags: tagsArray
    }, thumbnailFile);

    setLoading(false);
    if (!res.error) {
      setSuccessMsg('Lecture published successfully!');
      setFormData({
        title: '', speaker: '', speakerRole: '', date: '', category: 'Web', 
        duration: '', videoUrl: '', description: '', tags: ''
      });
      setThumbnailFile(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <h2 className="admin-section-title">Publish Lecture</h2>
      
      {successMsg && (
        <div className="admin-success-toast" style={{ marginBottom: '20px' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      <form className="admin-form" onSubmit={handleCreate}>
        
        <div className="admin-form__row">
          <div className="admin-form__group">
            <label className="admin-form__label">Lecture Title</label>
            <input className="admin-form__input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Intro to Docker" />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__group">
            <label className="admin-form__label">Speaker Name</label>
            <input className="admin-form__input" required value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} placeholder="e.g. Sneha Rathi" />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Speaker Role / Info</label>
            <input className="admin-form__input" value={formData.speakerRole} onChange={e => setFormData({...formData, speakerRole: e.target.value})} placeholder="e.g. VP Infrastructure" />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__group">
            <label className="admin-form__label">Date (ISO format)</label>
            <input className="admin-form__input" required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Category</label>
            <select className="admin-form__select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Web">Web</option>
              <option value="Systems">Systems</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Career">Career</option>
            </select>
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__group">
            <label className="admin-form__label">Video URL (Drive or YouTube)</label>
            <input className="admin-form__input" required value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} placeholder="e.g. Google Drive link or YouTube URL" />
          </div>
          <div className="admin-form__group">
            <label className="admin-form__label">Duration</label>
            <input className="admin-form__input" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 1h 20m" />
          </div>
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Description</label>
          <textarea className="admin-form__textarea" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What was covered in this session?" />
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Tags (comma-separated)</label>
          <input className="admin-form__input" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="docker, devops, containers" />
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Thumbnail Image (Optional)</label>
          <label className={`admin-upload-zone ${thumbnailFile ? 'admin-upload-zone--has-file' : ''}`}>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setThumbnailFile(e.target.files[0])} />
            {thumbnailFile ? thumbnailFile.name : 'Click to select a thumbnail...'}
          </label>
        </div>

        <button type="submit" className="admin-form__submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Lecture'}
        </button>

      </form>
    </div>
  );
}
