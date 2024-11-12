import { assertEquals } from "jsr:@std/assert";

/* RUNTIME */
import { Database } from "jsr:@db/sqlite@0.11";

const db: Database = new Database("bin-list.db");
const PORT = Number(Deno.env.get('PORT')) || 8080;

Deno.serve({ port: PORT }, async(req: Request) => {
  try {

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
  
    if(url.pathname === '/') {
      const htmlContent = await Deno.readTextFile("./static/index.html");
      return new Response(htmlContent, { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if(url.pathname === '/service-worker.js') {
      const htmlContent = await Deno.readTextFile("./static/service-worker.js");
      return new Response(htmlContent, { headers: { "content-type": "text/javascript" } });
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
/* RUNTIME END */ 

const testUrl: string = "http://localhost"

Deno.test({
    name: "index.html content-type",
    async fn() {
        const response: Response = await fetch(`${testUrl}`)
        response.body?.cancel()
        assertEquals(response.ok, true);
        assertEquals(response.headers.get('content-type'), 'text/html; charset=utf-8')
    }
})

Deno.test({
    name: "service-worker.js content-type",
    async fn() {
        const response: Response = await fetch(`${testUrl}/service-worker.js`)
        response.body?.cancel()
        assertEquals(response.ok, true);
        assertEquals(response.headers.get('content-type'), 'text/javascript')
    }
})

Deno.test({
    name: "favicon.ico content-type",
    async fn() {
        const response: Response = await fetch(`${testUrl}/favicon.ico`)
        response.body?.cancel()
        assertEquals(response.ok, true);
        assertEquals(response.headers.get('content-type'), 'image/x-icon')
    }
})

Deno.test({
    name: "api lookup",
    async fn() {
        const response = await fetch(`${testUrl}/api?issuer=470000`)
        const result = await response.text();
        assertEquals(response.ok, true);
        assertEquals(response.headers.get('content-type'), 'application/json');
        assertEquals(result, `[{"BIN":"470000","Type":"VISA","Issuer":"DEBIT","IssuerUrl":"CLASSIC","isoCode3":"MVB BANK, INC","Brand":"","Category":"","IssuerPhone":"US","isoCode2":"USA","CountryName":"UNITED STATES"}]`);
    },
})
