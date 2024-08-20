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

k6 run --http-debug scenarios.js
k6 run --http-debug="full" scenarios.js
k6 run -e BASE_URL="https://test-api.k6.io" --http-debug="full" best-practices.js

### Login locally with K6 Cloud

k6 login cloud --token <K6_TOKEN>

you can get the token in
https://caiquedpfc.grafana.net/a/k6-app/settings/api-token

### Cloud execution

k6 cloud test.js

### Local execution with stream result to cloud

k6 run --out cloud test.js

### Defining VUs and duration in CLI

k6 run --vus 2 --duration 10s test.js

For 1 iteration:
k6 run --vus 10 --duration 30s --iterations 1 test.js

Or
k6 run --u 10 --d 30s --i 10 test.js

### Skip SSL verification

k6 run --insecure-skip-tls-verify test.js

### Exporting k6 result to json

k6 run test.js --summary-export=summary.json
k6 run test.js --out json=full_result.json

### Exit code

Passing with success exit code 0
Failing with exit non-zero code, like 1 or 99

### Run k6 in cloud from jenkins

k6 cloud script.js --token <GRAFANA_TOKEN>

Or just make sure you have a global env secret called K6_CLOUD_TOKEN with the value of your K6 Cloud token from Grafana Stack Token

And make sure you have the project id in the file or as env variable exported
export K6_CLOUD_PROJECT_ID=<YOUR_PROJECT_ID>
