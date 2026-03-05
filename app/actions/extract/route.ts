import { hashKey } from '@/app/lib/generateKey';
import { scrapeUrl } from '@/app/lib/scraper';
import { prisma } from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const apiKey = req.headers.get('x-api-key');

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

    //  perform the scrape
    const metadata = await scrapeUrl(targetUrl);

    // log the usage (for stats later)
    await prisma.usageLog.create({
      data: {
        apiKeyId: keyRecord.id,
        endpoint: "/actions/extract",
        status: 200
      }
    });

    return NextResponse.json(metadata);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}