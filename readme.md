# password-manager

This branch uses **better-sqlite3** as it's `session store`.

![build](https://github.com/mrdcvlsc/password-manager/actions/workflows/build.yml/badge.svg)
![tests](https://github.com/mrdcvlsc/password-manager/actions/workflows/tests.yml/badge.svg)

A simple web application for managing and storing password, the **frontend** was created using vanila ***html***, ***css***, and ***javascript***, it supports mobile and desktop view, the **backend** uses ***nodejs*** and ***fastify*** web framework, and for the **database**, sqlite3 is use with the help of ***better-sqlite3***.

> **Warning**

> Since this is a password-manager application where you can store sensitive information, I (the author) **do not claim** that it is a secure & fool proof application, there might be some vulnerabilities that I have missed when implementing this application, I created this project with the intent to learn frontend and backend web development only (_not to make a production grade application_), USE AT YOUR OWN RISK.

-----

**Demo**

Here is a demo of the web-app deployed in heroku. **[See Demo](https://password-manager-demo-app.herokuapp.com/)**.

![web-app-demo-gif](public/image/password-manager-demo-video.gif)

https://password-manager-demo-app.herokuapp.com/

All of the data saved in this demo web-app will be deleted after some time, It is not permanent.

-----

> **Note**

> During development, or when hosting the web application locally; the session cookie's ```secure``` property at line ```52``` of the ```app.js``` file needs to be set to ```false``` in order to enable logging in.

-----

**Algorithms**
- [Encryption of Data](cryptography.md)

-----

**TODO : [CLICK HERE](todo.md)**

-----

**Run Locally**

```shell
git clone https://github.com/mrdcvlsc/password-manager.git
cd password-manager
mv template.env .env
npm install
npm run dev
```

If the `mv` command is not supported in your system,
just rename the `template.env` to `.env` before
running `npm run dev`.