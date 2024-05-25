// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

let contentList = [
	{
		id: '1',
		title: 'Post 1',
		status: 'pending',
		allowComment: true,
		description: 'This is the first post.'
	},
	{
		id: '2',
		title: 'Post 2',
		status: 'pending',
		allowComment: true,
		description: 'This is the second post.'
	},
	{
		id: '3',
		title: 'Post 3',
		status: 'pending',
		allowComment: false,
		description: 'This is the third post.'
	},
];

app.get('/cms', (req, res) => {
	res.json(contentList);
});

app.post('/cms/approve/:id', (req, res) => {
	const { id } = req.params;
	const content = contentList.find(
		(item) => item.id === id);

	if (content) {
		content.status = 'approved';
		// Move the approved content to the end of the list
		contentList = contentList.filter(
			(item) => item.id !== id);
		contentList.push(content);

		res.json({
			message: 'Content approved successfully'
		});
	} else {
		res.status(404).json({
			error: 'Content not found'
		});
	}
});

app.put('/cms/edit/:id', (req, res) => {
	const { id } = req.params;
	const updatedContent = req.body;
	const index = contentList.findIndex(
		(item) => item.id === id);

	if (index !== -1) {
		contentList[index] = {
			...contentList[index],
			...updatedContent
		};
		res.json({
			message: 'Content updated successfully'
		});
	} else {
		res.status(404).json({
			error: 'Content not found'
		});
	}
});

app.post('/cms', (req, res) => {
	const newContent = req.body;
	newContent.status = 'pending';
	contentList.push(newContent);

	res.json({
		message: 'Content added successfully'
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
