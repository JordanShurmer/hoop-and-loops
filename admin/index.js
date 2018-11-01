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
app.get('/admin', async (req, res) => {
    const token = req.cookies['__session'] || '';
    try {
        const decodedIdToken = await admin.auth().verifyIdToken(token);

        //PRODUCTS
        let querySnapshot = await db.collection('products').get();
        const products = await Promise.all(querySnapshot.docs.map(async (doc) => {
            //resolve the category references to the categories
            const productData = doc.data();
            if (productData.labels) {
                productData.labels = await Promise.all(
                    productData.labels.map(async categoryRef => (await categoryRef.get()).data())
                );
            }
            productData.id = doc.id;
            return productData
        }));

        //CATEGORIES
        querySnapshot = await db.collection('categories').get();
        const categories = querySnapshot.docs.map(doc => {
            return {'id': doc.id, ...doc.data()}
        });

        res.render('admin', {
            'products': products,
            'categories': categories,
            'loggedin': true
        });
    } catch (error) {
        console.error(error);
        res.render('login');
    }
});

exports.app = functions.https.onRequest(app);
