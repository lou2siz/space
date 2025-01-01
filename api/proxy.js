const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Enable CORS
const corsMiddleware = cors();

export default function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Promise((resolve, reject) => {
      corsMiddleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

  // Get the target URL from query parameter
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Create proxy
  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['X-Frame-Options'];
      proxyRes.headers['Content-Security-Policy'] = '';
    }
  });

  // Run the proxy
  return new Promise((resolve, reject) => {
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
} 