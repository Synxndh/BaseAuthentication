import authRouter from './auth';

const router = (app): void => {
    app.use('/api/jwt/', authRouter);
};

export default router;
