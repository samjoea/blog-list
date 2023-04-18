import { Router } from 'express';
import { Blog } from '../model/blog.js';
import jwt from 'jsonwebtoken';
import { User } from '../model/user.js';
import { userExtractor } from '../utils/middlewares.js';

const blogRouter = Router();

blogRouter.get('/', async(request, response, next) => {
	try {
		const res = await Blog.find({}).populate('user');
		response.json(res);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/', async(request, response, next) => {
	const body = request.body;
	try {
		const decodedToken = jwt.verify(request.token, process.env.SECRET);
		if(!decodedToken.id) {
			return response.status(401).json({
				error: 'token missing or invalid',
			});
		}
		const userId = decodedToken.id;

		const blog = new Blog({
			title: body.title,
			url: body.url,
			likes: body.likes ? body.likes : 0,
			author: body.author,
			user: userId,
		});
		const newBlog = await blog.save();
		// console.log('IDDD: ', newBlog);

		const user = await User.findById(userId);
		user.blogs = [...user.blogs, newBlog.id];
		await user.save();

		response.status(201).json(newBlog);
	} catch (error) {
		next(error);
	}
});

blogRouter.delete('/:id',  userExtractor, async(request, response, next) => {
	const blogId = request.params.id;
	try {
		const decodedToken = jwt.verify(request.token, process.env.SECRET);
		const userId = decodedToken.id;
		if(!userId) return response.status(401).json({ error: 'token missing or invalid' });
		if(!request.user) return response.status(404).json({ message: 'no content' });
		if(request.user.toString() === userId.toString()) {
			await Blog.findByIdAndRemove(blogId);
			response.status(204).end();
		} else {
			response.status(403).json({  error: 'restricted access' });
		}
	} catch (error) {
		next(error);
	}
});

blogRouter.put('/:id', async(request, response, next) => {
	const blog = request.body;
	const id = request.params.id;
	try {
		const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
			new: true,
			runValidators: true,
			context: 'query',
		});
		response.json(updatedBlog);
	} catch (error) {
		next(error);
	}
});

export { blogRouter };