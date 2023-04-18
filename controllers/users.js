import { Router } from 'express';
import { User } from '../model/user.js';
import bcrypt from 'bcrypt';

const userRouter = Router();

userRouter.get('/', async(request, response, next) => {
	try {
		const users = await User.find({}).populate('blogs');
		response.json(users);
	} catch (error) {
		next(error);
	}
});

userRouter.post('/', async(request, response, next) => {
	const { name, username, password } = request.body;
	if(!password || password.length < 3) {
		return response.status(400).json({
			error: 'password field required and must be at least 3 characters long'
		});
	}
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		name,
		username,
		passwordHash
	});

	try {
		const savedUser = await user.save();
		response.status(201).json(savedUser);
	} catch (error) {
		next(error);
	}
});

export { userRouter };