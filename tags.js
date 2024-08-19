import http from 'k6/http';
import { check } from 'k6';
import { Counter, Trend } from 'k6/metrics';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    'http_req_duration{page:order}': ['p(95)<3000'],
    'http_req_duration{status:200}': ['p(95)<1000'],
    'http_req_duration{status:201}': ['p(95)<1000'],
    http_errors: ['count==0'],
    'http_errors{page:order}': ['count==0'],
    checks: ['rate>=0.99'],
    'checks{page:order}': ['rate>=0.99'],
  },
};

let httpErrors = new Counter('http_errors');

export default function () {
  http.get('https://run.mocky.io/v3/c22b4c49-dbef-4dd5-9031-47e0b678d04b');

  const delayResponse = http.get(
    'https://run.mocky.io/v3/69c87ecb-9b3b-4e33-bd8d-14946faea7b0?mocky-delay=2000ms',
    {
      tags: {
        page: 'order',
      },
    }
  );

  if (delayResponse.error) {
    httpErrors.add(1, { page: 'order' });
  }

  check(
    delayResponse,
    {
      'status was 201': (r) => r.status === 201,
    },
    { page: 'order' }
  );
}
