var path=require('path');
var express=require('express');

var port = 8000;

express()
	// Serve the 'dist' directory which holds built and compiled css and js
	.use('/dist', express.static(path.join(__dirname, '../dist')))

	//All get requests made will be met responded with index.html.
	.get('*', (req, res) => {
		return res.sendFile(path.join(__dirname, '../index.html'));
	})

	// Start the server at the given 'PORT'.
	.listen(port, () => {
		console.log('Server started at', port);
	});