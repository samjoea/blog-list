import { Blog } from '../model/blog.js';
import { errorLog } from './logger.js';

const errorHandler = (error, request, response, next) => {
	errorLog('Error: ', error.name);
	if(error.name === 'CastError')
		return response.status(400).send({ error: 'malFormatted id' });
	else if(error.name === 'ValidationError')
		return response.status(400).json({ error: error.message });
	else if(error.name === 'JsonWebTokenError')
		return response.status(401).json({ error: error.message });
	next(error);
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const getTokenFrom = (request, response, next) => {
	const authorization = request.get('authorization');
	if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7);
		next();
	} else {
		next();
	}
};

const userExtractor = async (request, response, next) => {
	const id = request.params.id;
	try {
		const userBlog = await Blog.findById(id);
		if(userBlog) {
			request.user = userBlog.user;
			next();
		} else {
			next();
		}
	} catch (error) {
		next(error);
	}

};


export { errorHandler, unknownEndpoint, getTokenFrom, userExtractor };