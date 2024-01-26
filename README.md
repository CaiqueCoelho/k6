### Hot to run
```
k6 run test.js
k6 run --vus 10 --duration 30s test.js
k6 run --vus 100 --duration 30s thresholds.js
k6 run --config options.json script.js
```

### Hot to run for X k6 - Browser
```
export K6_BROWSER_ENABLEd = true
k6 run xk6.js
```