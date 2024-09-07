import express from 'express';

const app = express();

const port = 3000 || 3001;

// Basic route to test if the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
