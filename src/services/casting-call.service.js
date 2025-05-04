import axios from 'axios';
import { authHeaderMultipartFormData, authHeader } from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class CastingCallService {

    async createCastingCall(casting, castingPhotos, castingRoles) {
        const formData = new FormData();

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

    async updateCastingCall(castingId, casting, deletedPhotos, newCastingPhotos, castingRoles) {
        const formData = new FormData();
 
        formData.append('casting_state', casting.state);
        formData.append('title', casting.title);
        formData.append('description', casting.description);
        formData.append('project_id', casting.project_id);
        formData.append('remuneration_type', casting.remuneration_type);
        formData.append('deleted_casting_call_photos', JSON.stringify(deletedPhotos));

        for (var photo of newCastingPhotos) {
            console.log("Agrega a added_casting_call_photos")
            console.log(photo);
            formData.append('added_casting_call_photos', photo.file, photo.name)
        }

        for (var role of castingRoles) {
            console.log("role stringify", JSON.stringify(role))
            formData.append('casting_roles', JSON.stringify(role))
        }

        return axios
        .patch(API_URL + 'casting-calls/' + castingId, formData, {
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
        return axios.patch(API_URL + 'casting-calls/publish/' + castingId, payload,  { headers: authHeader() });
    }

    async pauseCasting(castingId, payload) {
        return axios.patch(API_URL + 'casting-calls/pause/' + castingId, payload,  { headers: authHeader() });
    }

    async finishCasting(castingId, payload) {
        return axios.patch(API_URL + 'casting-calls/finish/' + castingId, payload,  { headers: authHeader() });
    }
    
    async getCastingCallById(castingId) {
        return axios.get(API_URL + 'casting-calls/' + castingId,  { headers: authHeader() });
    }

    async searchPublishedCastingCalls(payload) {
        return axios.post(API_URL + 'casting-calls/published', payload, { headers: authHeader() });
    }

    async deleteCastingCall(castingId) {
        return axios.delete(API_URL + 'casting-calls/' + castingId, { headers: authHeader() });
    }

    async getCastingCallWithPostulations(castingId) {
        return axios.get(API_URL + 'casting-calls/with-postulations/' + castingId,  { headers: authHeader() });

    }

}

export default new CastingCallService();