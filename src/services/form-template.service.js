import axios from 'axios';
import {authHeader} from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class FormTemplateService {

    createFormTemplate(payload) {
        return axios.post(API_URL + 'form-templates', payload, { headers: authHeader() });
    }

    getUserFormTemplates(){
        return axios.get(API_URL + 'form-templates', { headers: authHeader() });
    }
    
}

export default new FormTemplateService();