import axios from 'axios';
import {authHeader, authHeaderMultipartFormData} from './auth-header';

const API_URL = 'http://localhost/';

class UserService {
    //Este metodo sirve para la verificacion de la cuenta, donde el token se recibe por param.
    getUserByIdWithToken(user_id, token) {
        return axios.get(API_URL + 'users/' + user_id, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        });
    }

    resetPassword(payload) {
        return axios.post(API_URL + 'users/reset-password', payload);
    }

    startPasswordRecoveringWithEmail(payload) {
        return axios.post(API_URL + 'users/password-recovering', payload);
    }

    updateProfilePicture(formData) {
        return axios.post(API_URL + 'users/upload-profile-picture', formData, { headers: authHeaderMultipartFormData() });
    }

    //ejemplo a modificar
    getUserByBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }
}

export default new UserService();