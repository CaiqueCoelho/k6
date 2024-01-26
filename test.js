import http from 'k6/http';
import { check, sleep } from 'k6';

// export const options = {
//   vus: 10,
//   duration: '30s',
// };

export const options = {
  stages: [
    { duration: '3s', target: 20 },
    { duration: '13s', target: 10 },
    { duration: '2s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://test.k6.io');
  check(res, {
    'status was 200': (r) => r.status == 200,
    'verify homepage text': (r) =>
      r.body.includes(
        'Collection of simple web-pages suitable for load testing'
      ),
  });
  sleep(1);
}
