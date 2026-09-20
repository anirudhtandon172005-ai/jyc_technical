import { getLectures, lectureCategories } from './adminService';

export async function fetchLectures({ category = 'All', searchQuery = '' } = {}) {
  const allLectures = await getLectures();
  let list = [...allLectures];

  if (category && category !== 'All') {
    list = list.filter(lec => lec.category === category);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(lec => 
      lec.title.toLowerCase().includes(q) ||
      lec.speaker.toLowerCase().includes(q) ||
      lec.description.toLowerCase().includes(q) ||
      lec.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function fetchLecturesByCategory() {
  return lectureCategories;
}

export async function fetchLectureById(id) {
  const allLectures = await getLectures();
  return allLectures.find(lec => lec.id === id) || null;
}

// Also export categories for filter UI
export { lectureCategories };