import express from 'express';
import cors from 'cors';
import { errorLog, infoLog } from './utils/logger.js';
import { MONGODB_URI } from './utils/config.js';
import mongoose from 'mongoose';
import { blogRouter } from './controllers/blogs.js';
import { errorHandler, unknownEndpoint } from './utils/middlewares.js';

const app = express();

const connectMongoDB = async() => {
	infoLog('connecting to ', MONGODB_URI);
	try {
		await mongoose.connect(MONGODB_URI);
	} catch (error) {
		errorLog(error.message);
	}
};
connectMongoDB();

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

export { app };