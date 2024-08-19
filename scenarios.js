import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import exec from 'k6/execution';
import { Counter, Trend } from 'k6/metrics';

export const options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<250'],
    http_req_duration: ['max<400'],
    http_req_failed: ['rate<0.10'],
    http_reqs: ['count>5'],
    http_reqs: ['rate>2'],
    checks: ['rate>=0.90'],
    my_counter: ['count>5'],
    response_time_news_page: ['p(95)<200', 'p(99)<300', 'avg<150', 'med<100'],
    http_errors: ['count==0'],
  },
};

let myCounter = new Counter('my_counter');
let newsPageResponseTrend = new Trend('response_time_news_page');
let httpErrors = new Counter('http_errors');

export default function () {
  const response = http.get(
    'https://test.k6.io/' + (exec.scenario.iterationInTest === 1 ? 'foo' : '')
  );

  myCounter.add(1);

  //console.log(exec.scenario.iterationInTest)

  if (response.error) {
    httpErrors.add(1);
  }

  check(response, {
    'status was 200': (r) => r.status === 200,
    'verify homepage text is correct': (r) =>
      r.body.includes(
        'Collection of simple web-pages suitable for load testing'
      ),
  });
  sleep(1);

  const responseNewsPage = http.get('https://test.k6.io/news.php');
  newsPageResponseTrend.add(responseNewsPage.timings.duration);
  sleep(1);
}
