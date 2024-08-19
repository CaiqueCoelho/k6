import { check } from 'k6';
import http from 'k6/http';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';

const userCredentials = new SharedArray('users credentials', function () {
  return papaparse.parse(open('./users.csv'), {
    header: true,
  }).data;
});

export function setup() {
  console.log('userCredentials', userCredentials);
}

const baseUrl = __ENV.BASE_URL;
const register = false;
const login = true;

const params = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default function () {
  if (register) {
    userCredentials.forEach((user) => {
      console.log(user);
      const credentials = { username: user.username, password: user.password };

      const body = JSON.stringify(credentials);

      let resRegister = http.post(`${baseUrl}/user/register/`, body, params);

      check(resRegister, {
        'status is 201': (r) => r.status === 201,
      });
    });
  }

  const randomCredential = randomItem(userCredentials);
  const body = JSON.stringify(randomCredential);

  let resLogin = http.post(`${baseUrl}/auth/token/login/`, body, params);

  console.log(resLogin.json());

  check(resLogin, {
    'status is 200 for login': (r) => r.status === 200,
    'access token is not empty': (r) => r.json().access !== '',
  });
}
