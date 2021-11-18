import cors from 'cors';
import express from 'express';
import signIn from './controllers/signIn.js';
import signUp from './controllers/signUp.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);

export default app;
