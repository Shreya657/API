# 🔗 ScrapIt (a metadata scrapper)

**The lightning-fast, production-ready Metadata Scraping API.** Built for developers who need to generate beautiful link previews without the overhead of heavy scraping libraries.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

---

## 🚀 The Ecosystem

ScrapIt isn't just an API—it's a complete toolset for metadata management:

1.  **The API Engine:** A robust backend with Redis caching and Upstash rate-limiting.
2.  **The Live Demo:** A clean Next.js dashboard to manage keys and test URLs.
3.  **The Chrome Extension:** Instant metadata insights for any tab you're browsing.
    * 👉 **[View Extension Repository](https://github.com/Shreya657/exto)** (Built with Plasmo)

---

## ✨ Features

* **⚡ Blazing Fast:** Automatic Redis caching ensures `< 50ms` response times for recurring URLs.
* **🛡️ Secure & Scalable:** API Key authentication with hashed storage and per-user rate limiting.
* **🌍 Cross-Origin Ready:** Fully configured CORS headers allowing direct `fetch` from any frontend.
* **📊 Usage Analytics:** Track your extraction history and API performance via the dashboard.
* **📦 Rich Data:** Extracts Title, Description, Favicons, OG Images, Word Count, and Reading Time.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 14+ (App Router)
* **Database:** PostgreSQL with Prisma ORM
* **Cache/Rate-Limit:** Redis via Upstash
* **Auth:** Clerk (User Management)
* **API Security:** SHA-256 Key Hashing
* **Extension:** Plasmo Framework (tailwind+typescript)

---

## 📖 API Usage

Fetch metadata directly from your client-side code:

```javascript
const res = await fetch("https://api-ten-sepia-10.vercel.app//actions/extract?url=https://github.com", {
  headers: {
    "x-api-key": "YOUR_API_KEY"
  }
});

const data = await res.json();
console.log(data);
