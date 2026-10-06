# Shoppingwebsite

Angular front end for an online shop. It talks to a Spring Boot + PostgreSQL backend
(the `shoppingwebsite` Spring Boot project), which serves the REST API and, in production,
this app's built files.

## What the app does

**Shoppers**
- Browse products, filter them by category, and add or remove items from the cart
  (`/`, `/products`). The cart icon in the navbar shows the current item count.
- Review and change the cart (`/shopping-cart`).
- Sign up or log in with email and password, or with Google (`/signup`, `/login`).
- Check out by entering a shipping address, with address autocomplete (`/check-out`).
  See [Address autocomplete](#address-autocomplete).
- See the order confirmation and past orders (`/order-success/:orderid`, `/my-orders`).

**Admins** (users with `ROLE_ADMIN`)
- List, create, edit and delete products (`/admin/products`, `/admin/products/new`,
  `/admin/products/:productid`).
- See all orders (`/admin/orders`).

Checkout, order and admin pages are protected by route guards (`authGuard`, `adminAuthGuard`).

### How it fits together

| Piece            | Where                                   | Notes |
|------------------|-----------------------------------------|-------|
| REST API calls   | `shoppingwebsite/src/app/springbootservices.service.ts`, `shoppingwebsite/src/app/_services/` | Products, categories, cart, orders, login/signup |
| Auth token       | `shoppingwebsite/src/app/_helpers/JwtInterceptor.ts`     | Adds `Authorization: Bearer <jwt>` to backend requests |
| Google login     | `shoppingwebsite/src/app/login/login.component.ts`       | Redirects to the backend's `/oauth2/authorize/google` |
| Cart id          | browser `localStorage` key `cartId`       | Created on the first "Add to Cart", cleared after an order is placed |
| Data tables      | `shoppingwebsite/src/app/_directives/datatable.directive.ts` | Small wrapper around DataTables 3 for the admin and order lists |

The backend URL comes from the environment files:

| File                                        | Used by                    | `apiUrl` |
|---------------------------------------------|----------------------------|----------|
| `shoppingwebsite/src/environments/environment.development.ts` | `ng serve`, development builds | `http://localhost:8080/` |
| `shoppingwebsite/src/environments/environment.ts`             | production build (`ng build`) | `""` (same origin, served by Spring Boot) |

## Versions

The project is developed and tested with these versions:

| Tool / library        | Version  |
|-----------------------|----------|
| Node.js               | 24.21.0  |
| npm                   | 11.19.0  |
| Angular (core + CLI)  | 22.2.1   |
| TypeScript            | 6.0.3    |
| RxJS                  | 7.8      |
| zone.js               | 0.16     |
| Bootstrap             | 5.3      |
| ng-bootstrap          | 21.0     |
| Font Awesome (free)   | 7.3      |
| DataTables            | 3.1      |
| Vitest (unit tests)   | 5.x      |

Angular 22 requires Node.js `^22.22.3`, `^24.15.0` or `>=26` (also set in `shoppingwebsite/package.json` `engines`).
Check yours with `node -v` and `npm -v`.

### macOS 13 (Ventura) and older

The default Sass compiler needs macOS 14+. On older macOS the build hangs with
`VM initialization failed: Current Mac OS X version ... is lower than minimum supported version 14.0`.
Use the pure-JavaScript Sass compiler instead by setting `NG_BUILD_SASS_EMBEDDED=0`:

```bash
NG_BUILD_SASS_EMBEDDED=0 npm start
NG_BUILD_SASS_EMBEDDED=0 npm run build
```

## Getting started

The Angular project lives in the `shoppingwebsite/` folder. Run all `npm` commands from there:

```bash
cd shoppingwebsite
npm install
npm start
```

`npm start` runs `ng serve`. Open <http://localhost:4200/>. The Spring Boot backend must be
running on `http://localhost:8080/`; see its README for the database and the required
environment variables.

## Build and deploy to Spring Boot

```bash
cd shoppingwebsite
npm run build
```

Production output goes to `shoppingwebsite/dist/shoppingwebsite/`. Spring Boot serves the app from
`shoppingwebsite/src/main/resources/static/`, so copy the **contents** of `shoppingwebsite/dist/shoppingwebsite/browser/`
(not the `browser` folder itself) into that folder, and remove the old build files first.
Run this from the `shoppingwebsite/` folder:

```bash
STATIC=../../../SpringBootApplication/shoppingwebsite/src/main/resources/static   # adjust to your checkout
[ -d "$STATIC" ] && rm -rf "${STATIC:?}"/*
cp -R dist/shoppingwebsite/browser/. "$STATIC"/
cp dist/shoppingwebsite/3rdpartylicenses.txt "$STATIC"/
```

File names contain a content hash (e.g. `main-YLRCGOLY.js`) and change on every build, so
commit the new files together with the updated `index.html`. Otherwise the page loads blank.

## Address autocomplete

On the checkout page, the **Address (Line 1)** field suggests real addresses as you type,
and picking one fills in Line 1, City, State and Zip. Line 2 is left for the user.

It uses these free APIs:

| API | What it's used for | Key needed? |
|-----|--------------------|-------------|
| [Geoapify](https://www.geoapify.com) | Address search, fast (usually under 0.3s). Used when a key is set | Yes, free (3,000 searches/day) |
| [Photon](https://photon.komoot.io) (by komoot, OpenStreetMap data) | Address search when no Geoapify key is set, or when Geoapify fails. Slow: often 3–4s per search | No |
| [Zippopotam.us](https://www.zippopotam.us) | City lookup from the zip code, used only when the address has no city | No |

### Turning on Geoapify (recommended)

Without a key the app works, but uses Photon, which is slow.

1. Sign up at <https://myprojects.geoapify.com/> and create a project. Copy its API key.
2. Put the key in `geoapifyApiKey` in both
   `shoppingwebsite/src/environments/environment.development.ts` and
   `shoppingwebsite/src/environments/environment.ts`.
3. In the Geoapify dashboard, restrict the key to your site's address (e.g. `localhost:4200`,
   `localhost:8080`, your production domain). The key is sent from the browser, so anyone can
   see it; the restriction stops other sites from using up your daily limit.

If the key is wrong or the daily limit is reached, the app automatically falls back to Photon.

### How it works

1. After at least **3 characters** and a **300 ms** pause in typing, the app shows
   "Searching…" next to the label and calls Geoapify (or Photon, if no key is set):
   - `https://api.geoapify.com/v1/geocode/autocomplete?text=<text>&limit=5&lang=en&format=json&apiKey=<key>`
   - `https://photon.komoot.io/api/?q=<text>&limit=5&lang=en&layer=house&layer=street`

   The last 50 searches are cached in memory, so typing the same text again is instant.
2. Each result becomes a suggestion like
   `12972 Steadman Farms Drive, Keller, Texas, 76244, United States`.
3. Some addresses have no city in the map data (common in newer suburbs, e.g. it only knows
   `Tarrant County, Texas, 76244`). For those, the app looks up the city from the zip code:
   `https://api.zippopotam.us/us/76244` → `Keller`. Each zip is looked up once and cached.
4. Selecting a suggestion fills the form fields. Users can also ignore the suggestions and
   type the address by hand.

If either API is down or returns an error, the dropdown just shows fewer or no suggestions;
checkout keeps working.

### Code

| File | Role |
|------|------|
| `shoppingwebsite/src/app/_services/address-autocomplete.service.ts` | Calls Geoapify / Photon and Zippopotam, caches searches, turns results into `AddressSuggestion` objects |
| `shoppingwebsite/src/app/check-out/check-out.component.ts` | `searchAddress` (debounce + search), `onAddressSelect` (fills the form) |
| `shoppingwebsite/src/app/check-out/check-out.component.html` | `ngbTypeahead` from ng-bootstrap on the `addline1` input |

The service sends its requests through `HttpBackend`, which skips the app's HTTP interceptors.
That keeps the user's JWT from being sent to these third-party APIs.

### Trying the APIs with curl

```bash
curl 'https://photon.komoot.io/api/?q=12972%20Steadman%20Farms%20Drive&limit=5&lang=en&layer=house&layer=street'
curl 'https://api.zippopotam.us/us/76244'
```

### Limits

- Suggestions are worldwide, not limited to one country.
- The city from a zip code is the postal (mailing) city. For a zip that covers several towns,
  it is the main one.
- The Zip input is `type="number"`, so postcodes with letters (Canada, UK) don't fit.
- Geoapify's free tier allows 3,000 searches per day. Photon is a free public service with
  fair-use limits. For heavy production traffic, use a paid Geoapify plan or host your own Photon.

## Running unit tests

From the `shoppingwebsite/` folder, run `npm test` (`ng test`) to execute the unit tests with [Vitest](https://vitest.dev).
