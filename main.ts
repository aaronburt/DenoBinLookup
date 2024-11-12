import { Database } from "jsr:@db/sqlite@0.11";

Deno.serve({ port: 80 }, async(req: Request) => {
  try {
    const db = new Database("bin-list.db");

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
  
    if(url.pathname === '/') {
      const htmlContent = await Deno.readTextFile("./static/index.html");
      return new Response(htmlContent, { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if(url.pathname === '/favicon.ico') {
      const imageContent = await Deno.readFile("./static/favicon.ico");
      return new Response(imageContent, { 
        headers: {
          "Content-Type": "image/x-icon",
        }, 
      });
    }
  
    if (url.pathname === "/api") {
      const issuer: string | null = params.get("issuer");
      if (typeof issuer === "string") {
        const result = db.prepare(`SELECT * FROM binlist WHERE BIN = ${issuer}`)
          .all()!;
  
        return Response.json(result);
      }
    }
  
    return new Response("404", { status: 404 });
  } catch(error){
    console.warn(error);
    return new Response("500", { status: 500});
  }
});
