# Shoppingwebsite

Angular 22 front end for the Spring Boot shopping backend (expected at `http://localhost:8080/` in development, see `src/environments/environment.development.ts`).

## Requirements

- Node.js `^22.22.3`, `^24.15.0` or `>=26` (Angular 22 requirement)
- macOS 14+ for the default native Sass compiler. On older macOS (e.g. 13 Ventura) the build hangs with
  `VM initialization failed: Current Mac OS X version ... is lower than minimum supported version 14.0`.
  Use the pure-JavaScript Sass compiler instead by setting `NG_BUILD_SASS_EMBEDDED=0`, e.g.
  `NG_BUILD_SASS_EMBEDDED=0 npm start`.

## Development server

Run `npm start` (`ng serve`) and navigate to `http://localhost:4200/`.

## Build

Run `npm run build` (`ng build`). Production output goes to `dist/shoppingwebsite`.

## Running unit tests

Run `npm test` (`ng test`) to execute the unit tests with [Vitest](https://vitest.dev).
