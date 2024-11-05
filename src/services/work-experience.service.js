import axios from 'axios';
import {authHeader} from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class WorkExperienceService {

    addWorkExperience(payload) {
        return axios.post(API_URL + 'work-experiences', payload, { headers: authHeader() });
    }

    getUserWorkExperiences() {
        return axios.get(API_URL + 'work-experiences', { headers: authHeader() });
    }

    deleteWorkExperience(id) {
        return axios.delete(API_URL + 'work-experiences/' + id, { headers: authHeader() });
    }

    updateWorkExperience(id, payload) {
        return axios.put(API_URL + 'work-experiences/' + id, payload, { headers: authHeader() });
    }
    
}

export default new WorkExperienceService();