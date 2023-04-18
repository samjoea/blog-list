import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../model/user.js';
import { Router } from 'express';

const loginRouter = Router();

loginRouter.post('/', async(request, response, next) => {
	const { username, password } = request.body;

	try {
		const user = await User.findOne({ username });
		const passwordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false;
		if(!(user && passwordCorrect)) {
			return response.status(401).json({
				error: 'invalid username or password'
			});
		}
		const userForToken = {
			username: user.username,
			id: user._id
		};

		const token = jwt.sign(userForToken, process.env.SECRET);

		response.status(200).send({
			token,
			username: user.username,
			name: user.name
		});

	} catch (error) {
		next(error);
	}
});


export { loginRouter };