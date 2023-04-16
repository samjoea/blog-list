import { Blog } from '../model/blog.js';

const initialBlog = [
	{
		'title': 'State management',
		'author': 'Joe',
		'url': 'werrdfjojojfofofhowejoejf',
		'likes': 3499,
		'id': '643c13b04c428d0d1b7179be'
	},
	{
		'title': 'Backend Development',
		'author': 'Joe Sam',
		'url': 'http://www.mmyown.com/blog/2/en/bd/',
		'likes': 3420,
		'id': '643c13fc4c428d0d1b7179c1'
	}
];

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map(blog => blog.toJSON());
};


export { initialBlog, blogsInDb };