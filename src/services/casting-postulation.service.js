import axios from 'axios';
import { authHeader, authHeaderMultipartFormData } from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;
class CastingPostulationService {

    async createCastingPostulation(formId, postulationData, postulationCv, postulationPhotos) {
        const formData = new FormData();

        const postulationDataString = JSON.stringify(postulationData);
        formData.append('postulation_data', postulationDataString);
        formData.append('form_id', formId);

        if (postulationCv) {
            formData.append('postulation_cv_file', postulationCv.file, postulationCv.fileName);
        }

        for (var photo of postulationPhotos) {
           formData.append('postulation_photos', photo.file, photo.fileName)
        }

        return axios
        .post(API_URL + 'casting-postulations', formData, {
            headers: authHeaderMultipartFormData()
        })
        .then(response => {
            return response.data;
        });
    }

    async getCastingPostulationById(postulationId) {
        return axios.get(API_URL + 'casting-postulations/' + postulationId,  { headers: authHeader() });
    }

    async getUserCastingPostulations() {
        return axios.get(API_URL + 'casting-postulations',  { headers: authHeader() });
    }
}

export default new CastingPostulationService();