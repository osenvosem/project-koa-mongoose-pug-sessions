[English Readme](README.md)

Традиционное CRUD приложение с аутентификацией основанной на сессиях, регистрацией, валидацией данных форм со стороны клиента и сервера, авторизацией, уведомлениями и тестированием.

## [Демонстрация](https://pj-koa-mongoose-pug-sessions.herokuapp.com/)

Или же вы можете скачать проект а запустить его локально. MongoDB должна быть запущена на стандартном порту.

```
clone https://github.com/osenvosem/project-koa-mongoose-pug-sessions
cd project-koa-mongoose-pug-sessions

npm start # если вы используете npm
yarn start # если вы используете yarn
```

## Использованные библиотеки

* [Koa](https://github.com/koajs/koa) — легкий, низкоуровневый фреймворк;
* [Pug](https://github.com/pugjs/pug) — шаблонизатор;
* [MongoDB](https://github.com/mongodb) / [Mongoose](https://github.com/Automattic/mongoose) — документо-ориентированная база данных и ODM для неё;
* [Passport](https://github.com/jaredhanson/passport) — библиотека для аутентификации;
* [Bootstrap](https://github.com/twbs/bootstrap/tree/v4-dev) — CSS фреймворк;
* [Axios](https://github.com/axios/axios) — библиотека для HTTP запросов;
* [Lodash](https://github.com/lodash/lodash) — функциональная утилита для упрощения решения распроненных задач;
* [Moment](https://github.com/moment/moment) — библиотека для работы с датами и временем;
* [Jest](https://github.com/facebook/jest) — фреймворк для тестирования;

> Полный список использованных библиотек смотрите в файле `package.json`;

## Тестирование

```
npm test # если вы используете npm
yarn test # если вы используете yarn
```
