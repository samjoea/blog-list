import { Router } from 'express';
import { Blog } from '../model/blog.js';

const blogRouter = Router();

blogRouter.get('/', async(request, response, next) => {
	try {
		const res = await Blog.find({});
		response.json(res);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/', async(request, response, next) => {
	if(!request.body.likes) {
		request.body.likes = 0;
	}
	const blog = new Blog(request.body);
	try {
		const newBlog = await blog.save();
		response.status(201).json(newBlog);
	} catch (error) {
		next(error);
	}
});

blogRouter.delete('/:id', async(request, response, next) => {
	try {
		await Blog.findByIdAndRemove(request.params.id);
		response.status(204).end();
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