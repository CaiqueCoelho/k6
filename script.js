import http from 'k6/http';

export function setup() {
  console.log('setup');
}

export default function () {
  const res = http.get('http://httpbin.test.k6.io/get');
  console.log(JSON.stringify(res));
}

export function teardown(data) {
  console.log('teardown');
}
