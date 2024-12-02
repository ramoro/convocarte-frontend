import axios from 'axios';
import { authHeaderMultipartFormData, authHeader } from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class CastingCallService {

    async createCastingCall(casting, castingPhotos, castingRoles) {
        const formData = new FormData();
        console.log(casting);
        console.log(castingPhotos);
        console.log(castingRoles);

        formData.append('title', casting.title);
        formData.append('description', casting.description);
        formData.append('project_id', casting.project_id);
        formData.append('remuneration_type', casting.remuneration_type);

        for (var photo of castingPhotos) {
            formData.append('casting_call_photos', photo.file, photo.name)
        }

        for (var role of castingRoles) {
            console.log("role stringify", JSON.stringify(role))
            formData.append('casting_roles', JSON.stringify(role))
        }

        return axios
        .post(API_URL + 'casting-calls', formData, {
            headers: authHeaderMultipartFormData()
        })
        .then(response => {
            return response.data;
        });
    }

    async getUserCastingCalls() {
        return axios.get(API_URL + 'casting-calls', { headers: authHeader() });
    }

    async publishCasting(castingId, payload) {
        console.log(payload);
        return axios.patch(API_URL + 'casting-calls/publish/' + castingId, payload,  { headers: authHeader() });
    }

    
}

export default new CastingCallService();