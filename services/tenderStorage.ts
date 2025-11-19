import { SavedTender } from "../types";

const STORAGE_KEY = 'smart_tender_saved_projects';

export const getSavedTenders = (): SavedTender[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from storage", error);
    return [];
  }
};

export const saveTenderToStorage = (tender: SavedTender): SavedTender[] => {
  try {
    const current = getSavedTenders();
    // Check if exists and update, or add new
    const index = current.findIndex(t => t.id === tender.id);
    let updated: SavedTender[];
    
    if (index >= 0) {
      updated = [...current];
      updated[index] = tender;
    } else {
      updated = [tender, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error saving to storage", error);
    return [];
  }
};

export const deleteTenderFromStorage = (id: string): SavedTender[] => {
  try {
    const current = getSavedTenders();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error deleting from storage", error);
    return [];
  }
};