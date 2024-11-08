import axios from 'axios';
import {authHeader} from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class ProjectService {

    createProject(payload) {
        console.log("Projecto enviado", payload)
        return axios.post(API_URL + 'projects', payload, { headers: authHeader() });
    }

    getUserProjects() {
        return axios.get(API_URL + 'projects', { headers: authHeader() });
    }
    
}

export default new ProjectService();