# Consult Patient Vue 3 + TypeScript

A mobile-first patient consultation application built with Vue 3, TypeScript, Vite, Pinia, Vue Router, Vant, Axios, and Socket.IO.

The app covers the patient-side workflow for online medical consultation, including login, health articles, doctor discovery, consultation creation, medicine selection, payments, consultation records, order details, logistics, notifications, and real-time consultation room interactions.

## Features

- Patient authentication with route guards and persisted user state.
- Mobile consultation flows for fast consultation, department selection, illness description, doctor selection, medicine selection, and payment.
- Doctor list and doctor detail pages.
- Consultation room UI with message, action, status, and evaluation components.
- User center with patient profiles, consultation records, and consultation details.
- Medicine order payment, payment result, order detail, and logistics pages.
- Health article and notification modules.
- Axios request wrapper with token injection, business-code handling, and 401 redirection.
- Pinia stores with persisted state.
- Vant component auto-import support.
- SVG icon sprite support.
- Mock API support for selected local development data.
- Unit tests with Vitest and happy-dom.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Vant
- Axios
- Socket.IO Client
- VueUse
- Sass
- Vitest
- ESLint, oxlint, Prettier, Husky, and lint-staged

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- pnpm

This repository includes a `pnpm-lock.yaml`, so pnpm is the recommended package manager.

## Project Setup

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

The Vite dev server is configured to run on port `80` and listen on all hosts.

Build for production:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

Run tests:

```sh
pnpm test
```

Run linting:

```sh
pnpm lint
```

Format source files:

```sh
pnpm format
```

## Environment Variables

The app expects the following Vite environment variables:

```env
VITE_APP_TITLE=Consult Patient
VITE_APP_CALLBACK=http://localhost
```

`VITE_APP_TITLE` is used for the document title and HTML title.

`VITE_APP_CALLBACK` is used by OAuth login and payment callback URLs. It should match the public URL where the app is available. During local development, update it to the actual local or tunneled address if third-party redirects need to reach the app.

## API

The Axios instance is configured in `src/utils/request.ts`.

Default API base URL:

```txt
https://consult-api.itheima.net/
```

Requests automatically include the persisted bearer token when the user is logged in. Business responses are expected to use `code === 10000` for success. A `401` response clears the stored user and redirects to `/login` with the current route as `returnUrl`.

## Main Routes

- `/login` - login page
- `/login/callback` - third-party login callback
- `/home` - home page
- `/article` - health articles
- `/notify` - notifications
- `/user` - user center
- `/user/patient` - patient profiles
- `/user/consult` - consultation records
- `/user/consult/:id` - consultation detail
- `/consult/fast` - fast consultation
- `/consult/doctor` - doctor consultation entry
- `/consult/dep` - department selection
- `/consult/illness` - illness description
- `/consult/medicine` - medicine consultation
- `/consult/choose` - medicine selection
- `/consult/pay` - consultation payment
- `/room` - consultation room
- `/doctorList/:depId` - doctor list
- `/doctorDetail/:id` - doctor detail
- `/medicineDetail/:id` - medicine detail
- `/order/pay` - medicine order payment
- `/order/pay/result` - medicine payment result
- `/order/:id` - order detail
- `/order/logistics/:id` - logistics detail

Routes other than `/login` and `/login/callback` require a stored user token.

## Project Structure

```txt
src/
  assets/              Static images and shared assets
  components/          Shared Vue components
  composables/         Reusable Composition API utilities
  enums/               Shared enum definitions
  icons/               SVG icons grouped by module
  mock/                Vite mock API definitions
  router/              Vue Router configuration and route guards
  services/            API service modules
  stores/              Pinia stores
  styles/              Global SCSS styles
  types/               TypeScript declaration files
  utils/               Request, validation, filter, and helper utilities
  views/               Page-level Vue components
```

## Development Notes

- The alias `@` points to `src`.
- Vant components are auto-resolved through `unplugin-vue-components`.
- SVG files under `src/icons` are registered as an SVG sprite.
- Pinia persisted state is enabled for the user store.
- Mock responses are configured in `src/mock/index.ts` and enabled in `vite.config.ts`.
- Unit tests run in the `happy-dom` environment.

## IDE Recommendation

Use Visual Studio Code with the official Vue extension.

