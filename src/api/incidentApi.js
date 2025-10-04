import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Mock API endpoint (replace with your actual backend)
const API_BASE_URL = 'https://api.floodsafe.com/v1';

/**
 * Submit incident report
 * @param {Object} incidentData
 * @returns {Promise<Object>}
 */
export const submitIncidentReport = async (incidentData) => {
  try {
    // Get current user
    const userString = await AsyncStorage.getItem('user');
    const user = JSON.parse(userString);

    // Create incident object
    const incident = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      ...incidentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Store locally
    const incidents = await getLocalIncidents();
    incidents.push(incident);
    await AsyncStorage.setItem('incidents', JSON.stringify(incidents));

    // In production, send to backend
    // await axios.post(`${API_BASE_URL}/incidents`, incident);

    return {
      success: true,
      incident,
    };
  } catch (error) {
    console.error('Submit incident error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get user's incidents
 * @returns {Promise<Array>}
 */
export const getUserIncidents = async () => {
  try {
    const userString = await AsyncStorage.getItem('user');
    const user = JSON.parse(userString);

    const incidents = await getLocalIncidents();
    return incidents.filter(i => i.userId === user.id);
  } catch (error) {
    console.error('Get incidents error:', error);
    return [];
  }
};

/**
 * Get all incidents (for NGOs)
 * @returns {Promise<Array>}
 */
export const getAllIncidents = async () => {
  try {
    return await getLocalIncidents();
  } catch (error) {
    console.error('Get all incidents error:', error);
    return [];
  }
};

/**
 * Get local incidents from AsyncStorage
 * @returns {Promise<Array>}
 */
const getLocalIncidents = async () => {
  try {
    const incidentsString = await AsyncStorage.getItem('incidents');
    return incidentsString ? JSON.parse(incidentsString) : [];
  } catch (error) {
    console.error('Get local incidents error:', error);
    return [];
  }
};

/**
 * Get alerts (mock data)
 * @returns {Promise<Array>}
 */
export const getAlerts = async () => {
  // Mock alerts data
  return [
    {
      id: '1',
      title: 'Heavy Rainfall Warning',
      description: 'Heavy rainfall expected in Mumbai region for next 48 hours. Please stay alert.',
      severity: 'high',
      area: 'Mumbai',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Flood Alert - Kerala',
      description: 'Water levels rising in Periyar river. Residents near riverbanks should evacuate immediately.',
      severity: 'critical',
      area: 'Kerala',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Weather Update',
      description: 'Moderate rainfall expected in Chennai. No immediate threat, but stay prepared.',
      severity: 'medium',
      area: 'Chennai',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

/**
 * Get relief resources (for NGOs)
 * @returns {Promise<Array>}
 */
export const getReliefResources = async () => {
  // Mock relief resources data
  return [
    {
      id: '1',
      name: 'Food Packets',
      quantity: 500,
      unit: 'packets',
      location: 'Warehouse A - Mumbai',
      status: 'available',
    },
    {
      id: '2',
      name: 'Water Bottles',
      quantity: 1000,
      unit: 'bottles',
      location: 'Warehouse B - Pune',
      status: 'available',
    },
    {
      id: '3',
      name: 'Medical Kits',
      quantity: 150,
      unit: 'kits',
      location: 'Warehouse A - Mumbai',
      status: 'available',
    },
    {
      id: '4',
      name: 'Blankets',
      quantity: 300,
      unit: 'pieces',
      location: 'Warehouse C - Nashik',
      status: 'low',
    },
  ];
};

/**
 * Get relief tracking data (blockchain mock)
 * @returns {Promise<Array>}
 */
export const getReliefTracking = async () => {
  // Mock blockchain-based tracking data
  return [
    {
      id: '1',
      transactionHash: '0x1a2b3c4d5e6f7g8h9i0j',
      resourceType: 'Food Packets',
      quantity: 200,
      from: 'Warehouse A',
      to: 'Relief Camp - Bandra',
      status: 'delivered',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      blockNumber: 12345,
    },
    {
      id: '2',
      transactionHash: '0x2b3c4d5e6f7g8h9i0j1k',
      resourceType: 'Water Bottles',
      quantity: 500,
      from: 'Warehouse B',
      to: 'Relief Camp - Andheri',
      status: 'in-transit',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      blockNumber: 12346,
    },
    {
      id: '3',
      transactionHash: '0x3c4d5e6f7g8h9i0j1k2l',
      resourceType: 'Medical Kits',
      quantity: 50,
      from: 'Warehouse A',
      to: 'Relief Camp - Kurla',
      status: 'pending',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      blockNumber: null,
    },
  ];
};

/**
 * Update incident status (for NGOs)
 * @param {string} incidentId
 * @param {string} status
 * @returns {Promise<Object>}
 */
export const updateIncidentStatus = async (incidentId, status) => {
  try {
    const incidents = await getLocalIncidents();
    const index = incidents.findIndex(i => i.id === incidentId);
    
    if (index !== -1) {
      incidents[index].status = status;
      incidents[index].updatedAt = new Date().toISOString();
      await AsyncStorage.setItem('incidents', JSON.stringify(incidents));
      
      return {
        success: true,
        incident: incidents[index],
      };
    }
    
    return {
      success: false,
      error: 'Incident not found',
    };
  } catch (error) {
    console.error('Update incident error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
