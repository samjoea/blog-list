import { errorLog } from './logger.js';

const errorHandler = (error, request, response, next) => {
	errorLog('Error: ', error.name);
	if(error.name === 'CastError') return response.status(400).send({ error: 'malFormatted id' });
	else if(error.name === 'ValidationError') return response.status(400).json({ error: error.message });

	next(error);
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};


export { errorHandler, unknownEndpoint };