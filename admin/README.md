#  H&L Admin

The admin portion of the Hoop and Loops website.

## Getting Started

See the [parent README](/) for more details.

```bash
# Start a local instance of admin
firebase use hoop-and-loops #or your firebase project
npm install
npm start
```

## The Technology

* Served/hosted by an [express](https://expressjs.com/) app running in a [Firebase Function](https://firebase.google.com/docs/functions/http-events)
* Design/UI/UX through [semantic-ui](https://semantic-ui.com)
* Custom functionality written with [Old Faithul](https://jquery.com) (jQuery).
* Bundled using the most excellent [webpack.js](https://webpack.js.org).

## Files and Folders

* [./index.js](./index.js) - The firebase function (and express app) which serves the admin site
* [./client.js](./client.js) - The JS which runs in the client and provides all the page interactions, like opening modals, etc.
* [./client.css](./client.css) - The custom styles for the admin page
* [./views/](./views) - The handlebars templates used build the admin view
* [./views/admin.handlebars](./views/admin.handlebars) - The main view that you see after you log in.
* [./views/login.handlebars](./views/login.handlebars) - The login page. The function code delivers this view unless it detects a valid `__session` cookie
* ./semantic/ - The semantic-ui code. Created when you `npm install`. Gets built via a `postinstall` npm hook which does `gulp build`
