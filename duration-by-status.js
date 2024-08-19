import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<250'],
    'http_req_duration{expected_response:true}': ['p(95)<250'],
    'group_duration{group:::Main page}': ['p(95)<8000'],
    'group_duration{group:::News page}': ['p(95)<6000'],
    'group_duration{group:::Main page::Assets}': ['p(95)<3000'],
  },
};

export default function () {
  group('Main page', function () {
    const res = http.get(
      'https://run.mocky.io/v3/69c87ecb-9b3b-4e33-bd8d-14946faea7b0?mocky-delay=900ms'
    );
    check(res, { 'status is 200': (r) => r.status == 200 });

    group('Assets', function () {
      http.get(
        'https://run.mocky.io/v3/69c87ecb-9b3b-4e33-bd8d-14946faea7b0?mocky-delay=900ms'
      );
      http.get(
        'https://run.mocky.io/v3/69c87ecb-9b3b-4e33-bd8d-14946faea7b0?mocky-delay=900ms'
      );
    });
  });

  group('News page', function () {
    const resNewPage = http.get(
      'https://run.mocky.io/v3/e05fb476-7ff0-4b5f-92f4-f4d774bb863d'
    );

    check(resNewPage, { 'status is 200': (r) => r.status == 200 });
  });
}
