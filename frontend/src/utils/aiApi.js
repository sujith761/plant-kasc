import axios from 'axios';

// The AI prediction API URL (Flask server)
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:5001';

const aiApi = axios.create({
  baseURL: AI_API_URL,
  timeout: 30000, // 30s – model inference can be slow
});

/**
 * Upload an image and get a plant disease prediction from the AI model.
 * @param {File} file – The image file to analyse
 * @returns {Promise<Object>} – { success, disease, disease_class, confidence, plant_type, severity, top_predictions, ... }
 */
export const predictDisease = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await aiApi.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with an error
      return {
        success: false,
        error: error.response.data?.error || `Server error (${error.response.status})`,
      };
    }
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
      return {
        success: false,
        error: 'Cannot reach the AI server. Make sure the Flask API is running on ' + AI_API_URL,
      };
    }
    return { success: false, error: error.message };
  }
};

/**
 * Check if the AI API is healthy / reachable.
 */
export const checkAIHealth = async () => {
  try {
    const response = await aiApi.get('/health');
    return response.data;
  } catch {
    return { status: 'unreachable' };
  }
};

/**
 * Get list of supported disease classes from the AI API.
 */
export const getAIClasses = async () => {
  try {
    const response = await aiApi.get('/classes');
    return response.data;
  } catch {
    return { success: false };
  }
};

export default aiApi;
