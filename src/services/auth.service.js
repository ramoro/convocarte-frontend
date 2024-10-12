import axios from 'axios';

const API_URL = 'http://localhost/';

class AuthService {
  login(user) {
    const formData = new FormData();
    formData.append('username', user.email);
    formData.append('password', user.password);

    formData.forEach(x=> console.log(x));
    return axios
      .post(API_URL + 'login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user_registration) {
    return axios.post(API_URL + 'users', {
      fullname: user_registration.fullname,
      email: user_registration.email,
      password: user_registration.password,
      password_confirmation: user_registration.passwordConfirmation
    });
  }
  
}

export default new AuthService();

