/**
 * Service for stylists-related API calls
 */

export interface Stylist {
  id: string;
  name: string;
  email: string;
  image?: string;
  phoneNumber?: string;
}

/**
 * Fetches all available stylists
 */
export async function fetchStylists(): Promise<Stylist[]> {
  try {
    const response = await fetch('/api/stylists');
    
    if (!response.ok) {
      throw new Error('Error loading stylists');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading stylists:', error);
    throw error;
  }
}