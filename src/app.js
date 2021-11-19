import cors from 'cors';
import express from 'express';
import auth from './middleware/auth.js';
import signIn from './controllers/signIn.js';
import signUp from './controllers/signUp.js';
import getUserInfo from './controllers/getUserInfo.js';


const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);

app.get('/get-user-info', auth, getUserInfo);

export default app;
