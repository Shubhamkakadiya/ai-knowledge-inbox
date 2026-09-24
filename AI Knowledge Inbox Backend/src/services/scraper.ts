import * as cheerio from 'cheerio'
import { AppError } from '../middleware/errorHandler.js'

const MAX_CONTENT_CHARS = 20000

export interface ScrapedPage {
  title: string
  text: string
}

export async function fetchUrlContent(url: string): Promise<ScrapedPage> {
  let response: Response
  try {
    response = await fetch(url, { headers: { 'User-Agent': 'AI-Knowledge-Inbox/1.0' } })
  } catch {
    throw new AppError(400, `Could not reach ${url}`)
  }

  if (!response.ok) {
    throw new AppError(400, `${url} responded with status ${response.status}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html')) {
    throw new AppError(422, `${url} is not an HTML page`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)
  $('script, style, nav, footer, noscript, svg').remove()

  const title = $('title').first().text().trim() || url
  const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, MAX_CONTENT_CHARS)

  if (!text) {
    throw new AppError(422, `No readable text found at ${url}`)
  }

  return { title, text }
}
