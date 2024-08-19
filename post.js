import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const body = JSON.stringify({
    username: `test_+${Date.now()}`,
    password: 'test',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let res = http.post('https://test-api.k6.io/user/register/', body, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });
}
