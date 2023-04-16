import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';

const dummy = (blogs) => {
	if(blogs.length === 0) return 1;
};

const totalLikes = (blogs) => {
	if(blogs.length === 0) return 0;
	else {
		const total = blogs.reduce((acc, val) => acc + val['likes'], 0);
		return total;
	}
};

const favoriteBlog = (blogs) => {
	if(blogs.length === 0) return {};
	else {
		const favorite = blogs.sort((val1, val2) => val2['likes'] - val1['likes'])[0];
		return {
			title: favorite['title'],
			author: favorite['author'],
			likes: favorite['likes'],
		};
	}
};

const mostBlogs = (blogs) => {
	if(blogs.length === 0) return {};
	if(blogs.length === 1) return {
		author: blogs[0].author,
		blogs: 1
	};
	const most = uniqWith(blogs, isEqual).map(val1 => (
		{
			author: val1.author,
			blogs: blogs.filter(val2 => val1.author === val2.author).length
		}
	)).sort((a, b) => b.blogs - a.blogs)[0];
	return most;
};

const mostLikes = (blogs) => {
	if(blogs.length === 0) return {};
	if(blogs.length === 1) return {
		author: blogs[0].author,
		likes: blogs[0].likes
	};

	const most = uniqWith(blogs, isEqual).map(val1 => (
		{
			author: val1.author,
			likes: blogs.filter(val2 => val1.author === val2.author).reduce((acc, val) => acc + val.likes, 0)
		}
	)).sort((a, b) => b.likes - a.likes)[0];
	return most;
};

export {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
};