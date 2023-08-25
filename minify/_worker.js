import{connect as W}from"cloudflare:sockets";var m="2cd61524-9843-43ab-8a0a-df4a744bb859",A=["mtn.ircf.space","mkh.ircf.space","mci.ircf.space","rtl.ircf.space"],T=A[Math.floor(Math.random()*A.length)],D="https://1.1.1.1/dns-query",L="",P="",_="";if(!H(m))throw new Error("uuid is invalid");var K={async fetch(e,t,p){try{m=t.UUID||m,T=t.PROXYIP||T,D=t.DNS_RESOLVER_URL||D,L=t.NODE_ID||L,P=t.API_TOKEN||P,_=t.API_HOST||_;let c=m;m.includes(",")&&(c=m.split(",")[0]);let l=e.headers.get("Upgrade");if(!l||l!=="websocket"){let s=new URL(e.url);switch(s.pathname){case"/cf":return new Response(JSON.stringify(e.cf,null,4),{status:200,headers:{"Content-Type":"application/json;charset=utf-8"}});case"/connect":let[r,i]=["cloudflare.com","80"];console.log(`Connecting to ${r}:${i}...`);try{let n=await W({hostname:r,port:parseInt(i,10)}),a=n.writable.getWriter();try{await a.write(new TextEncoder().encode(`GET / HTTP/1.1\r
Host: `+r+`\r
\r
`))}catch(d){return a.releaseLock(),await n.close(),new Response(d.message,{status:500})}a.releaseLock();let o=n.readable.getReader(),u;try{u=(await o.read()).value}catch(d){return await o.releaseLock(),await n.close(),new Response(d.message,{status:500})}return await o.releaseLock(),await n.close(),new Response(new TextDecoder().decode(u),{status:200})}catch(n){return new Response(n.message,{status:500})}case`/${c}`:{let n=Y(m,e.headers.get("Host"));return new Response(`${n}`,{status:200,headers:{"Content-Type":"text/html; charset=utf-8"}})}case`/sub/${c}`:{let a=new URL(e.url).searchParams,o=q(m,e.headers.get("Host"));return a.get("format")==="clash"&&(o=btoa(o)),new Response(o,{status:200,headers:{"Content-Type":"text/plain;charset=utf-8"}})}default:return s.hostname=Math.random()<.5?"www.gov.cn":"www.fmprc.gov.cn",s.protocol="https:",e=new Request(s,e),await fetch(e)}}else return await V(e)}catch(c){let l=c;return new Response(l.toString())}}};async function V(e){let t=new WebSocketPair,[p,c]=Object.values(t);c.accept();let l="",s="",r=(d,w)=>{console.log(`[${l}:${s}] ${d}`,w||"")},i=e.headers.get("sec-websocket-protocol")||"",n=I(c,i,r),a={value:null},o=null,u=!1;return n.pipeTo(new WritableStream({async write(d,w){if(u&&o)return o(d);if(a.value){let k=a.value.writable.getWriter();await k.write(d),k.releaseLock();return}let{hasError:U,message:b,portRemote:f=443,addressRemote:g="",rawDataIndex:y,vlessVersion:E=new Uint8Array([0,0]),isUDP:S}=B(d,m);if(l=g,s=`${f} ${S?"udp":"tcp"} `,U)throw new Error(b);if(S&&f!==53)throw new Error("UDP proxy only enabled for DNS which is port 53");S&&f===53&&(u=!0);let $=new Uint8Array([E[0],0]),x=d.slice(y);if(u){let{write:k}=await G(c,$,r);o=k,o(x);return}O(a,g,f,x,c,$,r)},close(){r("readableWebSocketStream is close")},abort(d){r("readableWebSocketStream is abort",JSON.stringify(d))}})).catch(d=>{r("readableWebSocketStream pipeTo error",d)}),new Response(null,{status:101,webSocket:p})}async function O(e,t,p,c,l,s,r){async function i(o,u){let d=W({hostname:o,port:u});e.value=d,r(`connected to ${o}:${u}`);let w=d.writable.getWriter();return await w.write(c),w.releaseLock(),d}async function n(){let o=await i(T||t,p);o.closed.catch(u=>{console.log("retry tcpSocket closed error",u)}).finally(()=>{v(l)}),C(o,l,s,null,r)}let a=await i(t,p);C(a,l,s,n,r)}function I(e,t,p){let c=!1;return new ReadableStream({start(s){e.addEventListener("message",n=>{let a=n.data;s.enqueue(a)}),e.addEventListener("close",()=>{v(e),s.close()}),e.addEventListener("error",n=>{p("webSocketServer has error"),s.error(n)});let{earlyData:r,error:i}=j(t);i?s.error(i):r&&s.enqueue(r)},pull(s){},cancel(s){p(`ReadableStream was canceled, due to ${s}`),c=!0,v(e)}})}function B(e,t){if(e.byteLength<24)return{hasError:!0,message:"invalid data"};let p=new Uint8Array(e.slice(0,1)),c=!1,l=!1,s=new Uint8Array(e.slice(1,17)),r=F(s),i=t.includes(",")?t.split(","):[t];if(console.log(r,i),c=i.some(E=>r===E.trim())||i.length===1&&r===i[0].trim(),console.log(`userID: ${r}`),!c)return{hasError:!0,message:"invalid user"};let n=new Uint8Array(e.slice(17,18))[0],a=new Uint8Array(e.slice(18+n,18+n+1))[0];if(a===1)l=!1;else if(a===2)l=!0;else return{hasError:!0,message:`command ${a} is not support, command 01-tcp,02-udp,03-mux`};let o=18+n+1,u=e.slice(o,o+2),d=new DataView(u).getUint16(0),w=o+2,b=new Uint8Array(e.slice(w,w+1))[0],f=0,g=w+1,y="";switch(b){case 1:f=4,y=new Uint8Array(e.slice(g,g+f)).join(".");break;case 2:f=new Uint8Array(e.slice(g,g+1))[0],g+=1,y=new TextDecoder().decode(e.slice(g,g+f));break;case 3:f=16;let E=new DataView(e.slice(g,g+f)),S=[];for(let $=0;$<8;$++)S.push(E.getUint16($*2).toString(16));y=S.join(":");break;default:return{hasError:!0,message:`invild  addressType is ${b}`}}return y?{hasError:!1,addressRemote:y,addressType:b,portRemote:d,rawDataIndex:g+f,vlessVersion:p,isUDP:l}:{hasError:!0,message:`addressValue is empty, addressType is ${b}`}}async function C(e,t,p,c,l){let s=0,r=[],i=p,n=!1;await e.readable.pipeTo(new WritableStream({start(){},async write(a,o){n=!0,s++,t.readyState!==R&&o.error("webSocket.readyState is not open, maybe close"),i?(t.send(await new Blob([i,a]).arrayBuffer()),i=null):(console.log(`remoteSocketToWS send chunk ${a.byteLength}`),t.send(a))},close(){l(`remoteConnection!.readable is close with hasIncomingData is ${n}`)},abort(a){console.error("remoteConnection!.readable abort",a)}})).catch(a=>{console.error("remoteSocketToWS has exception ",a.stack||a),v(t)}),n===!1&&c&&(l("retry"),c())}function j(e){if(!e)return{earlyData:null,error:null};try{e=e.replace(/-/g,"+").replace(/_/g,"/");let t=atob(e);return{earlyData:Uint8Array.from(t,c=>c.charCodeAt(0)).buffer,error:null}}catch(t){return{earlyData:null,error:t}}}function H(e){return/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e)}var R=1,M=2;function v(e){try{(e.readyState===R||e.readyState===M)&&e.close()}catch(t){console.error("safeCloseWebSocket error",t)}}var h=[];for(let e=0;e<256;++e)h.push((e+256).toString(16).slice(1));function z(e,t=0){return(h[e[t+0]]+h[e[t+1]]+h[e[t+2]]+h[e[t+3]]+"-"+h[e[t+4]]+h[e[t+5]]+"-"+h[e[t+6]]+h[e[t+7]]+"-"+h[e[t+8]]+h[e[t+9]]+"-"+h[e[t+10]]+h[e[t+11]]+h[e[t+12]]+h[e[t+13]]+h[e[t+14]]+h[e[t+15]]).toLowerCase()}function F(e,t=0){let p=z(e,t);if(!H(p))throw TypeError("Stringified UUID is invalid");return p}async function G(e,t,p){let c=!1,l=new TransformStream({start(r){},transform(r,i){for(let n=0;n<r.byteLength;){let a=r.slice(n,n+2),o=new DataView(a).getUint16(0),u=new Uint8Array(r.slice(n+2,n+2+o));n=n+2+o,i.enqueue(u)}},flush(r){}});l.readable.pipeTo(new WritableStream({async write(r){let n=await(await fetch(D,{method:"POST",headers:{"content-type":"application/dns-message"},body:r})).arrayBuffer(),a=n.byteLength,o=new Uint8Array([a>>8&255,a&255]);e.readyState===R&&(p(`doh success and dns message length is ${a}`),c?e.send(await new Blob([o,n]).arrayBuffer()):(e.send(await new Blob([t,o,n]).arrayBuffer()),c=!0))}})).catch(r=>{p("dns udp has error"+r)});let s=l.writable.getWriter();return{write(r){s.write(r)}}}function Y(e,t){let p=`:443?encryption=none&security=tls&sni=${t}&type=ws&host=${t}&path=%2F%3Fed%3D2048#${t}`,c="---------------------------------------------------------------",l="################################################################",s=e.split(","),r=[],i=[];return i.push(`
<p align="right" style="direction: rtl; text-align: right;">
	<img src="https://fa.shafaqna.com/media/2023/02/%D9%88%D8%B2%DB%8C%D8%B1-%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7%D8%A7%D8%AA.jpg" alt="description" style="width: 25%; height: 30%;">
</p>`),i.push(`
<p align="right" style="direction: rtl; text-align: right; font-size: 15px;" >\u{1F44B}\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F: \u0628\u0627 \u0627\u06CC\u0646\u06A9\u0647 \u0633\u0631\u06CC\u0639\u062A\u0631\u06CC\u0646 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A (\u062F\u0627\u062E\u0644\u06CC) \u0631\u0648 \u062F\u0631 \u0633\u0637\u062D \u0627\u0633\u062A\u0627\u0646 \u062F\u0627\u0631\u06CC\u0645 \u0645\u06CC\u062A\u0648\u0627\u0646\u06CC\u062F \u0627\u0632 \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0647\u0627\u06CC Vless \u0632\u06CC\u0631 \u0628\u0631\u0627\u06CC \u06A9\u0627\u0647\u0634 \u0633\u0631\u0639\u062A \u062C\u0647\u062A \u062C\u0644\u0648\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u062A\u0635\u0627\u062F\u0641\u0627\u062A \u0627\u06CC\u0646\u062A\u0631\u0646\u062A\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.</p>
`),i.push(`<p align="right" style="direction: rtl; text-align: right; font-size: 15px;" >\u0627\u06AF\u0631 \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0647\u0627\u06CC VLESS \u0628\u0631\u0627\u062A \u06A9\u0627\u0631 \u06A9\u0631\u062F \u0645\u06CC\u062A\u0648\u0646\u06CC \u0628\u0647 \u0627\u06CC\u0646 \u0628\u0631\u0646\u0627\u0645\u0647 \u06CC\u06A9 \u0633\u062A\u0627\u0631\u0647 \u{1F31F} \u0628\u062F\u06CC.</p>
`),i.push(`
<p align="right" style="direction: rtl; text-align: right;"><a href="https://github.com/Ptechgithub/pp-worker" target="_blank">pp-worker - https://github.com/Ptechgithub/pp-worker</a></p>
`),i.push(`
<p align="right" style="direction: rtl; text-align: right;"><iframe src="https://ghbtns.com/github-btn.html?user=USERNAME&repo=REPOSITORY&type=star&count=true&size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe></p>

`.replace(/USERNAME/g,"Ptechgithub").replace(/REPOSITORY/g,"pp-worker")),i.push(`<p align="right" style="direction: rtl; text-align: right;"><a href="//${t}/sub/${s[0]}" target="_blank">\u2705\uFE0F \u0644\u06CC\u0633\u062A \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0647\u0627\u06CC VLESS</a></p>
<p align="right" style="direction: rtl; text-align: right;"><a href="https://subconverter.do.xn--b6gac.eu.org/sub?target=clash&url=https://${t}/sub/${s[0]}?format=clash&insert=false&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true" target="_blank">\u2705\uFE0F \u0644\u06CC\u0633\u062A \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0647\u0627\u06CC CLASH</a></p>
`),i.push(""),s.forEach(a=>{let o=`vless://${a}@${t}${p}`,u=`vless://${a}@${T}${p}`;r.push(`UUID: ${a}`),r.push(`${l}
v2ray default ip
\u{1F4AB} \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0628\u0627 \u062F\u0627\u0645\u06CC\u0646 \u067E\u06CC\u0634 \u0641\u0631\u0636
${c}
1\uFE0F\u20E3
${o}
${c}`),r.push(`${l}
v2ray with best ip
\u{1F31F} \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0628\u0627 \u0622\u06CC \u067E\u06CC \u0633\u0627\u0644\u0645 \u06A9\u0644\u0648\u062F\u0641\u0644\u0631
${c}
2\uFE0F\u20E3
${u}
${c}`)}),r.push(`${l}
# Clash Proxy Provider configuration format
proxy-groups:
  - name: UseProvider
	type: select
	use:
	  - provider1
	proxies:
	  - Proxy
	  - DIRECT
proxy-providers:
  provider1:
	type: http
	url: https://${t}/sub/${s[0]}?format=clash
	interval: 3600
	path: ./provider1.yaml
	health-check:
	  enable: true
	  interval: 600
	  # lazy: true
	  url: http://www.gstatic.com/generate_204

${l}`),`
    <html>
    ${`
    <head>
        <title>pp-worker: VLESS configuration</title>
        <meta name="description" content="This is a tool for generating VLESS protocol configurations. Give us a star on GitHub https://github.com/Ptechgithub/pp-worker if you found it useful!">
		<meta name="keywords" content="pp-worker, cloudflare pages, cloudflare worker, severless">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<meta property="og:site_name" content="pp-worker: VLESS configuration" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="pp-worker - VLESS configuration and subscribe output" />
        <meta property="og:description" content="Use cloudflare pages and worker severless to implement vless protocol" />
        <meta property="og:url" content="https://${t}/" />
        <meta property="og:image" content="https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`vless://${e.split(",")[0]}@${t}${p}`)}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="pp-worker - VLESS configuration and subscribe output" />
        <meta name="twitter:description" content="Use cloudflare pages and worker severless to implement vless protocol" />
        <meta name="twitter:url" content="https://${t}/" />
        <meta name="twitter:image" content="https://cloudflare-ipfs.com/ipfs/bafybeigd6i5aavwpr6wvnwuyayklq3omonggta4x2q7kpmgafj357nkcky" />
        <meta property="og:image:width" content="1500" />
        <meta property="og:image:height" content="1500" />

        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            color: #333;
            padding: 10px;
        }

        a {
            color: #1a0dab;
            text-decoration: none;
        }
		img {
			max-width: 100%;
			height: auto;
		}
		
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 10px 0;
        }
		/* Dark mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #333;
                color: #f0f0f0;
            }

            a {
                color: #9db4ff;
            }

            pre {
                background-color: #282a36;
                border-color: #6272a4;
            }
        }
        </style>
    </head>
    `}
    <body>
    <pre style="
    background-color: transparent;
    border: none;
">${i.join("")}</pre><pre>${r.join(`
`)}</pre>
    </body>
</html>`}function q(e,t){let p=[80,8080,8880,2052,2086,2095],c=[443,8443,2053,2096,2087,2083],l=e.includes(",")?e.split(","):[e],s=[];return l.forEach(r=>{t.includes("pages.dev")||p.forEach(i=>{let n=`:${i}?encryption=none&security=none&type=ws&host=${t}&path=%2F%3Fed%3D2048#${t}-HTTP`,a=`vless://${r}@${t}${n}`;A.forEach(o=>{let u=`vless://${r}@${o}${n}-${o}-pp-worker`;s.push(`${a}`),s.push(`${u}`)})}),c.forEach(i=>{let n=`:${i}?encryption=none&security=tls&sni=${t}&type=ws&host=${t}&path=%2F%3Fed%3D2048#${t}-HTTPS`,a=`vless://${r}@${t}${n}`;A.forEach(o=>{let u=`vless://${r}@${o}${n}-${o}-pp-worker`;s.push(`${a}`),s.push(`${u}`)})})}),s.join(`
`)}export{K as default};
//# sourceMappingURL=_worker.js.map
