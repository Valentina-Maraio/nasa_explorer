const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// First example route
app.get('/salut', (req, res) => {
    res.send("Hello from the other side!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
