import bcrypt from 'bcrypt';
import { User } from '../model/user';
import { usersInDB } from '../utils/user_api_helper';
import supertest from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';

const api = supertest(app);

describe('when there is initially one user at db', () => {
	beforeEach(async () => {
		try {
			await User.deleteMany({});
			const passwordHash = await bcrypt.hash('abcdedf', 10);
			const user = new User({
				name: 'Joe',
				username: 'joe',
				passwordHash
			});
			await user.save();
		} catch (error) {
			console.log(error.message);
		}
	});

	test('creation succeeds with a fresh username', async () => {
		const initialUsers = await usersInDB();

		const newUsers = {
			username: 'jonnya',
			name: 'John Mark',
			password: 'jonnyJohn'
		};

		await api
			.post('/api/users')
			.send(newUsers)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await usersInDB();
		expect(usersAtEnd).toHaveLength(initialUsers.length + 1);

		const usernames = usersAtEnd.map(u => u.username);
		expect(usernames).toContain(newUsers.username);
	});


	test('invalid users are not created', async () => {
		const initialUsers = await usersInDB();

		const newUsers = {
			username: '2',
			name: 'John Mark',
			password: 'j'
		};

		await api
			.post('/api/users')
			.send(newUsers)
			.expect(400);

		const usersAtEnd = await usersInDB();
		expect(usersAtEnd).toHaveLength(initialUsers.length);
	});


	test('invalid username', async () => {
		const initialUsers = await usersInDB();

		const newUsers = {
			username: '2',
			name: 'John Mark',
			password: 'jsfwe'
		};

		const res = await api
			.post('/api/users')
			.send(newUsers)
			.expect(400);

		expect(res.body.error)
			.toBe('User validation failed: username: Username must be at least 3 characters long');

		const usersAtEnd = await usersInDB();
		expect(usersAtEnd).toHaveLength(initialUsers.length);
	});

	test('invalid password', async () => {
		const initialUsers = await usersInDB();

		const newUsers = {
			username: 'amamsd',
			name: 'John Mark',
			password: 'js'
		};

		const res = await api
			.post('/api/users')
			.send(newUsers)
			.expect(400);

		expect(res.body.error)
			.toBe('password field required and must be at least 3 characters long');

		const usersAtEnd = await usersInDB();
		expect(usersAtEnd).toHaveLength(initialUsers.length);
	});

	test('missing fields', async () => {
		const initialUsers = await usersInDB();

		const newUsers = {
			name: 'John Mark',
		};

		const res = await api
			.post('/api/users')
			.send(newUsers)
			.expect(400);

		expect(res.body.error)
			.toBe('password field required and must be at least 3 characters long');

		const usersAtEnd = await usersInDB();
		expect(usersAtEnd).toHaveLength(initialUsers.length);
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

});


