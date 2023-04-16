import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app.js';
import { Blog } from '../model/blog.js';
import { initialBlog } from '../utils/blog_api_helper.js';
import { errorLog } from '../utils/logger.js';

const api = supertest(app);

beforeEach(async () => {
	try {
		await Blog.deleteMany({});
		const promiseArray = initialBlog.map(blog => new Blog(blog).save());
		await Promise.all(promiseArray);
	} catch (error) {
		errorLog(error.message);
	}
});

describe('Blog list tests, step1', () => {
	test('makes HTTP GET request to /api/blogs', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('verifies that blog list returns the correct amount in the JSON format', async () => {
		const res = await api.get('/api/blogs');
		expect(res.body).toHaveLength(initialBlog.length);
	});

});

describe('Blog list tests, step2', () => {
	test('verifies that the unique identifier property of the blog posts is named id', async () => {
		const res = await api.get('/api/blogs');
		expect(res.body[0].id).toBeDefined();
	});
});

describe('Blog list tests, step3', () => {
	test('makes HTTP POST request to /api/blogs', async () => {
		const newBlog = {
			'title': 'States',
			'author': 'Sam',
			'url': 'htpps://www.sam.com',
			'likes': 1245
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAfter = await api.get('/api/blogs');
		expect(blogsAfter.body).toHaveLength(initialBlog.length + 1);
	});
});

describe('Blog list tests, step4', () => {
	test('verifies that if the likes property is missing from the request, it will default to the value 0', async () => {
		const newBlog = {
			'title': 'Signals',
			'author': 'Sam',
			'url': 'htpps://www.sam.com'
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAfter = await api.get('/api/blogs');
		expect(blogsAfter.body[blogsAfter.body.length - 1].likes).toBe(0);
	});
});

describe('Blog list tests, step5', () => {
	test('verifies that if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
		const newBlog = {
			'author': 'Sam',
			'likes': 1245,
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});


describe('Blog list expansion tests', () => {
	test('verifies that a blog can be deleted', async () => {
		const blogsBefore = await api.get('/api/blogs');
		const blogToDelete = blogsBefore.body[0];
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204);
		const blogsAfter = await api.get('/api/blogs');
		expect(blogsAfter.body).toHaveLength(initialBlog.length - 1);
	});

	test('verifies that a blog can be updated', async () => {
		const blogsBefore = await api.get('/api/blogs');
		const blogToUpdate = blogsBefore.body[0];
		const updatedBlog = {
			likes: 1000
		};
		const newBlog = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(updatedBlog)
			.expect(200);
		expect(newBlog.body.likes).toBe(1000);
	});
});