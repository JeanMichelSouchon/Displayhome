import express, { Application } from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { errorHandlerMiddleware } from './common/middlewares/errorHandler';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());


// Modules
const usersModule = new UsersModule();
const authModule = new AuthModule();

// Routes
app.use('/auth', authModule.router);
app.use('/users', usersModule.router);


app.use(errorHandlerMiddleware);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

