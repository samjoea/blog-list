import { Blog } from '../model/blog.js';

const initialBlog = [
	{
		'title': 'State management',
		'author': 'Joe',
		'url': 'werrdfjojojfofofhowejoejf',
		'likes': 3499,
	},
	{
		'title': 'Backend Development',
		'author': 'Joe Sam',
		'url': 'http://www.mmyown.com/blog/2/en/bd/',
		'likes': 3420,
	}
];

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map(blog => blog.toJSON());
};

export { initialBlog, blogsInDb };