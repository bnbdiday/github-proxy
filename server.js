// server.js
const express = require('express');
const { Octokit } = require('@octokit/rest');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/save', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing "message" field' });
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Получаем текущий файл
    const { data } = await octokit.rest.repos.getContent({
      owner: 'bnbdiday',
      repo: 'ozz',
      path: 'index.html'
    });

    // Обновляем
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: 'bnbdiday',
      repo: 'ozz',
      path: 'index.html',
      message: 'Update from browser proxy',
      content: Buffer.from(message).toString('base64'),
      sha: data.sha
    });

    res.json({ ok: true, message: 'File updated' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
