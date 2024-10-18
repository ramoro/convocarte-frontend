import axios from 'axios';
import {authHeader, authHeaderMultipartFormData} from './auth-header';

const API_URL = 'https://deploy-convocarte-backend-prod.onrender.com/';

class UserService {
    //Este metodo sirve para la verificacion de la cuenta, donde el token se recibe por param.
    getUserByIdWithToken(user_id, token) {
        return axios.get(API_URL + 'users/' + user_id, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        });
    }

    getUserById(user_id) {
        return axios.get(API_URL + 'users/' + user_id, { headers: authHeader() });
    }

    resetPassword(payload) {
        return axios.patch(API_URL + 'users/reset-password', payload);
    }

    startPasswordRecoveringWithEmail(payload) {
        return axios.patch(API_URL + 'users/password-recovering', payload);
    }

    updateCV(formData) {
        console.log(formData);
        return axios.patch(API_URL + 'users/upload-cv', formData, { headers: authHeaderMultipartFormData() });
    }

    updateUserImage(formData) {
        console.log(formData);
        return axios.patch(API_URL + 'users/upload-image', formData, { headers: authHeaderMultipartFormData() });
    }

    //Sector de Estudios/Experiencias Academicas del Usuario
    addAcademicExperience(payload) {
        return axios.post(API_URL + 'users/add-academic-experience', payload, { headers: authHeader() });
    }

    getUserAcademicExperiences() {
        return axios.get(API_URL + 'users/my-academic-experiences', { headers: authHeader() });
    }

    deleteAcademicExperience(id) {
        return axios.delete(API_URL + 'users/delete-academic-experience/' + id, { headers: authHeader() });
    }

    updateAcademicExperience(id, payload) {
        return axios.put(API_URL + 'users/update-academic-experience/' + id, payload, { headers: authHeader() });
    }

    //Sector Experiencia Laboral del Usuario
    addWorkExperience(payload) {
        return axios.post(API_URL + 'users/add-work-experience', payload, { headers: authHeader() });
    }

    getUserWorkExperiences() {
        return axios.get(API_URL + 'users/my-work-experiences', { headers: authHeader() });
    }

    deleteWorkExperience(id) {
        return axios.delete(API_URL + 'users/delete-work-experience/' + id, { headers: authHeader() });
    }

    updateWorkExperience(id, payload) {
        return axios.put(API_URL + 'users/update-work-experience/' + id, payload, { headers: authHeader() });
    }

    updateUserData(id, payload) {
        console.log(API_URL + 'users/' + id)
        console.log(payload)
        return axios.patch(API_URL + 'users/' + id, payload, { headers: authHeader() });
    }

    deleteUserFile(payload) {
        return axios.patch(API_URL + 'users/delete-file', payload, { headers: authHeader() });
    }
    
}

export default new UserService();