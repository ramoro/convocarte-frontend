import axios from 'axios';
import {authHeader} from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class ProjectService {

    createProject(payload) {
        return axios.post(API_URL + 'projects', payload, { headers: authHeader() });
    }

    getUserProjects() {
        return axios.get(API_URL + 'projects', { headers: authHeader() });
    }

    getUserProjectsWithRoles() {
        return axios.get(API_URL + 'projects/with-roles', { headers: authHeader() });
    }

    deleteProject(id) {
        return axios.delete(API_URL + 'projects/' + id, { headers: authHeader() });
    }
    
}

export default new ProjectService();