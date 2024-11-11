require('dotenv').config();



const express = require('express');
const app = express();

// Use process.env.PORT for deployment, or 3000 as a default for local development
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
