import axios from 'axios';
import {authHeader} from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class AcademicExperienceService {

    addAcademicExperience(payload) {
        return axios.post(API_URL + 'academic-experiences', payload, { headers: authHeader() });
    }

    getUserAcademicExperiences() {
        return axios.get(API_URL + 'academic-experiences', { headers: authHeader() });
    }

    deleteAcademicExperience(id) {
        return axios.delete(API_URL + 'academic-experiences/' + id, { headers: authHeader() });
    }

    updateAcademicExperience(id, payload) {
        return axios.put(API_URL + 'academic-experiences/' + id, payload, { headers: authHeader() });
    }
    
}

export default new AcademicExperienceService();