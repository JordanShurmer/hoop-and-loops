#  Hoop & Loops

The code which powers the [Hoop and Loops](https://hoop-and-loops.firebaseapp.com/admin) website.

## Getting Started

Start by installing the dependencies. This will install the site dependencies and the [admin](/admin) dependencies.

```bash
npm install
```

Then initialize the firebase integration

```bash
firebase login
firebase use hoops-and-loops  #or your project name
```


To run the server locally:

```bash
#run the site only:
npm start

#run the admin only:
npm run admin
```


## Technology

This website is hosted by [Google Firebase](https://github.com/firebase). The admin website is served via a firebase function (see the [admin README](/admin) for more information on that).

The project is built/bundled with the most excellent [webpack](https://webpack.js.org).

The design of the site uses [semanti-ui](https://semantic-ui.com/).

