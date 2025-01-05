import axios from 'axios';
import {authHeader} from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class FormService {

    getForm(id) {
        return axios.get(API_URL + 'forms/' + id, { headers: authHeader() });
    }

    updateForm(payload) {
        return axios.put(API_URL + 'forms', payload, { headers: authHeader() });
    }
    
}

export default new FormService();