const STORAGE_KEY = 'pwa-lyrics-scroll-notes';

const StorageService = {
  async loadNotes() {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  },

  async saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },
};

export default StorageService;
