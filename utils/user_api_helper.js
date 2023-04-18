import { User } from '../model/user';

const usersInDB = async () => {
	const users = await User.find({});
	return users.map(user => user.toJSON());
};

export { usersInDB };