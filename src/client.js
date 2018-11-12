import * as sapper from '../__sapper__/client.js';
import Firebase from 'firebase/app';
import {Store} from 'svelte/store.js';

window.firebase = Firebase;
const db = firebase.firestore();
// Disable deprecated features
db.settings({timestampsInSnapshots: true});

sapper.start({
    target: document.querySelector('#sapper'),
    store: data => {
        // `data` is whatever was in the server-side store
        const store = new Store({
            editing: {
                image: '',
                name: 'New Product',
                labels: [],
                id: 'new',
                price: '',
                description: '',
                newProduct: true,
            },
            ...data
        });
        firebase.auth().onAuthStateChanged(user => {
            console.debug("User auth change", {user});
            store.set({user})
        });
        window.store = store;
        return store;
    }
});
