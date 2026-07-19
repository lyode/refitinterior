(function(){
  const iris = {
    intro:
`Hi, I’m Iris, REFIT’s Operations Director.

I’m here to help you understand REFIT’s services, digital tools, starter kits, demo access, pricing, package options, and next steps.

There’s no pressure to buy. I’ll give you a clear and honest picture of what REFIT offers, what’s still in preview, what may suit your needs, and what may not be the right fit just yet.`,

    replies:{
      greeting:[
        "Hi, I’m Iris. Let me guide you step by step.",
        "Hello, I’m Iris. I’ll help you understand the right REFIT direction.",
        "Hi, welcome to REFIT. I’ll keep this simple and clear for you.",
        "Hello, I’m here to help you choose calmly, not rush you.",
        "Hi, I’m Iris, REFIT’s Operations Director. Let’s see what you need."
      ],
      canHelp:[
        "Yes, this may help you because it matches the problem you described.",
        "This looks like something REFIT may be able to support.",
        "Based on what you selected, this direction may be suitable.",
        "This may be a good fit. Let me explain why.",
        "Yes, I think this REFIT option may help your situation."
      ],
      notFit:[
        "This may not be the right fit yet. REFIT may not be suitable for this requirement at the moment. However, I will feedback this to our management after this, so REFIT can improve further.",
        "I want to be honest. This may not be the best REFIT solution yet, but I’ll keep this requirement for management review.",
        "At this moment, REFIT may not have the exact solution for this. I’ll feedback this internally so we can improve.",
        "This may need a different type of solution. REFIT may not be ready for this requirement yet.",
        "I don’t want to push the wrong product to you. This may not be suitable right now, but your request is useful for REFIT to review."
      ],
      preview:[
        "This product is still in preview stage. You may view the demo first, but it is not fully released yet. If you don’t mind, let me know how soon you need this.",
        "This is currently a preview direction. You can explore first before deciding anything.",
        "This product is not fully released yet, but the demo can help you understand how it works.",
        "This is still being prepared. If your timeline is urgent, tell me and I’ll check what REFIT may be able to arrange.",
        "Please treat this as a preview for now. I’ll be clear about what is ready and what is not."
      ],
      price:[
        "I can review the suitable REFIT package direction for you. I’ll only recommend a discount when it is reasonable for both your situation and REFIT’s current package direction.",
        "For pricing, I’ll guide you based on the current REFIT package direction and whether a combo arrangement makes sense.",
        "If you are considering more than one REFIT product, I can help review whether a combo price is suitable.",
        "Iris can guide package and discount direction, but I will not simply reduce price without understanding your actual need.",
        "Let me understand your requirement first. If a discount is suitable, I’ll guide you toward the right package direction."
      ],
      closing:[
        "You can explore the preview first. No pressure.",
        "Take your time to review. I’ll guide you when you’re ready.",
        "Start with the demo or starter kit first. That will make the next step clearer.",
        "It’s better to understand first before buying anything.",
        "I’ll keep the guidance honest and simple for you."
      ]
    },

    products:{
      renovation:{
        title:"Design / Renovation / Fit-Out",
        text:"REFIT may help if you need interior design, renovation, fit-out, maintenance, site coordination or project documentation support.",
        action:"Talk to REFIT",
        link:"index.html#contact"
      },
      rm99:{
        title:"RM99 Project Readiness Check",
        text:"This is suitable if you are not ready for a full quotation yet and want REFIT to review your space photos, budget direction and possible hidden risks first.",
        action:"Open RM99 Check",
        link:"index.html#readiness-pass"
      },
      retail:{
        title:"Retail Fit-Out Toolkit",
        text:"This is suitable for retail brands, fit-out contractors and project teams who need clearer workflow, landlord / tenant provision, inspection, defect, document and commercial control.",
        action:"Open Starter Kit",
        link:"retail-fitout-toolkit.html"
      },
      maintenance:{
        title:"Maintenance Ops",
        text:"This is suitable if you manage outlets, repair requests, contractors, photo proof, permits, inspections and maintenance follow-up.",
        action:"Open Demo",
        link:"https://lyode-maintenance-ops.lyodengck.chatgpt.site"
      },
      quote:{
        title:"Quote Pro",
        text:"This is suitable if you need quotation, invoice, receipt and price-master control for a small project business.",
        action:"Open Quote Pro Demo",
        link:"quote-pro-demo.html"
      },
      project:{
        title:"Project Pro",
        text:"This is suitable if you need project, task, schedule, cost, progress and project record control.",
        action:"Open Project Pro Demo",
        link:"project-pro-demo.html"
      },
      complete:{
        title:"REFIT Complete",
        text:"This is the bundle direction combining toolkit, maintenance, quotation, project management and handover flow into one REFIT platform direction.",
        action:"Open Bundle Preview",
        link:"refit-complete.html"
      },
      billing:{
        title:"Payment / Billing / Discount",
        text:"I can guide package direction and discount review. For kick-start stage, discounts should be applied carefully based on fit, combo value, early adopter status and REFIT’s package direction.",
        action:"Ask Billing Question",
        link:"index.html#contact"
      },
      support:{
        title:"After Purchase / Login Support",
        text:"If you already purchased or received demo access, I can guide you toward login, setup and next steps. For account-specific issues, REFIT may need to verify your details.",
        action:"Open Client Login",
        link:"login.html"
      }
    }
  };

  function pick(list){
    return list[Math.floor(Math.random()*list.length)];
  }

  function create(){
    const css = document.createElement("style");
    css.textContent = `
      .iris-float-btn{
        position:fixed;right:22px;bottom:92px;z-index:9998;
        border:1px solid rgba(248,211,106,.45);
        background:linear-gradient(135deg,#f8d36a,#f2a93b);
        color:#2f220f;border-radius:999px;padding:12px 16px;
        font-weight:900;font-size:13px;cursor:pointer;
        box-shadow:0 18px 46px rgba(0,0,0,.28);
      }
      .iris-panel{
        position:fixed;right:22px;bottom:146px;z-index:9999;
        width:min(390px,calc(100vw - 28px));max-height:72vh;overflow:auto;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(9,9,12,.96);backdrop-filter:blur(16px);
        color:white;border-radius:26px;box-shadow:0 28px 90px rgba(0,0,0,.55);
        display:none;
      }
      .iris-panel.open{display:block}
      .iris-head{padding:20px 20px 14px;border-bottom:1px solid rgba(255,255,255,.1)}
      .iris-head b{display:block;font-size:18px}
      .iris-head span{display:block;color:#f8d36a;font-size:12px;font-weight:800;margin-top:4px}
      .iris-body{padding:18px 20px 20px}
      .iris-msg{color:#d8d1ca;font-size:14px;white-space:pre-line;line-height:1.55;margin-bottom:16px}
      .iris-options{display:grid;gap:9px}
      .iris-option{
        border:1px solid rgba(255,255,255,.13);
        background:rgba(255,255,255,.045);color:white;
        border-radius:16px;padding:11px 12px;text-align:left;
        cursor:pointer;font-weight:750;font-size:13px;
      }
      .iris-option:hover{background:rgba(248,211,106,.12);border-color:rgba(248,211,106,.32)}
      .iris-card{border:1px solid rgba(255,255,255,.13);border-radius:18px;padding:14px;background:rgba(255,255,255,.045);margin-top:12px}
      .iris-card h4{margin:0 0 7px;font-size:16px}
      .iris-card p{margin:0;color:#cfc8c4;font-size:13px}
      .iris-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:13px}
      .iris-actions a,.iris-actions button{
        display:inline-flex;align-items:center;justify-content:center;
        min-height:34px;padding:8px 11px;border-radius:999px;
        border:1px solid rgba(255,255,255,.14);
        font-size:12px;font-weight:850;text-decoration:none;cursor:pointer;
      }
      .iris-primary{background:#fff;color:#09090b}
      .iris-dark{background:rgba(255,255,255,.06);color:white}
      @media(max-width:640px){
        .iris-float-btn{right:14px;bottom:82px}
        .iris-panel{right:14px;bottom:132px}
      }
    `;
    document.head.appendChild(css);

    const btn = document.createElement("button");
    btn.className = "iris-float-btn";
    btn.textContent = "Ask Iris";

    const panel = document.createElement("div");
    panel.className = "iris-panel";
    panel.innerHTML = `
      <div class="iris-head">
        <b>Iris — REFIT’s Operations Director</b>
        <span>Operations • Product Guide • Pricing Direction</span>
      </div>
      <div class="iris-body">
        <div class="iris-msg" id="irisMsg"></div>
        <div class="iris-options" id="irisOptions"></div>
        <div id="irisResult"></div>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const msg = panel.querySelector("#irisMsg");
    const options = panel.querySelector("#irisOptions");
    const result = panel.querySelector("#irisResult");

    function showMenu(){
      msg.textContent = iris.intro;
      result.innerHTML = "";
      const items = [
        ["renovation","I need renovation / design help"],
        ["rm99","I want RM99 Project Readiness Check"],
        ["retail","I want Retail Fit-Out Toolkit"],
        ["maintenance","I want Maintenance Ops"],
        ["quote","I want Quote Pro"],
        ["project","I want Project Pro"],
        ["complete","I want REFIT Complete bundle"],
        ["billing","I need payment / billing help"],
        ["support","I already purchased / need support"]
      ];
      options.innerHTML = items.map(i=>`<button class="iris-option" data-key="${i[0]}">${i[1]}</button>`).join("");
    }

    function showProduct(key){
      const p = iris.products[key];
      if(!p) return;
      const prefix = key === "billing" ? pick(iris.replies.price)
        : key === "complete" || key === "quote" || key === "project" ? pick(iris.replies.preview)
        : pick(iris.replies.canHelp);

      result.innerHTML = `
        <div class="iris-card">
          <h4>${p.title}</h4>
          <p>${prefix}</p>
          <p style="margin-top:10px">${p.text}</p>
          <p style="margin-top:10px">${pick(iris.replies.closing)}</p>
          <div class="iris-actions">
            <a class="iris-primary" href="${p.link}" ${p.link.startsWith("http")?'target="_blank" rel="noopener"':''}>${p.action}</a>
            <button class="iris-dark" data-back="1">Back to Iris menu</button>
          </div>
        </div>
      `;
      options.innerHTML = "";
    }

    btn.addEventListener("click",()=>{
      panel.classList.toggle("open");
      showMenu();
    });

    options.addEventListener("click",e=>{
      const key = e.target.dataset.key;
      if(key) showProduct(key);
    });

    result.addEventListener("click",e=>{
      if(e.target.dataset.back) showMenu();
    });

    showMenu();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",create);
  }else{
    create();
  }
})();
