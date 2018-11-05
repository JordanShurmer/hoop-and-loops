//TODO :use polka?
import express from 'express';
import * as sapper from '../__sapper__/server.js';
import { Store } from 'svelte/store.js';
import * as admin from 'firebase-admin';

admin.initializeApp();

const app = express();
app.use(
    sapper.middleware({
        store: request => {
            return new Store({
                user: admin.auth().currentUser
            })
        }
    })
);

export default app;
