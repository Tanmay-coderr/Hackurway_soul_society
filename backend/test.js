// Create a minimal test file (test.js)
import express from "express"
const app = express();

app.get('/test', (req, res) => res.send('OK'));

app.listen(3000, () => console.log('Test server running'));
