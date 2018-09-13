# Dashboard

### Requirements
- Node 5.x.x (tested on Node 5.12.0)

### Install dependent Node modules
Run ```npm install```

### Start development server
Run ```npm run start``` for build the project and starting development web server.

## Test
### Karma (Unit tests)
Run unit test ```npm run test```. This lookups your ```./src/application/*.spec.ts``` files and, transpiles them and runs them in karma. Run unit test and watch for file changes ```npm run test:watch```. Karma configuration files is located in ```./configs/karma.conf.js```

### Protractor (E2E tests)
* Start development web server with ```npm run start```
* Run e2e tests ```npm run e2e```. This starts protractor and runs e2e test that's specified in ```./config/protractor.conf.js```.

## Lint
Run linting ```npm run lint```,This looks your ```./src/**/*.ts``` files and, lints any typescript/ES2015 rules.
Linting coverage can be done based on your requirements.(like excluding any files).

## Build
(Needs to be complemented) Build and minify javascript file(s) ready for production. Run ```npm run build-prod```.
