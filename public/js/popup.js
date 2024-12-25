(()=>{"use strict";var e,t,a,n={7337:(e,t,a)=>{var n=a(6540),l=a(5338);const r=e=>{let{activeTab:t,setActiveTab:a}=e;return n.createElement("div",{className:"tabs"},n.createElement("button",{className:"tab-button "+("summary"===t?"active":""),onClick:()=>a("summary")},"Summary"),n.createElement("button",{className:"tab-button "+("links"===t?"active":""),onClick:()=>a("links")},"Links"),n.createElement("button",{className:"tab-button "+("images"===t?"active":""),onClick:()=>a("images")},"Images"),n.createElement("button",{className:"tab-button "+("headers"===t?"active":""),onClick:()=>a("headers")},"Headers"),n.createElement("button",{className:"tab-button "+("schema"===t?"active":""),onClick:()=>a("schema")},"Schema"),n.createElement("button",{className:"tab-button "+("pagespeedtest"===t?"active":""),onClick:()=>a("pagespeedtest")},"PageSpeed"))},o=async()=>{const[e]=await chrome.tabs.query({active:!0,currentWindow:!0}),t=e.id;return new Promise(((e,a)=>{chrome.scripting.executeScript({target:{tabId:t},func:()=>{const e=document.querySelector('meta[name="robots"]')?.content||"Not Available",t=document.querySelector('meta[http-equiv="X-Robots-Tag"]')?.content||"Not Available",a=document.documentElement.lang||"Not Available";return{title:document.title,description:document.querySelector('meta[name="description"]')?.content||"Not Available",canonical:document.querySelector('link[rel="canonical"]')?.href||"Not Available",robots:e,xRobots:t,lang:a,url:window.location.href}}},(t=>{let[n]=t;n&&n.result?e(n.result):a(new Error("Error fetching the Metalinks Summary, Please try again later."))}))}))},c=e=>{let{label:t,value:a}=e;return n.createElement("p",null,n.createElement("span",null,n.createElement("strong",null,t)),n.createElement("span",null,":"),n.createElement("span",null," ",a))},s=()=>{const[e,t]=(0,n.useState)({}),[a,l]=(0,n.useState)(!0),[r,s]=(0,n.useState)(null);return(0,n.useEffect)((()=>{(async()=>{try{const e=await o();t(e)}catch(e){s(e.message)}finally{l(!1)}})()}),[]),n.createElement("div",{className:"active-tab-container"},n.createElement("h2",null,"Summary"),a?n.createElement("i",{class:"loader --1"}):r?n.createElement("div",{className:"error-message"},n.createElement("p",null,r)):n.createElement("div",{className:"info"},n.createElement(c,{label:"Title",value:e.title}),n.createElement(c,{label:"Description",value:e.description}),n.createElement(c,{label:"Canonical",value:e.canonical}),n.createElement(c,{label:"URL",value:e.url}),n.createElement(c,{label:"Language",value:e.lang}),n.createElement(c,{label:"Robots Meta",value:e.robots}),n.createElement(c,{label:"X-Robots Meta",value:e.xRobots})),e.url&&n.createElement("div",{className:"buttons"},n.createElement("button",{onClick:()=>window.open(`${e.url}/sitemap.xml`,"_blank")},"Sitemap"),n.createElement("button",{onClick:()=>window.open(`${e.url}/robots.txt`,"_blank")},"Robots.txt")))},i=async()=>{const[e]=await chrome.tabs.query({active:!0,currentWindow:!0}),t=e.id;return new Promise(((e,a)=>{chrome.scripting.executeScript({target:{tabId:t},func:()=>{const e=Array.from(document.querySelectorAll("a")).map((e=>({href:e.href||null,title:e.textContent.trim()||"No title"}))),t=window.location.origin,a=e.filter((e=>e.href?.startsWith(t))),n=e.filter((e=>e.href&&!e.href.startsWith(t))),l=e.filter((e=>!e.href)),r=[...new Set(e.map((e=>e.href)))].map((t=>({href:t,title:e.find((e=>e.href===t))?.title||"No title"})));return{total:e,internal:a,external:n,withoutHref:l,unique:r}}},(t=>{let[n]=t;n&&n.result?e(n.result):a(new Error("Error Fetching the Links Details, Please try again later."))}))}))},u=()=>{const[e,t]=(0,n.useState)([]),[a,l]=(0,n.useState)("total"),[r,o]=(0,n.useState)(!0),[c,s]=(0,n.useState)(null);(0,n.useEffect)((()=>{(async()=>{try{const e=await i();t(e)}catch(e){s(e.message)}finally{o(!1)}})()}),[]);const u=(t,a)=>n.createElement("div",{className:"link-item"},n.createElement("span",null,t),n.createElement("span",null,e[a]?.length||0)),m=(e,t)=>n.createElement("button",{className:a===t?"active":"",onClick:()=>l(t)},e);return n.createElement("div",{className:"active-tab-container"},n.createElement("h2",null,"Links"),r?n.createElement("i",{class:"loader --1"}):c?n.createElement("div",{className:"error-message"},n.createElement("p",null,c)):n.createElement(n.Fragment,null,n.createElement("div",{className:"link-counts"},u("Total","total"),u("Internal","internal"),u("External","external"),u("Without href","withoutHref"),u("Unique","unique")),n.createElement("div",{className:"filter-buttons"},m("Total","total"),m("Internal","internal"),m("External","external"),m("No href","withoutHref"),m("Unique","unique"),n.createElement("button",{className:"link-export-button",onClick:()=>{const t=[];t.push("URL,Title,Category,Count"),["internal","external","withoutHref"].forEach((a=>{e[a]?.forEach((n=>{let{href:l,title:r}=n;const o=e.total?.filter((e=>e.href===l)).length||0;t.push(`"${l||"No href"}","${r}","${a}","${o}"`)}))}));const a=t.join("\n"),n=new Blob([a],{type:"text/csv"}),l=URL.createObjectURL(n),r=document.createElement("a");r.href=l,r.download="links.csv",r.click(),URL.revokeObjectURL(l)}},"Export")),n.createElement("div",{className:"links-table"},e[a]?.length>0?e[a].map(((t,a)=>n.createElement(n.Fragment,{key:a},n.createElement("div",{className:"link-details"},n.createElement("p",null,n.createElement("strong",null,"URL:"),t.href?n.createElement("a",{href:t.href,className:"link-url",target:"_blank",rel:"noopener noreferrer"},t.href):"No href"),n.createElement("p",null,n.createElement("strong",null,"Title:")," ",t.title)),n.createElement("div",{className:"link-count"},n.createElement("p",null,n.createElement("strong",null,"Count:")," ",e.total?.filter((e=>e.href===t.href)).length||0))))):n.createElement("div",{className:"no-items",id:"no-links"},n.createElement("p",null,"No Links to show in this ",n.createElement("br",null)," Category"),n.createElement("img",{src:"image/notfound.svg",alt:"Not Found"})))))},m=async e=>new Promise(((t,a)=>{chrome.scripting.executeScript({target:{tabId:e},func:()=>{const e=Array.from(document.querySelectorAll("img")).map((e=>({src:e.src||"No SRC",alt:e.alt||"No ALT",longDesc:e.longdesc||"No Description",width:e.naturalWidth||"N/A",height:e.naturalHeight||"N/A"}))),t=e.filter((e=>"No ALT"===e.alt)),a=e.filter((e=>"No Description"===e.longDesc)),n=e.filter((e=>"No SRC"===e.src));return{total:e,noAlt:t,noLongDesc:a,noSrc:n}}},(e=>{let[n]=e;n?.result?t(n.result):a(new Error("Error Fetching the images details, Please try again later."))}))})),d=()=>{const[e,t]=(0,n.useState)({total:[],noAlt:[],noLongDesc:[],noSrc:[]}),[a,l]=(0,n.useState)("total"),[r,o]=(0,n.useState)(!0),[c,s]=(0,n.useState)(null);(0,n.useEffect)((()=>{(async()=>{try{const[e]=await chrome.tabs.query({active:!0,currentWindow:!0}),a=e.id,n=await m(a);t(n)}catch(e){s(e.message)}finally{o(!1)}})()}),[]);const i=e=>{const t=window.open();t&&(t.document.body.innerHTML=`\n        <div style="text-align: center; margin: 20px;">\n          <img src="${e}" alt="Full Image" style="max-width: 100%; height: auto; margin-bottom: 20px;"/><br/>\n          <a href="${e}" download="${e.split("/").pop()}" \n            style="display: inline-block; padding: 10px 20px; background-color: #0056b3; color: white; text-decoration: none; border-radius: 5px;">\n            Download\n          </a>\n        </div>\n      `)},u=(e,t)=>n.createElement("div",{className:"image-item"},n.createElement("span",null,e),n.createElement("span",null,t||0));return n.createElement("div",{className:"active-tab-container"},n.createElement("h2",null,"Images"),r?n.createElement("i",{class:"loader --1"}):c?n.createElement("div",{className:"error-message"},n.createElement("p",null,c)):n.createElement(n.Fragment,null,n.createElement("div",{className:"image-counts"},u("Total Images",e.total?.length),u("Without ALT",e.noAlt?.length),u("Without Description",e.noLongDesc?.length),u("Without SRC",e.noSrc?.length)),n.createElement("div",{className:"image-nav"},n.createElement("button",{onClick:()=>l("total")},"Total"),n.createElement("button",{onClick:()=>l("noAlt")},"No ALT"),n.createElement("button",{onClick:()=>l("noLongDesc")},"No Description"),n.createElement("button",{onClick:()=>l("noSrc")},"No SRC"),n.createElement("button",{className:"export-button",onClick:()=>{const t=e[a].map((e=>`${e.src},${e.alt},${e.longDesc},${e.width}x${e.height}`)).join("\n"),n=new Blob([`URL,ALT,LongDesc,Size\n${t}`],{type:"text/csv"}),l=URL.createObjectURL(n),r=document.createElement("a");r.href=l,r.download="images.csv",r.click(),URL.revokeObjectURL(l)}},"Export")),n.createElement("div",{className:"images-table"},0===e[a].length?n.createElement("div",{className:"no-items"},n.createElement("p",null,"No Images to show in this Category"),n.createElement("img",{src:"image/notfound.svg",alt:"Not Found"})):e[a].map(((e,t)=>n.createElement(n.Fragment,{key:t},n.createElement("div",{className:"image-details"},n.createElement("p",{onClick:()=>i(e.src)},n.createElement("strong",null,"URL:")," ",n.createElement("span",{className:"image-url"},e.src)),n.createElement("p",null,n.createElement("strong",null,"ALT:")," ",e.alt),n.createElement("p",null,n.createElement("strong",null,"Description:")," ",e.longDesc)),n.createElement("div",{className:"image-preview"},"No SRC"!==e.src?n.createElement("img",{src:e.src,alt:"Preview",onClick:()=>i(e.src)}):n.createElement("p",null,"No SRC"),n.createElement("p",null,e.width,"x",e.height))))))))},g=async e=>new Promise(((t,a)=>{try{chrome.scripting.executeScript({target:{tabId:e},func:()=>{const e=[];return Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).forEach((t=>{e.push({tag:t.tagName.toLowerCase(),text:t.textContent.trim()})})),e}},(e=>{let[n]=e;if(chrome.runtime.lastError)a(chrome.runtime.lastError);else{const e=n.result||[],a={h1:e.filter((e=>"h1"===e.tag)).length,h2:e.filter((e=>"h2"===e.tag)).length,h3:e.filter((e=>"h3"===e.tag)).length,h4:e.filter((e=>"h4"===e.tag)).length,h5:e.filter((e=>"h5"===e.tag)).length,h6:e.filter((e=>"h6"===e.tag)).length};t({headers:e,counts:a})}}))}catch(e){a(e)}})),h=()=>{const[e,t]=(0,n.useState)([]),[a,l]=(0,n.useState)(null),[r,o]=(0,n.useState)(!0),[c,s]=(0,n.useState)({h1:0,h2:0,h3:0,h4:0,h5:0,h6:0});(0,n.useEffect)((()=>{(async()=>{try{const[e]=await chrome.tabs.query({active:!0,currentWindow:!0}),a=e.id,{headers:n,counts:l}=await g(a);t(n),s(l)}catch(e){l(e.message)}finally{o(!1)}})()}),[]);const i=Object.values(c).every((e=>0===e));return n.createElement("div",null,n.createElement("h2",null,"Headers"),r?n.createElement("i",{class:"loader --1"}):a?n.createElement("div",{className:"error-message"},n.createElement("p",null,a)):n.createElement(n.Fragment,null,n.createElement("div",{className:"header-counts"},Object.keys(c).map((e=>n.createElement("div",{className:"header-item",key:e},n.createElement("span",null,e.toUpperCase()),n.createElement("span",null,c[e]||0))))),i?n.createElement("div",{className:"no-items",id:"no-headers"},n.createElement("p",null,"No Headers Found on this Website."),n.createElement("img",{src:"image/notfound.svg",alt:"Not Found"})):n.createElement("div",{className:"header-structure"},e.map(((e,t)=>n.createElement("div",{key:t,className:`header-content header-${e.tag}`},n.createElement("span",{className:"dashed-line"}),n.createElement("strong",null,n.createElement("span",{className:"header-tag"},e.tag)),n.createElement("span",{className:"header-text"},e.text)))))))};var p=a(1219);const E=async()=>new Promise((async(e,t)=>{try{const[a]=await chrome.tabs.query({active:!0,currentWindow:!0}),n=a.id;chrome.scripting.executeScript({target:{tabId:n},func:()=>Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((e=>{try{return JSON.parse(e.innerText)}catch{return null}})).filter(Boolean)},(a=>{chrome.runtime.lastError?t(chrome.runtime.lastError):a&&a.length>0?e(a[0].result||[]):e([])}))}catch(e){t(new Error("Error Fetching the Schema, Please try again later."))}})),f=(e,t,a,n,l,r,o,c,s)=>{let{nodes:i,links:u}=t;p.Ltv(e.current).selectAll("*").remove();const m=p.Ltv(e.current).append("svg").attr("width",c).attr("height",s).call(p.s_O().scaleExtent([.01,5]).on("zoom",(e=>{d.attr("transform",e.transform)}))),d=m.append("g");m.append("defs").append("marker").attr("id","arrow").attr("viewBox","0 -5 10 10").attr("refX",25).attr("refY",0).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("path").attr("d","M0,-5L10,0L0,5").attr("fill","#aaa"),o.current=p.tXi(i).force("link",p.kJC(u).id((e=>e.id)).distance(a)).force("charge",p.xJS().strength(-300)).force("center",p.jTM(c/2,s/2));const g=d.append("g").attr("stroke","#aaa").attr("stroke-width",1).selectAll("line").data(u).join("line").attr("marker-end","url(#arrow)"),h=d.append("g").selectAll("text").data(u).join("text").attr("class","link-label").text((e=>e.linkName||"")).style("font-size",`${n}px`).style("fill","#555"),E=d.append("g").selectAll("circle").data(i).join("circle").attr("r",l).attr("fill",(e=>p.t55[e.id%10])).call(p.$Er().on("start",(function(e){e.active||o.current.alphaTarget(.3).restart(),e.subject.fx=e.subject.x,e.subject.fy=e.subject.y})).on("drag",(function(e){e.subject.fx=e.x,e.subject.fy=e.y})).on("end",(function(e){e.active||o.current.alphaTarget(0),e.subject.fx=null,e.subject.fy=null}))),f=d.append("g").selectAll("text").data(i).join("text").attr("x",6).attr("y",3).text((e=>e.name)).style("font-size",`${n}px`);o.current.on("tick",(()=>{g.attr("x1",(e=>e.source.x)).attr("y1",(e=>e.source.y)).attr("x2",(e=>e.target.x)).attr("y2",(e=>e.target.y)),h.attr("x",(e=>(e.source.x+e.target.x)/2)).attr("y",(e=>(e.source.y+e.target.y)/2)),E.attr("cx",(e=>e.x)).attr("cy",(e=>e.y)),f.attr("x",(e=>e.x)).attr("y",(e=>e.y))}))},b=e=>{const t=[],a=[];t.push({id:0,name:"Schema"});let n=1;const l=function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";if("object"==typeof e&&null!==e){const c=e["@type"],s=c?n++:r;c&&(t.push({id:s,name:e["@type"]||"Object"}),a.push({source:r,target:s,linkName:o})),Object.entries(e).forEach((e=>{let[t,a]=e;"@type"!==t&&l(a,s,t)}))}};return e.forEach((e=>l(e))),{nodes:t,links:a}},v=()=>{const[e,t]=(0,n.useState)([]),[a,l]=(0,n.useState)(70),[r,o]=(0,n.useState)(12),[c,s]=(0,n.useState)(8),[i,u]=(0,n.useState)(!0),[m,d]=(0,n.useState)(null),[g,h]=(0,n.useState)(!1),v=(0,n.useRef)(null),x=(0,n.useRef)(null);(0,n.useEffect)((()=>{(async()=>{h(!0);try{const e=await E();t(e)}catch(e){d(e.message)}finally{h(!1)}})()}),[]),(0,n.useEffect)((()=>{if(e.length>0)try{const t=b(e);f(v,t,a,r,c,0,x,1e3,1e3)}catch(e){d(`Failed to render graph: ${e.message}`)}}),[e]),(0,n.useEffect)((()=>{if(x.current){const e=x.current.force("link");e&&(e.distance(a),x.current.alpha(1).restart())}}),[a]),(0,n.useEffect)((()=>{p.Ltv(v.current).selectAll("text").style("font-size",`${r}px`)}),[r]),(0,n.useEffect)((()=>{p.Ltv(v.current).selectAll("circle").attr("r",c)}),[c]),(0,n.useEffect)((()=>{if(x.current&&v.current){const e=p.Ltv(v.current).selectAll("circle");i?e.call(y(x.current)):e.on(".drag",null)}}),[i]);const y=e=>p.$Er().on("start",(function(t){t.active||e.alphaTarget(.3).restart(),t.subject.fx=t.subject.x,t.subject.fy=t.subject.y})).on("drag",(function(e){e.subject.fx=e.x,e.subject.fy=e.y})).on("end",(function(t){t.active||e.alphaTarget(0),t.subject.fx=null,t.subject.fy=null}));return n.createElement(n.Fragment,null,m&&n.createElement("div",{className:"error-message"},n.createElement("p",null,m)),g&&n.createElement("i",{class:"loader --1"}),!g&&!m&&e.length>0&&n.createElement("div",null,n.createElement("div",{className:"container"},n.createElement("h2",null,"Schema Visualizer"),n.createElement("button",{onClick:()=>u((e=>!e)),id:"pause-play"},i?n.createElement("img",{src:"image/pause.svg",alt:"Pause button"}):n.createElement("img",{src:"image/play.svg",alt:"Play button"})),n.createElement("button",{onClick:()=>(e=>{const t=e.current.querySelector("svg");if(!t)return;const a=t.cloneNode(!0),n=t.getBBox(),l=n.width,r=n.height;a.setAttribute("viewBox",`${n.x} ${n.y} ${l} ${r}`),a.setAttribute("width",l),a.setAttribute("height",r);const o=(new XMLSerializer).serializeToString(a),c=new Blob([o],{type:"image/svg+xml;charset=utf-8"}),s=URL.createObjectURL(c),i=new Image;i.onload=()=>{const e=document.createElement("canvas");e.width=4*l,e.height=4*r;const t=e.getContext("2d");t.fillStyle="white",t.fillRect(0,0,e.width,e.height),t.drawImage(i,0,0,4*l,4*r);const a=document.createElement("a");a.download="schema-graph.png",a.href=e.toDataURL("image/png"),a.click(),URL.revokeObjectURL(s)},i.onerror=()=>{console.error("Error occurred while loading the image for download.")},i.src=s})(v),id:"download-btn"},n.createElement("img",{src:"image/download.svg",alt:"Download Graph"})),n.createElement("div",{className:"controls"},n.createElement("div",{className:"control-item"},n.createElement("label",null,"Font Size"),n.createElement("input",{type:"range",min:"8",max:"30",value:r,onChange:e=>o(Number(e.target.value))}),n.createElement("span",null,r)),n.createElement("div",{className:"control-item"},n.createElement("label",null,"Node Size"),n.createElement("input",{type:"range",min:"5",max:"50",value:c,onChange:e=>s(Number(e.target.value))}),n.createElement("span",null,c)),n.createElement("div",{className:"control-item"},n.createElement("label",null,"Link Distance"),n.createElement("input",{type:"range",min:"20",max:"200",value:a,onChange:e=>l(Number(e.target.value))}),n.createElement("span",null,a)))),n.createElement("div",{ref:v,className:"graph-container"})),!g&&!m&&0===e.length&&n.createElement("div",{className:"no-items"},n.createElement("p",null,"No Schema Found on this Website.")))},x=()=>{const[e,t]=(0,n.useState)(""),[a,l]=(0,n.useState)(null),[r,o]=(0,n.useState)(null),[c,s]=(0,n.useState)(!1),[i,u]=(0,n.useState)(""),m=async(e,t)=>{const a=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${e}&strategy=${t}&key=AIzaSyCdskX2l4jTGn8RXH9zjDqnV31aHdhxTEU`,n=await fetch(a);if(!n.ok)throw new Error("Failed to fetch PageSpeed data");return n.json()},d=(t,a)=>{const l=100*t.categories.performance.score,r=(e=>e>=85?"#4caf50":e>=50?"#ffc107":"#f44336")(l);return n.createElement("div",{className:"score-card"},n.createElement("div",{className:"score-circle",style:{backgroundColor:"white",backgroundImage:`conic-gradient(${r} ${l}%, #f3f3f3 ${l}%)`}},n.createElement("span",null,l)),n.createElement("p",{className:"circle-label"},a," PageSpeed"),n.createElement("p",{className:"url-text"},"Google PageSpeed Insights for ",n.createElement("br",null)," ",n.createElement("span",{className:"url"},e)),(e=>{const t=e.audits;return n.createElement("div",{className:"metrics"},n.createElement("p",null,n.createElement("strong",null,"First Contentful Paint:")," ",t["first-contentful-paint"].displayValue),n.createElement("p",null,n.createElement("strong",null,"Largest Contentful Paint:")," ",t["largest-contentful-paint"].displayValue),n.createElement("p",null,n.createElement("strong",null,"Total Blocking Time:")," ",t["total-blocking-time"].displayValue),n.createElement("p",null,n.createElement("strong",null,"Cumulative Layout Shift:")," ",t["cumulative-layout-shift"].displayValue))})(t))};return n.createElement("div",{className:"pagespeed-container"},n.createElement("h2",null,"Page Speed Test"),n.createElement("button",{onClick:async()=>{u(""),s(!0);try{const e=await(async()=>{const[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return e.url})();t(e);const[a,n]=await Promise.all([m(e,"desktop"),m(e,"mobile")]);l(a.lighthouseResult),o(n.lighthouseResult)}catch(e){u(e.message)}finally{s(!1)}},disabled:c},c?"Running Test...":"Run Speed Test"),c&&n.createElement("div",{className:"active-tab-container"},n.createElement("p",null,"It Might Take a While to Process, Please Wait!"),n.createElement("br",null),n.createElement("i",{class:"loader --1"})),i&&n.createElement("div",{className:"error-message"},n.createElement("p",null,i)),n.createElement("div",{className:"score-container"},r&&d(r,"Mobile"),a&&d(a,"Desktop")),a&&r&&n.createElement("div",{className:"legend"},n.createElement("div",null,n.createElement("span",{className:"legend-color green"}),n.createElement("strong",null,"Good")),n.createElement("div",null,n.createElement("span",{className:"legend-color yellow"}),n.createElement("strong",null,"Can Be Better")),n.createElement("div",null,n.createElement("span",{className:"legend-color red"}),n.createElement("strong",null,"Need to Be Updated"))))},y=()=>n.createElement("footer",{className:"footer"},n.createElement("div",{className:"footer-content"},n.createElement("p",{className:"footer-text"},"For better results, visualization, and automated SEO ",n.createElement("br",null)," audit of your website, visit Digispot-AI."),n.createElement("a",{href:"https://digispot.ai",id:"mainlink",target:"_blank",rel:"noopener noreferrer"},n.createElement("div",{className:"footer-button"},n.createElement("img",{src:"image/icon16.png",alt:"digispot.ai logo",id:"logo"}),"Digispot-AI")))),S=(e,t)=>{const a=e.internal.pageSize.width,n=e.internal.pageSize.height;e.rect(10,10,a-20,n-20),e.rect(8,8,a-16,n-16),e.setFontSize(70),e.setTextColor(220,220,220),e.text("Digispot.AI",a/2,n/2,{align:"center",angle:45}),e.setFontSize(10),e.setTextColor(222,149,149);const l="https://digispot.ai";return e.setFont(void 0,"bold"),e.text("Report by Digispot.AI",a-20,5,{align:"right"}),e.setFont(void 0,"normal"),e.text(l,a-20,n-3,{align:"right"}),e.link(a-20-e.getTextWidth(l),n-13,e.getTextWidth(l),10,{url:l}),e.text(`${t}`,a/2,n-3,{align:"center"}),e.setTextColor(0,0,0),t+1},w=()=>{const[e,t]=(0,n.useState)({}),[l,r]=(0,n.useState)({}),[c,s]=(0,n.useState)({}),[u,d]=(0,n.useState)({headers:[],counts:{}}),[h,p]=(0,n.useState)([]),[v,x]=(0,n.useState)(!0),y=(0,n.useRef)(null),w=(0,n.useRef)(null),[N,k]=(0,n.useState)(!1);return(0,n.useEffect)((()=>{(async()=>{try{const[e]=await chrome.tabs.query({active:!0,currentWindow:!0}),a=e.id,[n,l,c,u]=await Promise.all([o(),i(),m(a),g(a),E()]);t(n),r(l),s(c),d(u)}catch(e){console.error("Error fetching data:",e)}})()}),[]),(0,n.useEffect)((()=>{if(h&&Array.isArray(h)&&h.length>0){const e=b(h);f(y,e,100,12,10,0,w,40,40)}}),[h]),n.createElement("div",{className:"tabs",id:"downloadpdf"},n.createElement("div",{ref:y,className:"noref"}),n.createElement("button",{className:"tab-button",onClick:async()=>{k(!0);const t=new(0,(await a.e(96).then(a.bind(a,5463))).jsPDF);let n=35,r=1;[n,r]=((e,t,a,n)=>{const l=[{label:"Title",value:t.title},{label:"Description",value:t.description},{label:"Canonical",value:t.canonical},{label:"URL",value:t.url},{label:"Language",value:t.lang},{label:"Robots Meta",value:t.robots},{label:"X-Robots Meta",value:t.xRobots}];n=S(e,n),e.setFontSize(16),e.setTextColor(0,123,255),e.setFont(void 0,"bold"),e.text("Website SEO Report",105,20,{align:"center"}),e.setFontSize(14),e.setFont(void 0,"normal"),e.text("Meta Links Data",20,a);let r=a+10;return l.forEach((t=>{r>280&&(e.addPage(),n=S(e,n),r=20),e.setFontSize(12),e.setTextColor(0,0,0),e.text(`${t.label}`,20,r),e.text(":",50,r),e.setFontSize(10),"Not Available"===t.value?e.setTextColor(255,0,0):e.setTextColor(0,0,0),e.splitTextToSize(t.value,140).forEach((t=>{r>280&&(n++,e.addPage(),n=S(e,n),r=20),e.text(t,55,r),r+=7}))})),[r+15,n]})(t,e,n,r),[n,r]=((e,t,a,n)=>{let l=a;return e.setFontSize(14),e.setTextColor(0,123,255),e.text("Links Summary",20,l),l+=10,[{label:"Total Links",value:t.total?.length||0},{label:"Internal Links",value:t.internal?.length||0},{label:"External Links",value:t.external?.length||0},{label:"Without href",value:t.withoutHref?.length||0},{label:"Unique Links",value:t.unique?.length||0}].forEach((t=>{let{label:a,value:r}=t;l+7>270&&(e.addPage(),n=S(e,n),l=20),e.setFontSize(12),e.setTextColor(0,0,0),e.text(`${a}`,20,l),e.text(":",50,l),0===r||"Without href"===a&&r>0?e.setTextColor(255,0,0):e.setTextColor(0,0,0),e.setFontSize(10),e.text(`${r}`,60,l),l+=7})),[l+15,n]})(t,l,n,r),[n,r]=((e,t,a,n)=>{let l=a;return e.setFontSize(14),e.setTextColor(0,123,255),e.text("Image Information",20,l),l+=10,[{label:"Total Images",value:t.total?.length||0},{label:"Without ALT",value:t.noAlt?.length||0},{label:"Without Desc",value:t.noLongDesc?.length||0},{label:"Without SRC",value:t.noSrc?.length||0}].forEach((t=>{let{label:a,value:r}=t;l>270&&(e.addPage(),n=S(e,n),l=20),e.setFontSize(12),e.setTextColor(0,0,0),e.text(`${a}`,20,l),e.text(":",50,l),e.setFontSize(10),r>0&&"Total Images"!==a?e.setTextColor(255,0,0):e.setTextColor(0,0,0),e.text(`${r}`,60,l),l+=7})),[l+15,n]})(t,c,n,r),[n,r]=((e,t,a,n)=>{const l=e.internal.pageSize.height;let r=a;r=Math.max(r,20),e.setFontSize(14),e.setTextColor(0,123,255),e.text("Headers Information",20,r),r+=10;const o=t.counts;return Object.entries(o).forEach((t=>{let[a,o]=t;r>l-20&&(e.addPage(),n=S(e,n),r=20),e.setFontSize(12),e.setTextColor(0,0,0),e.text(`${a.toUpperCase()}`,20,r),e.setFontSize(10),e.text(`:          ${o}`,50,r),r+=7})),r>222.75&&(e.addPage(),n=S(e,n),r=10),r+=10,e.setFontSize(14),e.setTextColor(0,123,255),e.text("Header Details",20,r),r+=10,t.headers.forEach((t=>{let{tag:a,text:o}=t;r>l-20&&(e.addPage(),n=S(e,n),r=20);const c={h1:18,h2:14,h3:12,h4:11,h5:10,h6:9}[a]||10;e.setFontSize(c),e.setTextColor(0,0,0),e.text(`${a.toUpperCase()}:`,1.5*(28-c)+10,r),e.splitTextToSize(o||"No Content",160).forEach((t=>{r>l-20&&(e.addPage(),n=S(e,n),r=20),e.text(t,1.5*(28-c)+10+10,r),r+=7})),r+=5})),[r+10,n]})(t,u,n,r),[n,r]=((e,t,a,n)=>{let l=a+10;const r=15,o=[15,85,50,30];return l>148.5&&(e.addPage(),n=S(e,n),l=20),e.setFontSize(14),e.setTextColor(0,123,255),e.text("Image Information by Category",r,l),l+=10,[{label:"Without ALT",data:t.noAlt||[]},{label:"Without SRC",data:t.noSrc||[]},{label:"Without Description",data:t.noLongDesc||[],specialCondition:(t.noLongDesc?.length||0)===(t.total?.length||0),specialMessage:"All links in the website have no Description."}].forEach((t=>{let{label:a,data:c,specialCondition:s,specialMessage:i}=t;return l>270&&(e.addPage(),n=S(e,n),l=20),e.setFontSize(12),e.setTextColor(0,123,255),e.text(a,r,l),l+=7,s?(e.setFontSize(14),e.setFont(void 0,"bold"),e.setTextColor(255,0,0),e.text(i,25,l),e.setFont(void 0,"normal"),void(l+=15)):0===c.length?(e.setFontSize(10),e.setTextColor(0,255,0),e.text("No images in this category.",25,l),void(l+=15)):(e.setFont(void 0,"bold"),e.setFontSize(10),e.setTextColor(0,0,0),e.text("Index",17,l+2+2),e.text("URL",r+o[0]+2,l+2+2),e.text("ALT",r+o[0]+o[1]+2,l+2+2),e.text("Description",r+o[0]+o[1]+o[2]+2,l+2+2),e.rect(r,l,o[0],7),e.rect(r+o[0],l,o[1],7),e.rect(r+o[0]+o[1],l,o[2],7),e.rect(r+o[0]+o[1]+o[2],l,o[3],7),l+=7,e.setFont(void 0,"normal"),c.forEach(((t,a)=>{let{src:c,alt:s,longDesc:i}=t;const u=e.splitTextToSize(c||"No SRC",o[1]-4),m=e.splitTextToSize(s||"No ALT",o[2]-4),d=e.splitTextToSize(i||"No Desc",o[3]-4),g=5*Math.max(u.length,m.length,d.length)+2;l+g>270&&(e.addPage(),n=S(e,n),l=20),e.rect(r,l,o[0],g),e.rect(r+o[0],l,o[1],g),e.rect(r+o[0]+o[1],l,o[2],g),e.rect(r+o[0]+o[1]+o[2],l,o[3],g),e.text(`${a+1}`,17,l+2+2),e.setTextColor(0,0,139),u.forEach(((t,a)=>{e.text(t,r+o[0]+2,l+2+2+5*a)})),e.link(r+o[0]+2,l+2+2,o[1]-4,g,{url:c}),e.setTextColor(0,0,0),m.forEach(((t,a)=>{e.text(t,r+o[0]+o[1]+2,l+2+2+5*a)})),d.forEach(((t,a)=>{e.text(t,r+o[0]+o[1]+o[2]+2,l+2+2+5*a)})),l+=g})),void(l+=15))})),[l+10,n]})(t,c,n,r),[n,r]=((e,t,a,n)=>{let l=a;return l>148.5&&(e.addPage(),n=S(e,n),l=20),e.setFontSize(14),e.setTextColor(0,123,255),e.text("Links Information by Category",20,l),["internal","external","withoutHref"].forEach((a=>{l+17>270&&(e.addPage(),n=S(e,n),l=20),l+=10,e.setFontSize(14),e.setTextColor(0,123,255),e.text(`${a.charAt(0).toUpperCase()+a.slice(1)} Links`,20,l),l+=10,e.setFontSize(10),e.setTextColor(0,0,0),e.setFont(void 0,"bold"),e.rect(20,l-5,12,7),e.rect(32,l-5,88,7),e.rect(120,l-5,70,7),e.text("Index",22,l),e.text("URL",34,l),e.text("Title",122,l),l+=7,e.setFont(void 0,"normal"),t[a]?.forEach(((t,a)=>{let{href:r,title:o}=t;const c=e.splitTextToSize(r?.trim()||"No href",85),s=e.splitTextToSize(o?.trim()||"No title",68),i=7*Math.max(c.length,s.length);l+i>285&&(e.addPage(),n=S(e,n),l=20,e.setFontSize(10),e.setFont(void 0,"bold"),e.rect(20,l-5,12,7),e.rect(32,l-5,88,7),e.rect(120,l-5,70,7),e.text("Index",22,l),e.text("URL",34,l),e.text("Title",122,l),l+=7,e.setFont(void 0,"normal")),e.rect(20,l-5,12,i),e.rect(32,l-5,88,i),e.rect(120,l-5,70,i),e.setTextColor(0,0,0),e.text(`${a+1}`,22,l),e.setTextColor(0,0,0),s.forEach(((t,a)=>{e.text(t,122,l+7*a)})),e.setTextColor(0,0,139),c.forEach(((t,a)=>{e.text(t,34,l+7*a)}));const u=i,m=l-5;e.link(32,m,88,u,{url:r}),l+=i})),t[a]?.length||(l>270&&(e.addPage(),n=S(e,n),l=20),e.setFontSize(10),e.setTextColor(0,255,0),e.text("No links available in this category.",20,l),e.setTextColor(0,0,0),l+=10)})),[l+10,n]})(t,l,n,r),k(!1),((e,t,a,n,l)=>{const r=t.current.querySelector("svg");if(!r)return a>277&&(e.addPage(),l=S(e,l),a=20),e.setFontSize(14),e.setTextColor(0,123,255),e.text("Schema Structure",105,a-10,{align:"center"}),e.setFontSize(12),e.setTextColor(255,0,0),e.text("No Schema in the Website to show.",20,a),void e.save(`SEOAudit report-${n||"Website"}.pdf`);const o=r.cloneNode(!0),c=r.getBBox(),s=c.width,i=c.height;o.setAttribute("viewBox",`${c.x} ${c.y} ${s} ${i}`),o.setAttribute("width",s),o.setAttribute("height",i);const u=(new XMLSerializer).serializeToString(o),m=new Blob([u],{type:"image/svg+xml;charset=utf-8"}),d=URL.createObjectURL(m),g=new Image;g.onload=()=>{const t=document.createElement("canvas");t.width=4*s,t.height=4*i;const r=t.getContext("2d");r.fillStyle="white",r.fillRect(0,0,t.width,t.height),r.drawImage(g,0,0,4*s,4*i);const o=document.createElement("a");o.href=t.toDataURL("image/png");const c=180,u=200;let m=s,h=i;const p=m/h;(m>c||h>u)&&(m/c>h/u?(m=c,h=c/p):(h=u,m=u*p));const E=(e.internal.pageSize.width-m)/2,f=e.internal.pageSize.height;a+h+40>f?(e.addPage(),l=S(e,l),a=30):a+=20,e.setFontSize(14),e.setTextColor(0,123,255),e.text("Schema Structure",105,a-10,{align:"center"}),e.addImage(o.href,"PNG",E,a+10,m,h),URL.revokeObjectURL(d),e.save(`SEOAudit report-${n||"Website"}.pdf`)},g.onerror=()=>{console.error("Error occurred while loading the image for download.")},g.src=d})(t,y,n,e.title,r)},id:"downloadbutton"},"Download as PDF"),n.createElement("div",{className:"noref"},N&&n.createElement("img",{src:"image/loading.gif",alt:"Loader"})))},N=()=>{const[e,t]=(0,n.useState)("summary");return n.createElement("div",{className:"app-container"},n.createElement(r,{activeTab:e,setActiveTab:t}),n.createElement(w,null),n.createElement("div",{className:"app-content"},"summary"===e&&n.createElement(s,null),"links"===e&&n.createElement(u,null),"images"===e&&n.createElement(d,null),"headers"===e&&n.createElement(h,null),"schema"===e&&n.createElement(v,null),"pagespeedtest"===e&&n.createElement(x,null)),n.createElement(y,null))};l.createRoot(document.getElementById("root")).render(n.createElement(N,null))}},l={};function r(e){var t=l[e];if(void 0!==t)return t.exports;var a=l[e]={exports:{}};return n[e].call(a.exports,a,a.exports,r),a.exports}r.m=n,e=[],r.O=(t,a,n,l)=>{if(!a){var o=1/0;for(u=0;u<e.length;u++){for(var[a,n,l]=e[u],c=!0,s=0;s<a.length;s++)(!1&l||o>=l)&&Object.keys(r.O).every((e=>r.O[e](a[s])))?a.splice(s--,1):(c=!1,l<o&&(o=l));if(c){e.splice(u--,1);var i=n();void 0!==i&&(t=i)}}return t}l=l||0;for(var u=e.length;u>0&&e[u-1][2]>l;u--)e[u]=e[u-1];e[u]=[a,n,l]},a=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,r.t=function(e,n){if(1&n&&(e=this(e)),8&n)return e;if("object"==typeof e&&e){if(4&n&&e.__esModule)return e;if(16&n&&"function"==typeof e.then)return e}var l=Object.create(null);r.r(l);var o={};t=t||[null,a({}),a([]),a(a)];for(var c=2&n&&e;"object"==typeof c&&!~t.indexOf(c);c=a(c))Object.getOwnPropertyNames(c).forEach((t=>o[t]=()=>e[t]));return o.default=()=>e,r.d(l,o),l},r.d=(e,t)=>{for(var a in t)r.o(t,a)&&!r.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},r.e=()=>Promise.resolve(),r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={887:0};r.O.j=t=>0===e[t];var t=(t,a)=>{var n,l,[o,c,s]=a,i=0;if(o.some((t=>0!==e[t]))){for(n in c)r.o(c,n)&&(r.m[n]=c[n]);if(s)var u=s(r)}for(t&&t(a);i<o.length;i++)l=o[i],r.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return r.O(u)},a=self.webpackChunkwebsite_info_crawler=self.webpackChunkwebsite_info_crawler||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})();var o=r.O(void 0,[96],(()=>r(7337)));o=r.O(o)})();
//# sourceMappingURL=popup.js.map