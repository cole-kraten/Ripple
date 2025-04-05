/**
 * API utility for making authenticated requests
 */

// Ensure API_BASE_URL ends with /api but not with a trailing slash
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/+$/, '');

/**
 * Join URL parts properly
 * @param {...string} parts - URL parts to join
 * @returns {string} - Joined URL
 */
const joinUrl = (...parts) => {
  return parts.map(part => part.replace(/^\/+|\/+$/g, '')).join('/');
};

/**
 * Get authentication headers for API requests
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * Parse response safely
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} - Parsed response data
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  // If not JSON, get text and try to parse it (in case content-type is wrong)
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Server returned an invalid response');
  }
};

/**
 * Make a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {boolean} authenticated - Whether to include auth headers
 * @returns {Promise<any>} - API response
 */
export const apiGet = async (endpoint, authenticated = true) => {
  try {
    const response = await fetch(joinUrl(API_BASE_URL, endpoint), {
      method: 'GET',
      headers: authenticated ? getAuthHeaders() : { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await parseResponse(response);
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`Error in GET ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {boolean} authenticated - Whether to include auth headers
 * @returns {Promise<any>} - API response
 */
export const apiPost = async (endpoint, body, authenticated = true) => {
  try {
    const response = await fetch(joinUrl(API_BASE_URL, endpoint), {
      method: 'POST',
      headers: authenticated ? getAuthHeaders() : { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });

    const data = await parseResponse(response);
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a PUT request to the API
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @returns {Promise<any>} - API response
 */
export const apiPut = async (endpoint, body) => {
  try {
    const response = await fetch(joinUrl(API_BASE_URL, endpoint), {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(body)
    });

    const data = await parseResponse(response);
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`Error in PUT ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a DELETE request to the API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} - API response
 */
export const apiDelete = async (endpoint) => {
  try {
    const response = await fetch(joinUrl(API_BASE_URL, endpoint), {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    const data = await parseResponse(response);
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`Error in DELETE ${endpoint}:`, error);
    throw error;
  }
}; 