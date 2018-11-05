//TODO :use polka?
import express from 'express';
import * as sapper from '../__sapper__/server.js';
import { store } from 'svelte/store.js';

const app = express();
app.use(
    sapper.middleware()
);

export default app;
