const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cookieParser = require('cookie-parser');
const express = require('express');
const exphbs = require('express-handlebars');

admin.initializeApp();

const db = admin.firestore();
// Disable deprecated features
db.settings({timestampsInSnapshots: true});

// Express setup
// * handlebars engine
// * cookieParser for the user session
const app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(cookieParser());

// Admin page!
app.get('/admin', (req, res) => {
    const token = req.cookies['__session'] || '';
    admin.auth().verifyIdToken(token)
        .then(decodedIdToken => {
            let products = [];
            db.collection('products').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    products.push(doc.data());
                });
                res.render('admin', {
                    'products': products,
                    'loggedin': true
                });
            });
        })
        .catch(error => {
            res.render('login');
        });
});

exports.app = functions.https.onRequest(app);
