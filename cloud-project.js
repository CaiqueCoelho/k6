import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  randomIntBetween,
  randomString,
} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '60s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  cloud: {
    projectID: '3709628',
  },
  thresholds: {
    http_req_duration: ['p(90)<1250', 'p(95)<1300'],
    checks: ['rate>=0.99'],
  },
};

let baseUrl;

export function setup() {
  baseUrl = __ENV.BASE_URL;
}

export default function () {
  const randomFirstName = randomString(8);

  const credentials = {
    username: `test_${randomFirstName}`,
    password: `secret_${randomFirstName}`,
  };

  const body = JSON.stringify(credentials);

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let resRegister = http.post(
    'https://test-api.k6.io/user/register/',
    body,
    params
  );

  check(resRegister, {
    'status was 201 for registration': (r) => r.status == 201,
    usernema: (r) => r.json().username == credentials.username,
  });

  sleep(randomIntBetween(1, 5));

  let resLogin = http.post(
    'https://test-api.k6.io/auth/token/login/',
    body,
    params
  );

  const accessToken = resLogin.json().access;
  check(resLogin, {
    'status is 200 for login': (r) => r.status === 200,
    'access token is not empty': (r) => accessToken != '',
  });

  params.headers['Authorization'] = `Bearer ${accessToken}`;

  const myCrododiles = http.get(
    'https://test-api.k6.io/my/crocodiles/',
    params
  );

  check(myCrododiles, {
    'status is 200 for my crocodiles': (r) => r.status === 200,
  });

  const crocodileBody = JSON.stringify({
    name: 'Caique',
    sex: 'M',
    date_of_birth: '1996-02-15',
  });

  const postCrocodile = http.post(
    'https://test-api.k6.io/my/crocodiles/',
    crocodileBody,
    params
  );

  check(postCrocodile, {
    'status is 201 for my new crocodile': (r) => r.status === 201,
    'crocodile name is Caique': (r) => r.json().name.includes('Caique'),
    'crocodile sex is Caique': (r) => r.json().sex.includes('M'),
    'crocodile date of birth is 1996-02-15': (r) =>
      r.json().date_of_birth.includes('1996-02-15'),
  });

  const getMyNewCrododile = http.get(
    `https://test-api.k6.io/my/crocodiles/${postCrocodile.json().id}/`,
    (params['tags'] = 'getCrododileById')
  );

  check(getMyNewCrododile, {
    'status is 200 for my new crocodile': (r) => r.status === 200,
    'getting my new crocodile name is Caique': (r) =>
      r.json().name.includes('Caique'),
    'getting my new crocodile sex is M': (r) => r.json().sex.includes('M'),
    'getting my new crocodile date of birth is 1996-02-15': (r) =>
      r.json().date_of_birth.includes('1996-02-15'),
    'crocodile id gettied is the same from the one created': (r) =>
      r.json().id == postCrocodile.json().id,
  });

  const crocodileBodyUpdated = JSON.stringify({
    name: 'Caique Coelho',
    sex: 'M',
    date_of_birth: '1995-02-15',
  });

  const updatedCrododile = http.put(
    `https://test-api.k6.io/my/crocodiles/${postCrocodile.json().id}/`,
    crocodileBodyUpdated,
    (params['tags'] = 'updateCrododileById')
  );

  check(updatedCrododile, {
    'updated crocodile status is 200': (r) => r.status === 200,
    'updated crocodile name is Caique Coelho': (r) =>
      r.json().name.includes(JSON.parse(crocodileBodyUpdated).name),
    'updated crocodile sex is M': (r) =>
      r.json().sex.includes(JSON.parse(crocodileBodyUpdated).sex),
    'updated crocodile date of birth is 1996-02-15': (r) =>
      r
        .json()
        .date_of_birth.includes(JSON.parse(crocodileBodyUpdated).date_of_birth),
    'updated crocodile id is the same from the one created': (r) =>
      r.json().id == postCrocodile.json().id,
  });

  const updatedCrododileWithPatch = http.patch(
    `https://test-api.k6.io/my/crocodiles/${postCrocodile.json().id}/`,
    JSON.stringify({
      sex: 'F',
    }),
    (params['tags'] = 'patchCrododileById')
  );

  check(updatedCrododileWithPatch, {
    'updated crocodile with patch status is 200': (r) => r.status === 200,
    'updated crocodile with patch name is Caique Coelho': (r) =>
      r.json().name.includes(JSON.parse(crocodileBodyUpdated).name),
    'updated crocodile with patch  sex is F': (r) => r.json().sex.includes('F'),
    'updated crocodile date of birth is 1996-02-15': (r) =>
      r
        .json()
        .date_of_birth.includes(JSON.parse(crocodileBodyUpdated).date_of_birth),
    'updated crocodile with patch id is the same from the one created': (r) =>
      r.json().id == postCrocodile.json().id,
  });
}
