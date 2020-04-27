# continuity-fe-homework

This project runs own faked server with simple DB setup. All actions are persistent, so be aware of that.

By default db runs on [http://localhost:3000/](http://localhost:8080/)
Vue usually [http://localhost:8080/](http://localhost:8080/)

## Used stack

Vuetify, Axios, Typescript with a lot of decorators.
I planned to use [http://rollbar.com](rollbar) for error tracking, but I did not have time for the setup at the end.
Cypress and Jest were included, but not used :( ...

## What about errors?

Simple error 404 will show when manipulating with medium with title: "THIS WILL THROW 404"
Network error can be simulated via chrome network tab (or just shutdown the db server manually)

## Warnings ??

Yes, U will see a bunch of warning during compilation - I tried to solve it but without success. See [https://github.com/webpack/webpack/issues/7378](https://github.com/webpack/webpack/issues/7378)

## Project setup

```
npm install
```

### Run whole project simultaneously

```
npm run serve-both
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and run DB server

```
npm run serve-db
```
