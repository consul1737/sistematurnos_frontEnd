# TurnosApp

## tareas

La idea es ver los proximos temas a resolver

- [ ] session de whatsapp
- [ ] login o singup con JWT
- [ ] input password que el ojito que te deja ver
- [ ] ver opciones para que pueda recuperar la contraseña
- [ ] ver la posibilidad de validad el mail pra poder comunicarse por alli
- [ ] login con diferentes redes sociales
- [ ] ver colores theme light y theme dark
- [ ] tratar de ver el diseño en general de app
- [ ] boton agregar consultorios(y pensando en una peluqueria o otra actividad que sea posible elegir si consultorio u otras cosas segun el caso)
- [ ] turnos que no aparecen los apellidos

  **Ideas para mejorar el desarrollo y mantenimiento de la app y el servidor**

- [ ] mejorar la doc y cada cosa que se realice documentar
- [ ] crear un bot para telegram para controlar el servidor pm2

## Vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
pnpm test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm build
pnpm test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
