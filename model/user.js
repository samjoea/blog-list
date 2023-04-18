import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		minLength: [3, 'Username must be at least 3 characters long'],
		required: [true, 'Username field required'],
	},
	name: {
		type: String,
		required: [true, 'name field required'],
	},
	passwordHash: {
		type: String,
		required: [true, 'Password field required'],
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	]
});

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	}
});
userSchema.plugin(mongooseUniqueValidator);

const User = mongoose.model('User', userSchema);

export { User };