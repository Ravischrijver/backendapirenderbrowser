import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { URL } from 'url';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.static('public'));

app.get('/proxy', async (req, res) => {
  try {
    const target = req.query.url;
    if (!target) {
      return res.status(400).send('Missing url parameter');
    }

    // simpele veiligheidscheck
    let url;
    try {
      url = new URL(target);
    } catch {
      return res.status(400).send('Invalid URL');
    }

    const response = await fetch(url.href, {
      headers: {
        'User-Agent': 'RaviProxy/1.0'
      }
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);

    // LET OP: hier strippen we geen scripts/gevaarlijke dingen, dit is basic
    const body = await response.text();
    res.send(body);
  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
