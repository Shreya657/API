import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Copy, Terminal, Code2, Globe, Zap, ArrowLeft } from "lucide-react";
import CopyButton from "./copyButton";
import Link from "next/link";

export default function DocsPage() {
  const endpoint = "http://localhost:3000/actions/extract"; //will replace later

  // snippets objects
  const snippets = {
    nodejs:
     `const fetchMetadata = async (targetUrl) => {
  const response = await fetch("${endpoint}?url=\${targetUrl}", {
    headers: {
      "x-api-key": "la_..." // REPLACE WITH YOUR API KEY FROM DASHBOARD
    }
  });
  return await response.json();
};`,

    python: 
    `import requests

url = "${endpoint}"
params = {"url": "https://github.com"}
headers = {"x-api-key": "la_..."} # REPLACE WITH YOUR KEY

response = requests.get(url, params=params, headers=headers)
print(response.json())`,

    ts: 
    `interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  favicon: string;
  siteName: string;
}

const fetchMetadata = async (targetUrl: string): Promise<LinkMetadata> => {
  const res = await fetch(\`${endpoint}?url=\${targetUrl}\`, {
    headers: { "x-api-key": "la_..." } // YOUR API KEY GOES HERE
  });
  return await res.json();
};`,

    Rust: 
 `use reqwest::header::HeaderMap;
#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let mut headers = HeaderMap::new();
    headers.insert("x-api-key", "la_...".parse().unwrap()); // API KEY HERE

    let res = reqwest::Client::new()
        .get("${endpoint}?url=https://github.com")
        .headers(headers)
        .send()
        .await?
        .json::<serde_json::Value>()
        .await?;

    println!("{:#?}", res);
    Ok(())
}`,

    php: 
    `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${endpoint}?url=https://google.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "x-api-key: la_..." // YOUR SECRET KEY
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8 pt-18">
      <div className="max-w-4xl mx-auto space-y-12">
      
          <Link href="/" className="text-sm text-slate-500 flex items-center hover:text-blue-600 transition-colors pt-0">
            <ArrowLeft className="h-4 w-4 mr-1" /> back
          </Link>
         
       
        
    
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">API Documentation</h1>
          <p className="text-lg text-zinc-400">
            Learn how to integrate LinkAura's metadata extraction into your own applications.
          </p>
        </section>

      
        <Card className="bg-zinc-900/50 border-zinc-800 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4 text-white">
            <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</div>
            <code className="text-sm font-mono text-blue-300">{endpoint}</code>
          </div>
          <p className="text-sm text-zinc-400">
            Send a GET request with the <code className="text-zinc-200">url</code> parameter and your <code className="text-zinc-200">x-api-key</code> header.
          </p>
        </Card>

      
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Code2 className="h-6 w-6 text-blue-500" />
            Quickstart Snippets
          </h2>
          <Tabs defaultValue="nodejs" className="w-full">
            <TabsList className="bg-zinc-900 border-zinc-800 ">
              <TabsTrigger className="text-white" value="nodejs">Node.js</TabsTrigger>
              <TabsTrigger className="text-white" value="TS">TypeScript</TabsTrigger>
              <TabsTrigger className="text-white" value="python">Python</TabsTrigger>
              <TabsTrigger className="text-white" value="Rust">Rust</TabsTrigger>
              <TabsTrigger className="text-white" value="PHP">PHP (cURL)</TabsTrigger>
            </TabsList>

            {Object.entries(snippets).map(([lang, code]) => (
              <TabsContent key={lang} value={lang === 'ts' ? 'TS' : lang === 'php' ? 'PHP' : lang} className="mt-4 ">
                <div className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
                  <CopyButton code={code} />
                  <pre className="p-6 text-sm leading-relaxed overflow-x-auto text-blue-300 font-mono">
                    {code}
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-8 border-t border-zinc-800">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">JSON Response</h3>
           <div className="relative group w-full max-w-lg"> 
  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
    <CopyButton 
      code={JSON.stringify({
        title: "GitHub: Let's build from here",
        description: "The world's leading developer platform.",
        url: "https://github.com/home", 
        siteName: "GitHub",
        image: "https://github.com/og-image.png",
        favicon: "https://www.google.com/s2/favicons?domain=github.com",
        metadata: {
          readingTime: "4 min read",
          wordCount: 842
        }
      }, null, 2)} 
    />
  </div>

  <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-emerald-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
    {JSON.stringify(
      {
        title: "GitHub: Let's build from here",
        description: "The world's leading developer platform.",
        url: "https://github.com/home", 
        siteName: "GitHub",
        image: "https://github.com/og-image.png",
        favicon: "https://www.google.com/s2/favicons?domain=github.com",
        metadata: {
          readingTime: "4 min read",
          wordCount: 842
        }
      }, 
      null, 2
    )}
  </pre>
</div>
          </div>



          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Visual Output</h3>
            <div className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-1 hover:border-blue-500/50 transition-all cursor-default shadow-2xl">
              <div className="bg-zinc-950 rounded-lg overflow-hidden">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src="https://images.ctfassets.net/8aevphvgewt8/4pe4eOtUJ0ARpZRE4fNekf/f52b1f9c52f059a33170229883731ed0/GH-Homepage-Universe-img.png" 
                    alt="Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
                </div>
                
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                    <Zap className="h-3 w-3" />
                    linkaura.com/extract
                  </div>
                  <h4 className="text-white font-bold text-lg line-clamp-1">GitHub: Let's build from here</h4>
                  <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">The world's leading developer platform. Millions of developers and companies build, ship, and maintain their software on GitHub.</p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-zinc-500 font-medium">
                     <img src="https://github.githubassets.com/favicons/favicon.svg" className="h-4 w-4" alt="favicon" />
                     github.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}