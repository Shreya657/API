// Updated scraper logic to include Premium Features
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeUrl(url: string) {
  
  const response = await axios.get(url, { 
    maxRedirects: 5,
    headers: { 'User-Agent': 'LinkAura-Scraper/1.0' }
  });
  
  const finalUrl = response.request.res.responseUrl || url;
  const html = response.data;
  const $ = cheerio.load(html);

  //  Calculate reading time
  const textContent = $('body').text().trim();
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Avg 200 wpm

  return {
    title: $('title').text() || $('meta[property="og:title"]').attr('content'),
    description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content'),
    image: $('meta[property="og:image"]').attr('content'),
    favicon: `https://www.google.com/s2/favicons?domain=${new URL(finalUrl).hostname}`,
    readingTime: `${readingTime} min read`,
    wordCount,
    url: finalUrl, // shows the user where the link actually ended up
  };
}