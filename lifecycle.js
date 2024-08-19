import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vu: 2,
  duration: '10s',
};

console.log('-- init stage --');

export function setup() {
  console.log('-- setup stage --');
  sleep(5);
  const data = {
    foo: 'bar',
  };
  return data;
}

export default function (data) {
  console.log('-- default/VU stage --');
  console.log(data);
  sleep(1);
}

export function teardown(data) {
  console.log('-- teardown stage --');
  console.log(data);
}
