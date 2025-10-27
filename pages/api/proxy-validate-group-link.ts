// pages/api/proxy-validate-group-link.ts

import type { NextApiRequest, NextApiResponse } from 'next'

const BACKEND_URL = process.env.BACKEND_URL
const PROXY_SECRET = process.env.PROXY_SECRET

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!BACKEND_URL) {
    return res.status(500).json({ error: 'Missing BACKEND_URL in environment variables' })
  }

  if (!PROXY_SECRET) {
    return res.status(500).json({ error: 'Missing PROXY_SECRET in environment variables' })
  }

  const targetUrl = `${BACKEND_URL}/api/proxy-validate-group-link`

  try {
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-proxy-secret': PROXY_SECRET, // 🔐 Secret shared between proxy and backend
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    })

    const contentType = backendResponse.headers.get('content-type')
    res.status(backendResponse.status)

    if (contentType?.includes('application/json')) {
      const data = await backendResponse.json()
      res.json(data)
    } else {
      const text = await backendResponse.text()
      res.send(text)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Error proxying request to backend.' })
  }
}
