// index.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 5001;

const blogs = [
  { id: 1, title: 'First Blog Post', content: 'This is the content of the first blog post.' },
  { id: 2, title: 'Second Blog Post', content: 'This is the content of the second blog post.' },
  { id: 3, title: 'Third Blog Post', content: 'This is the content of the third blog post.' },
  { id: 4, title: 'Fourth Blog Post', content: 'This is the content of the fourth blog post.' },
  { id: 5, title: 'Fifth Blog Post', content: 'This is the content of the fifth blog post.' }
];

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    console.log('Validating token...');
    tokenIssuerFromEnv = process.env.TOKEN_ISSUER;
    const response = await axios.get(`${tokenIssuerFromEnv}/protocol/openid-connect/userinfo`,
      {
        headers: {
          'Authorization': token
        }
      }
    );

    console.log(response.status);

    if (response.status === 200) {
      next();
    } else {
      console.log(`Token validation failed: ${response.status}`);
      res.status(response.status).json({ error: 'Token validation failed' });
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.status(401).json({ error: 'Forbidden', details: err.message });
  }
};

app.get('/api/blogs', authenticateToken, (req, res) => {
  res.json(blogs);
});

app.listen(port, () => {
  console.log(`Blog backend listening at http://localhost:${port}`);
});
