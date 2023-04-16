
const errorLog = (...info) => {
	if(process.env.NODE_ENV !== 'test')
		console.error(...info);
};

const infoLog = (...info) => {
	if(process.env.NODE_ENV !== 'test')
		console.log(...info);
};

export { errorLog, infoLog };