import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  randomIntBetween,
  randomString,
} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 5,
  duration: '5s',
};

export function setup() {
  console.log('BASE_URL:', __ENV.BASE_URL);
}

export default function () {
  const baseUrl = __ENV.BASE_URL;

  const getCrocodiles = http.get(`${baseUrl}/public/crocodiles/`);
  check(getCrocodiles, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(randomIntBetween(1, 5));

  const randomFirstName = randomString(8);
  const credentials = {
    username: `test_${randomFirstName}`,
    password: `secret_${Date.now()}`,
  };

  const body = JSON.stringify(credentials);

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let resRegister = http.post(`${baseUrl}/user/register/`, body, params);

  check(resRegister, {
    'status is 201': (r) => r.status === 201,
  });
}
