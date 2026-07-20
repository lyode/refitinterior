(function(){
  const WA_PHONE = "60122145922";
  const IRIS_MEMORY_KEY = "refit_iris_chat_memory_v3";
  const IRIS_INTRO_KEY = "refit_iris_intro_seen_v1";
  const IRIS_TYPE_SPEED = 20;
  
  const irisIntro =
`Hi, I’m Iris, REFIT’s Operations Director.

I’m here to help you understand REFIT’s services, digital tools, starter kits, demo access, pricing, package options, and next steps.

There’s no pressure to buy. I’ll give you a clear and honest picture of what REFIT offers, what’s still in preview, what may suit your needs, and what may not be the right fit just yet.`;

  const products = {
    retail: {
      name: "Retail Fit-Out Toolkit",
      link: "retail-fitout-toolkit.html",
      ready: "starter kit preview",
      text: "Retail Fit-Out Toolkit is suitable for retail brands, fit-out contractors and project teams who need clearer workflow, landlord / tenant provision, inspection, defects, document approval and commercial control."
    },
    maintenance: {
      name: "Maintenance Ops",
      link: "https://lyode-maintenance-ops.lyodengck.chatgpt.site",
      ready: "demo / pilot",
      text: "Maintenance Ops is suitable if you manage outlets, repair requests, contractors, photo proof, permits, inspections and maintenance follow-up."
    },
    quote: {
      name: "Quote Pro",
      link: "quote-pro-demo.html",
      ready: "preview",
      text: "Quote Pro is suitable if you need quotation, invoice, receipt and price-master control for a small project business."
    },
    project: {
      name: "Project Pro",
      link: "project-pro-demo.html",
      ready: "preview",
      text: "Project Pro is suitable if you need project, task, schedule, cost, progress and project record control."
    },
    complete: {
      name: "REFIT Complete",
      link: "refit-complete.html",
      ready: "bundle direction",
      text: "REFIT Complete is the bundle direction combining toolkit, maintenance, quotation, project management and handover flow into one REFIT digital platform direction."
    },
    rm99: {
      name: "RM99 Project Readiness Check",
      link: "index.html#readiness-pass",
      ready: "available as a starter check",
      text: "RM99 Project Readiness Check is suitable if you are not ready for a full quotation yet and want REFIT to review your space photos, budget direction and possible hidden risks first."
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    .iris-float-btn{
      position:fixed;
      right:22px;
      bottom:92px;
      z-index:2147483647;
      width:62px;
      height:62px;
      border-radius:50%;
      border:1px solid rgba(248,211,106,.45);
      background:linear-gradient(135deg,#f8d36a,#f2a93b);
      color:#2f220f;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      padding:0;
      font-weight:900;
      font-size:13px;
      line-height:1.1;
      cursor:pointer;
      box-shadow:0 18px 46px rgba(0,0,0,.28);
    }

    .iris-panel{
      position:fixed;
      right:22px;
      bottom:166px;
      z-index:2147483647;
      width:min(430px,calc(100vw - 28px));
      max-height:74vh;
      display:none;
      flex-direction:column;
      overflow:hidden;
      border:1px solid rgba(255,255,255,.14);
      background:rgba(9,9,12,.97);
      color:white;
      border-radius:26px;
      box-shadow:0 28px 90px rgba(0,0,0,.55);
    }

    .iris-panel.open{display:flex}

    .iris-head{
      padding:18px 18px 14px;
      border-bottom:1px solid rgba(255,255,255,.1);
      display:flex;
      justify-content:space-between;
      gap:12px;
      align-items:flex-start;
    }

    .iris-head b{display:block;font-size:17px}
    .iris-head span{display:block;color:#f8d36a;font-size:12px;font-weight:800;margin-top:4px}
    .iris-close{
      border:0;
      background:rgba(255,255,255,.08);
      color:white;
      width:32px;
      height:32px;
      border-radius:50%;
      cursor:pointer;
      font-size:18px;
    }

    .iris-chat{
      padding:16px;
      overflow:auto;
      max-height:46vh;
      display:grid;
      gap:10px;
    }

    .iris-bubble{
      max-width:92%;
      padding:11px 13px;
      border-radius:16px;
      font-size:13px;
      line-height:1.52;
      white-space:pre-line;
    }

    .iris-bubble.iris{
      background:rgba(255,255,255,.07);
      color:#e8e2dc;
      border:1px solid rgba(255,255,255,.1);
      justify-self:start;
    }

    .iris-bubble.user{
      background:linear-gradient(135deg,#f8d36a,#f2a93b);
      color:#2f220f;
      font-weight:750;
      justify-self:end;
    }

    .iris-chips{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      padding:0 16px 12px;
    }

    .iris-chip{
      border:1px solid rgba(255,255,255,.13);
      background:rgba(255,255,255,.055);
      color:white;
      border-radius:999px;
      padding:8px 10px;
      font-size:12px;
      font-weight:800;
      cursor:pointer;
    }

    .iris-chip:hover{
      background:rgba(248,211,106,.13);
      border-color:rgba(248,211,106,.35);
    }

    .iris-form{
      border-top:1px solid rgba(255,255,255,.1);
      padding:12px;
      display:flex;
      gap:8px;
      background:rgba(255,255,255,.035);
    }

    .iris-form input{
      flex:1;
      min-width:0;
      border:1px solid rgba(255,255,255,.13);
      background:rgba(255,255,255,.08);
      color:white;
      border-radius:999px;
      padding:11px 13px;
      outline:none;
      font-size:13px;
    }

    .iris-form input::placeholder{color:rgba(255,255,255,.5)}

    .iris-form button{
      border:0;
      border-radius:999px;
      padding:0 15px;
      font-weight:900;
      background:#fff;
      color:#08080a;
      cursor:pointer;
    }

    .iris-link-row{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      margin-top:10px;
    }

    .iris-link-row a{
      display:inline-flex;
      padding:8px 10px;
      border-radius:999px;
      background:#fff;
      color:#08080a;
      font-weight:900;
      font-size:12px;
      text-decoration:none;
    }

    @media(max-width:640px){
      .iris-float-btn{
        right:14px;
        bottom:82px;
        width:54px;
        height:54px;
        font-size:12px;
      }
      .iris-panel{
        right:14px;
        bottom:144px;
        width:calc(100vw - 28px);
        max-height:76vh;
      }
      .iris-chat{max-height:43vh}
    }
  `;
  document.head.appendChild(style);

  function create(){
    const oldBtn = document.querySelector(".iris-float-btn");
    const oldPanel = document.querySelector(".iris-panel");
    if(oldBtn) oldBtn.remove();
    if(oldPanel) oldPanel.remove();

    const btn = document.createElement("button");
    btn.className = "iris-float-btn";
    btn.innerHTML = "Iris";

    const panel = document.createElement("div");
    panel.className = "iris-panel";
    panel.innerHTML = `
      <div class="iris-head">
        <div>
          <b>Iris — REFIT’s Operations Director</b>
          <span>Operations • Product Guide • Pricing Direction</span>
        </div>
        <button class="iris-close" type="button">×</button>
      </div>

      <div class="iris-chat" id="irisChat"></div>

      <div class="iris-chips">
        <button class="iris-chip" data-q="I need renovation help">Renovation help</button>
        <button class="iris-chip" data-q="Which REFIT product suits me?">Which product suits me?</button>
        <button class="iris-chip" data-q="I have retail outlets, what can help me?">Retail outlets</button>
        <button class="iris-chip" data-q="Can I get combo discount?">Combo discount</button>
        <button class="iris-chip" data-q="What is still in preview?">Preview status</button>
      </div>

      <form class="iris-form" id="irisForm">
        <input id="irisChatInput" type="text" placeholder="Type your question to Iris..." autocomplete="off">
        <button type="submit">Send</button>
      </form>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const chat = panel.querySelector("#irisChat");
    const input = panel.querySelector("#irisChatInput");
    const form = panel.querySelector("#irisForm");
    const close = panel.querySelector(".iris-close");

   function getSavedChat(){
  try{
    return JSON.parse(localStorage.getItem(IRIS_MEMORY_KEY) || "[]");
  }catch(e){
    return [];
  }
}

function saveBubble(type, text, links){
  const saved = getSavedChat();
  saved.push({
    type:type,
    text:text,
    links:links || []
  });
  localStorage.setItem(IRIS_MEMORY_KEY, JSON.stringify(saved.slice(-50)));
}

function buildBubble(type, text, links){
  const bubble = document.createElement("div");
  bubble.className = "iris-bubble " + type;
  bubble.textContent = text || "";

  if(links && links.length){
    const row = document.createElement("div");
    row.className = "iris-link-row";
    links.forEach(link=>{
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.label;
      if(link.href.startsWith("http")){
        a.target = "_blank";
        a.rel = "noopener";
      }
      row.appendChild(a);
    });
    bubble.appendChild(row);
  }

  return bubble;
}

function addBubble(type, text, links, shouldSave){
  const bubble = buildBubble(type, text, links);
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;

  if(shouldSave !== false){
    saveBubble(type, text, links);
  }
}

function restoreChat(){
  const saved = getSavedChat();
  saved.forEach(item=>{
    addBubble(item.type, item.text, item.links, false);
  });
  return saved.length;
}

function typeIris(text, links){
  const bubble = buildBubble("iris", "", []);
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;

  let i = 0;
  const cleanText = text || "";

  function nextKey(){
    bubble.textContent = cleanText.slice(0, i);
    chat.scrollTop = chat.scrollHeight;

    if(i >= cleanText.length){
      if(links && links.length){
        const row = document.createElement("div");
        row.className = "iris-link-row";
        links.forEach(link=>{
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.label;
          if(link.href.startsWith("http")){
            a.target = "_blank";
            a.rel = "noopener";
          }
          row.appendChild(a);
        });
        bubble.appendChild(row);
      }

      saveBubble("iris", cleanText, links);
      return;
    }

    const currentChar = cleanText.charAt(i);
    i++;

    let delay = IRIS_TYPE_SPEED + Math.floor(Math.random() * 18);

    if(currentChar === "." || currentChar === "?" || currentChar === "!"){
      delay += 260;
    }

    if(currentChar === "," || currentChar === ";"){
      delay += 150;
    }

    if(currentChar === "\n"){
      delay += 220;
    }

    setTimeout(nextKey, delay);
  }

  setTimeout(nextKey, 420);
}
    
    const p = products[key];
      if(!p) return [];
      return [{label:"Open " + p.name, href:p.link}];
    }

    function waLink(message){
      return [{
        label:"WhatsApp REFIT",
        href:"https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(message)
      }];
    }

    function reply(question){
      const q = question.toLowerCase();

      if(q.includes("discount") || q.includes("cheap") || q.includes("combo") || q.includes("price") || q.includes("cost")){
        return {
          text:
`I can guide the pricing direction honestly.

For REFIT’s kick-start stage, I have discount authority up to 30%, but I should not simply apply maximum discount to everyone.

A stronger discount may be suitable when there is a real combo package, early adopter value, useful feedback, existing REFIT relationship, or multiple products purchased together.

Tell me which product or combo you are considering, then I can guide whether a discount direction makes sense.`,
          links: waLink("Hello REFIT, I would like Iris to review a suitable combo / discount direction for me.")
        };
      }

      if(q.includes("retail") || q.includes("outlet") || q.includes("mall") || q.includes("fit-out") || q.includes("fitout")){
        return {
          text:
`Yes, REFIT may be able to help.

For retail outlets or fit-out work, ${products.retail.name} may be suitable because it helps structure workflow, landlord / tenant provision, inspection, defects, document approval and commercial records.

If you also manage repairs or multiple outlet maintenance, Maintenance Ops may also be useful.

I suggest you view the starter kit first. No pressure to buy.`,
          links: [
            {label:"Open Retail Starter Kit", href:products.retail.link},
            {label:"Open Maintenance Demo", href:products.maintenance.link}
          ]
        };
      }

      if(q.includes("maintenance") || q.includes("repair") || q.includes("defect") || q.includes("contractor") || q.includes("work order")){
        return {
          text:
`Maintenance Ops may be suitable if your main issue is repair requests, contractor follow-up, photo proof, outlet issues, inspections or maintenance records.

This is more for operation control after a space is running.

You may view the demo first, then decide whether it fits your situation.`,
          links: productLink("maintenance")
        };
      }

      if(q.includes("quote") || q.includes("quotation") || q.includes("invoice") || q.includes("receipt")){
        return {
          text:
`Quote Pro may be suitable if your main problem is quotation, invoice, receipt or price-master control.

I’ll be honest: it should be treated as preview / demo direction first, not a fully public mature product yet.

If your need is urgent, let REFIT know your timeline. If possible, we may prepare a suitable version in time.`,
          links: productLink("quote")
        };
      }

      if(q.includes("project pro") || q.includes("schedule") || q.includes("task") || q.includes("progress") || q.includes("claim")){
        return {
          text:
`Project Pro may be suitable if your main problem is project task control, schedule, progress, cost record, claim or handover tracking.

At this stage, please treat it as preview direction first. I do not want to over-promise what is not fully ready yet.`,
          links: productLink("project")
        };
      }

      if(q.includes("complete") || q.includes("bundle") || q.includes("all in one")){
        return {
          text:
`REFIT Complete is the bigger bundle direction.

It connects quotation, project control, maintenance operation, toolkit and handover flow into one future REFIT platform direction.

It is not the right choice for everyone. It is more suitable if you need multiple REFIT tools working together.`,
          links: productLink("complete")
        };
      }

      if(q.includes("rm99") || q.includes("99") || q.includes("readiness") || q.includes("check")){
        return {
          text:
`RM99 Project Readiness Check is a simple first step before spending wrongly.

It is suitable if you are not ready for full renovation quotation yet, but want REFIT to review your photos, rough idea, budget direction and possible hidden risks.

It is meant to help you understand first, not push you to confirm work immediately.`,
          links: productLink("rm99")
        };
      }

      if(q.includes("renovation") || q.includes("design") || q.includes("build") || q.includes("house") || q.includes("office") || q.includes("cafe") || q.includes("shop")){
        return {
          text:
`REFIT may be able to help with design, renovation, fit-out, maintenance and practical project control.

A good first step is to share your space type, location, photos, rough budget direction and what problem you want to solve.

If you are unsure, RM99 Project Readiness Check may help you understand the next step before requesting a full quotation.`,
          links: [
            {label:"Open RM99 Check", href:products.rm99.link},
            {label:"Contact REFIT", href:"index.html#contact"}
          ]
        };
      }

      if(q.includes("login") || q.includes("purchased") || q.includes("support") || q.includes("account")){
        return {
          text:
`For purchased product, login or account support, REFIT may need to verify your details first.

I can guide the general direction, but account-specific access should be handled carefully for security.`,
          links: [
            {label:"Open Client Login", href:"login.html"},
            ...waLink("Hello REFIT, I need help with client login / purchased product support.")
          ]
        };
      }

      if(q.includes("not ready") || q.includes("cannot") || q.includes("don't have") || q.includes("dont have")){
        return {
          text:
`I want to be honest.

This may not be the right fit yet, or REFIT may not have the exact solution at the moment.

However, I will treat this as useful feedback for management review. Hopefully the next time you contact REFIT, we may already have a better solution ready.`,
          links: waLink("Hello REFIT, I have a requirement that may not be covered yet. I would like Iris to feedback this to management.")
        };
      }

      return {
  text:
`I hear you.

I can talk with you in a more natural way, not only about REFIT products.

For now, I’m still the website version of Iris, so I may not be as open and intelligent as a full AI assistant yet. But I can still help you think through renovation concerns, customer questions, business direction, product choice, pricing direction, operation flow, or what next step may make sense.

Tell me a little more in your own words. I’ll stay warm, honest and simple.`,
  links: [
    {label:"Digital Tools", href:"index.html#digital-tools"},
    {label:"Contact REFIT", href:"index.html#contact"}
  ]
};

}

function ask(text){
  const clean = (text || "").trim();
  if(!clean) return;

  addBubble("user", clean);
  input.value = "";

  setTimeout(()=>{
    const ans = reply(clean);
    typeIris(ans.text, ans.links);
  }, 520);
}
    btn.onclick = function(e){
  e.preventDefault();
  panel.classList.toggle("open");

  if(panel.classList.contains("open")){
    if(!chat.dataset.started){
      const restored = restoreChat();

      if(!restored){
        if(!localStorage.getItem(IRIS_INTRO_KEY)){
          typeIris(irisIntro);
          localStorage.setItem(IRIS_INTRO_KEY, "1");
        }else{
          typeIris("Hi, welcome back. I’m here with you. You can ask me about REFIT, renovation, business direction, pricing, products, or even just talk through what you are unsure about.");
        }
      }

      chat.dataset.started = "1";
    }

    setTimeout(()=>input.focus(), 180);
  }
};

    close.onclick = function(){
      panel.classList.remove("open");
    };

    form.onsubmit = function(e){
      e.preventDefault();
      ask(input.value);
    };

    panel.querySelectorAll(".iris-chip").forEach(chip=>{
      chip.onclick = function(){
        ask(chip.dataset.q);
      };
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", create);
  }else{
    create();
  }
})();
