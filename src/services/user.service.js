import axios from 'axios';
import {authHeader, authHeaderMultipartFormData} from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
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

    updateCV(cvFile, fileName, oldCVName) {
        const formData = new FormData();
        formData.append('file', cvFile, fileName);
        formData.append('old_file_name', oldCVName);
        return axios.patch(API_URL + 'users/upload-cv', formData, { headers: authHeaderMultipartFormData() });
    }

    updateUserImage(formData) {
        return axios.patch(API_URL + 'users/upload-image', formData, { headers: authHeaderMultipartFormData() });
    }

    updateUserData(id, payload) {
        console.log(API_URL + 'users/' + id)
        console.log(payload)
        return axios.patch(API_URL + 'users/' + id, payload, { headers: authHeader() });
    }

    deleteUserFile(payload) {
        return axios.patch(API_URL + 'users/delete-file', payload, { headers: authHeader() });
    }

    deleteUserAccount(userId) {
        return axios.delete(API_URL + 'users/' + userId, { headers: authHeader() });
    }
    
}

export default new UserService();