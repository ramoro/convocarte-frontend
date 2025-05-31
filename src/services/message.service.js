import axios from 'axios';
import { authHeaderMultipartFormData, authHeader } from './auth-header';

const API_URL = process.env.VUE_APP_BACKEND_API_URL;

class MessageService {

    async createMessage(content, receiverId, postulationId, messagesFiles, previousMessageId) {
        const formData = new FormData();

        formData.append('content', content);
        formData.append('receiver_id', receiverId);
        formData.append('postulation_id', postulationId);

        //Me aseguro que files sea un array
        const filesArray = Array.isArray(messagesFiles) ? messagesFiles : [];
        filesArray.forEach(file => {
            formData.append('message_files', file);
        });

        if (previousMessageId) {
            formData.append('previous_message_id', previousMessageId);
        }

        return axios
        .post(API_URL + 'messages', formData, {
            headers: authHeaderMultipartFormData()
        })
        .then(response => {
            return response.data;
        });
    }

    async getMessagesByPostulationId(postulationId) {
        return axios
        .get(API_URL + 'messages/' + postulationId, {
            headers: authHeader()
        })
        .then(response => {
            return response.data;
        });
    }

    async updateMessage(payload, messageId) {
        return axios
        .patch(API_URL + 'messages/' + messageId, payload, {
            headers: authHeader()
        })
        .then(response => {
            return response.data;
        });
    }

    async createMessageForManyUsers(messageContent, messagesFiles, 
        postulations, placeholderToReplace) {

        const formData = new FormData();
        const postulationsJSON = JSON.stringify(postulations);

        formData.append('content', messageContent);
        //Postulations es un array de objetos. En principio tiene el id de la postulacion
        //el id del usuario postulado y su nombre
        formData.append('postulations', postulationsJSON);
        formData.append('placeholder_to_replace', placeholderToReplace);

        //Me aseguro que files sea un array
        const filesArray = Array.isArray(messagesFiles) ? messagesFiles : [];
        filesArray.forEach(file => {
            formData.append('message_files', file);
        });

        return axios
        .post(API_URL + 'messages/many-users', formData, {
            headers: authHeaderMultipartFormData()
        })
        .then(response => {
            return response.data;
        });
    }

}

export default new MessageService();