import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { EVENTS_DATA } from '../data/events';
import { lectures as SEED_LECTURES } from '../data/lectures';

const EVENTS_STORAGE_KEY = 'jyc_events_local';
const LECTURES_STORAGE_KEY = 'jyc_lectures_local';

export const lectureCategories = ['All', 'Systems', 'Web', 'AI/ML', 'DevOps'];

// Admin Auth Functions
export async function loginAdmin(email, password) {
  // Strict barrier: Only allow the official admin email
  if (email.toLowerCase() !== 'jyctech128@gmail.com') {
    return { session: null, user: null, error: 'Unauthorized: Access restricted to official admin only.' };
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.session) {
        return { session: data.session, user: data.user, error: null };
      }
      if (error) return { session: null, user: null, error: error.message };
    } catch (err) {
      console.warn('Supabase auth exception:', err);
      return { session: null, user: null, error: 'Authentication service error.' };
    }
  }

  return { session: null, user: null, error: 'Invalid admin credentials or database not linked.' };
}

export async function logoutAdmin() {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Error signing out of Supabase:', err);
    }
  }
  localStorage.removeItem('jyc_admin_session');
}

export async function getAdminSession() {
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session) return data.session;
    } catch (err) {
      console.warn('Session check error:', err);
    }
  }

  const raw = localStorage.getItem('jyc_admin_session');
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      localStorage.removeItem('jyc_admin_session');
    }
  }
  return null;
}

// Event Poster Image Upload
export async function uploadEventPoster(file) {
  if (!file) return null;

  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `poster-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const { data, error } = await supabase.storage
        .from('event-banners')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('event-banners')
          .getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      }
      console.warn('Storage upload error:', error);
    } catch (err) {
      console.warn('Poster upload failed, falling back to object URL', err);
    }
  }

  // Fallback data URL for local storage demo
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// Events Management
export async function getEvents() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(evt => ({
          ...evt,
          image: evt.image_url || evt.image,
          registrationUrl: evt.registration_url || evt.registrationUrl
        }));
      }
    } catch (e) {
      console.warn('Supabase events fetch error:', e);
    }
  }

  const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(EVENTS_DATA));
    return EVENTS_DATA;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return EVENTS_DATA;
  }
}

export async function createEvent(eventData, bannerFile) {
  const imageUrl = bannerFile ? await uploadEventPoster(bannerFile) : (eventData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80');
  
  const newEvent = {
    id: `evt-${Date.now()}`,
    title: eventData.title,
    category: eventData.category || 'Workshop',
    status: eventData.status || 'Upcoming',
    date: eventData.date,
    time: eventData.time || 'TBA',
    location: eventData.location || 'Main Auditorium',
    description: eventData.description,
    image: imageUrl,
    registrationUrl: eventData.registrationUrl || null,
    tags: Array.isArray(eventData.tags) ? eventData.tags : (eventData.tags ? eventData.tags.split(',').map(t => t.trim()) : []),
    featured: Boolean(eventData.featured),
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    const supabaseEvent = {
      title: newEvent.title,
      category: newEvent.category,
      status: newEvent.status,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description,
      image_url: newEvent.image,
      registration_url: newEvent.registrationUrl,
      tags: newEvent.tags,
      featured: newEvent.featured
    };
    try {
      const { data, error } = await supabase.from('events').insert([supabaseEvent]).select().single();
      if (!error && data) {
        return {
          ...data,
          image: data.image_url,
          registrationUrl: data.registration_url
        };
      }
      console.warn('Supabase event create failed:', error);
    } catch (e) {
      console.warn('Supabase event create exception:', e);
    }
  }

  const existing = await getEvents();
  const updated = [newEvent, ...existing];
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
  return newEvent;
}

export async function deleteEvent(id) {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('events').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase event delete error:', e);
    }
  }

  const existing = await getEvents();
  const updated = existing.filter(e => e.id !== id);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
  return true;
}

// Lectures Management
export async function getLectures() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('lectures').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(lec => {
          const thumbTag = lec.tags?.find(t => t.startsWith('thumb:'));
          const cleanTags = lec.tags?.filter(t => !t.startsWith('thumb:')) || [];
          return {
            ...lec,
            speakerRole: lec.speaker_role || lec.speakerRole,
            videoUrl: lec.video_url || lec.videoUrl,
            youtubeId: lec.youtube_id || lec.youtubeId,
            thumbnail: thumbTag ? thumbTag.replace('thumb:', '') : lec.thumbnail,
            slidesUrl: lec.slides_url || lec.slidesUrl,
            githubUrl: lec.github_url || lec.githubUrl,
            tags: cleanTags
          };
        });
      }
    } catch (e) {
      console.warn('Supabase lectures fetch error:', e);
    }
  }

  const stored = localStorage.getItem(LECTURES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(SEED_LECTURES));
    return SEED_LECTURES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return SEED_LECTURES;
  }
}

export async function createLecture(lectureData, thumbnailFile) {
  let uploadedThumbnailUrl = null;
  if (thumbnailFile) {
    // Reusing the uploadEventPoster function which uploads to the event-banners bucket
    uploadedThumbnailUrl = await uploadEventPoster(thumbnailFile);
  }

  const newLec = {
    id: `lec-${Date.now()}`,
    title: lectureData.title,
    speaker: lectureData.speaker,
    speakerRole: lectureData.speakerRole || 'Core Team Member',
    date: lectureData.date || new Date().toISOString().split('T')[0],
    category: lectureData.category || 'Systems',
    duration: lectureData.duration || '1h 00m',
    description: lectureData.description,
    videoUrl: lectureData.videoUrl || null,
    youtubeId: lectureData.youtubeId || null,
    thumbnail: uploadedThumbnailUrl || null,
    slidesUrl: lectureData.slidesUrl || null,
    githubUrl: lectureData.githubUrl || null,
    tags: Array.isArray(lectureData.tags) ? lectureData.tags : (lectureData.tags ? lectureData.tags.split(',').map(t => t.trim()) : []),
    featured: Boolean(lectureData.featured),
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    if (newLec.thumbnail) {
      newLec.tags.push(`thumb:${newLec.thumbnail}`);
    }

    const supabaseLecture = {
      title: newLec.title,
      speaker: newLec.speaker,
      speaker_role: newLec.speakerRole,
      date: newLec.date,
      category: newLec.category,
      duration: newLec.duration,
      description: newLec.description,
      video_url: newLec.videoUrl,
      youtube_id: newLec.youtubeId,
      slides_url: newLec.slidesUrl,
      github_url: newLec.githubUrl,
      tags: newLec.tags,
      featured: newLec.featured
    };
    try {
      const { data, error } = await supabase.from('lectures').insert([supabaseLecture]).select().single();
      if (!error && data) {
        return {
          ...data,
          speakerRole: data.speaker_role,
          videoUrl: data.video_url,
          youtubeId: data.youtube_id,
          thumbnail: data.thumbnail_url,
          slidesUrl: data.slides_url,
          githubUrl: data.github_url
        };
      }
      console.warn('Supabase lecture create failed:', error);
    } catch (e) {
      console.warn('Supabase lecture create exception:', e);
    }
  }

  const existing = await getLectures();
  const updated = [newLec, ...existing];
  localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(updated));
  return newLec;
}

export async function deleteLecture(id) {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('lectures').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase lecture delete error:', e);
    }
  }

  const existing = await getLectures();
  const updated = existing.filter(l => l.id !== id);
  localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(updated));
  return true;
}
