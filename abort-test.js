import http from 'k6/http';
import { sleep } from 'k6';
import execution from 'k6/execution';

export const options = {
  vu: 10,
  duration: '60s',
};

export function setup() {
  let res = http.get('https://test.k6.local/some-page');
  if (res.error) {
    execution.test.abort('Aborting test. Application is down!');
  }
}

export default function (data) {
  http.get('https://test.k6.local/some-page');
  sleep(1);
}
