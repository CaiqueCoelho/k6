import { check } from 'k6';
import http from 'k6/http';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function () {
  let res = http.get('https://test-api.k6.io/public/crocodiles');

  const crododiles = res.json();
  console.log(crododiles);

  const crocodilesIds = crododiles.map((c) => c.id);
  const randomCrocodileId = randomItem(crocodilesIds);
  const crocodileName = crododiles.find((c) => c.id == randomCrocodileId).name;
  console.log('crocodileName', crocodileName);
  res = http.get(
    `https://test-api.k6.io/public/crocodiles/${randomCrocodileId}`
  );

  // console.log(res.headers.Allow);
  // console.log(res.headers['Content-Type']);

  console.log('crocodileNameGet', res.json().name);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'Crocodile name is the same': (r) => r.json().name.includes(crocodileName),
    'Crocodile id is 1': (r) => r.json().id == randomCrocodileId,
  });
}
