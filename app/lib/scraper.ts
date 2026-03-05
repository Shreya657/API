import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeUrl(url: string) {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'LinkAuraBot/1.0' },
      timeout: 8000, 
    });

    const $ = cheerio.load(data);

    return {
      title: $('meta[property="og:title"]').attr('content') || $('title').text() || "",
      description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "",
      image: $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || "",
      favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || "/favicon.ico",
      siteName: $('meta[property="og:site_name"]').attr('content') || ""
    };
  } catch (error) {
    throw new Error("Failed to parse website metadata");
  }
}