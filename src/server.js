import express from 'express';
import * as sapper from '../__sapper__/server.js';
import {Store} from 'svelte/store.js';
import * as admin from 'firebase-admin';

admin.initializeApp();
global.firebase = admin; //used in the components
admin.storage();

const db = admin.firestore();
// Disable deprecated features
db.settings({timestampsInSnapshots: true});

//PRODUCTS
async function products() {
    const querySnapshot = await db.collection('products').get();
    const products = await Promise.all(querySnapshot.docs.map(async (doc) => {
        try {
            //resolve the category references to the categories
            const productData = doc.data();
            if (productData.labels) {
                productData.labels = await Promise.all(
                    productData.labels.map(async categoryRef => (await categoryRef.get()).data())
                );
            } else {
                productData.labels = []
            }
            productData.id = doc.id;
            return productData
        } catch (reason) {
            console.error(`Skipping product ${doc.id}`, {reason});
        }
    }));
    return products;
}

//CATEGORIES
async function categories() {
    const querySnapshot = await db.collection('categories').get();
    const categories = querySnapshot.docs.map(doc => {
        return {'id': doc.id, ...doc.data()}
    });
    return categories;
}

const app = express();
app.use(async (req, res, next) => {
    const accepts = req.headers['accept'];
    if (accepts && accepts.includes('text/html')) {
        req.products = await products();
        req.categories = await categories();
    }
    next();
});

app.use(
    sapper.middleware({
        store: request => {
            return new Store({
                products: request.products,
                categories: request.categories,
            })
        }
    })
);

export default app;
