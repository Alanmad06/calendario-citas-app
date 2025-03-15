/**
 * Service for services-related API calls
 */

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

/**
 * Fetches all available services
 */
export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await fetch('/api/services');
    
    if (!response.ok) {
      throw new Error('Error loading services');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading services:', error);
    throw error;
  }
}