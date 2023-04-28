import { AppDataSource } from './data-source';
import * as express from 'express';
import router from './routes';

const app = express();
const port = 3000;

app.use(express.json());

router(app);

AppDataSource.initialize()
    .then(() => console.log('Connect to database done'))
    .catch((error) => console.log('Connect to database error: ' + error));

app.listen(port, () => console.log('App listening on port ' + port));
