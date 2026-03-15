import { hashKey } from '@/app/lib/generateKey';
import { ratelimit, redis } from '@/app/lib/redis';
import { scrapeUrl } from '@/app/lib/scraper';
import { prisma } from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
// defining global CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

//  add an OPTIONS handler for preflight checks
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const apiKey = req.headers.get('x-api-key');

  // function to return json with CORS
  const jsonResponse = (data: any, status = 200, extraHeaders = {}) => {
    return NextResponse.json(data, { 
      status, 
      headers: { ...corsHeaders, ...extraHeaders } 
    });
  };

  // validation
  if (!targetUrl) 
    return NextResponse.json({
   error: "URL is required" 
  },
    { 
      status: 400 

    });
  if (!apiKey)
     return NextResponse.json({ 
    error: "API Key is missing"
   }, { 
    status: 401
   });

  try {
    // authenticate the Key
    const hashed = hashKey(apiKey);
    const keyRecord = await prisma.apiKey.findFirst({
      where: { keyHash: hashed, isActive: true },
      include: { user: true }
    });

    if (!keyRecord) {
      return NextResponse.json({ 
        error: "Invalid or inactive API key"
       },
        { 
        status: 403 
      });
    }


    //implementing rate limiting
    const { success, limit, reset, remaining } = await ratelimit.limit(hashed);

    if (!success) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please slow down.",
          limit,
          remaining,
          reset: new Date(reset).toISOString()
        }, 
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      );
    }

    //  Cache check
    const cacheKey = `cache:${targetUrl}`;
    const cachedData = await redis.get(cacheKey);


    //if we have cached data, return it immediately without scraping again
    if (cachedData) {
      console.log("CACHE HIT");
      // redis might return it as a string or object depending on how it's stored
      const data = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
      
    return jsonResponse(data, 200, { "X-Cache": "HIT" });
    }


// if we dont find the data in redis then start scraping and save the result in redis for next time
    console.log("CACHE MISS: Scraping fresh data");
    //  perform the scrape
    const metadata = await scrapeUrl(targetUrl);

    //  Save to Cache
    // We set it to expire in 24 hours (86400 seconds)
    await redis.set(cacheKey, JSON.stringify(metadata), { ex: 86400 });

    // log the usage (for stats later)
    await prisma.usageLog.create({
      data: {
        apiKeyId: keyRecord.id,
        endpoint: "/actions/extract",
        status: 200
      }
    });

   return jsonResponse(metadata, 200, { "X-Cache": "MISS" });
  } catch (error: any) {
    console.error("Scrape Error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
}