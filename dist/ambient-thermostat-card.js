var U=globalThis,I=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),ne=new WeakMap;class z{constructor(e,t,s){if(this._$cssResult$=!0,s!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(I&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ne.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ne.set(t,e))}return e}toString(){return this.cssText}}var re=(e)=>new z(typeof e=="string"?e:e+"",void 0,K),W=(e,...t)=>{let s=e.length===1?e[0]:t.reduce((i,n,r)=>i+((o)=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[r+1],e[0]);return new z(s,e,K)},oe=(e,t)=>{if(I)e.adoptedStyleSheets=t.map((s)=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of t){let i=document.createElement("style"),n=U.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=s.cssText,e.appendChild(i)}},F=I?(e)=>e:(e)=>e instanceof CSSStyleSheet?((t)=>{let s="";for(let i of t.cssRules)s+=i.cssText;return re(s)})(e):e;var{is:je,defineProperty:Ke,getOwnPropertyDescriptor:We,getOwnPropertyNames:Fe,getOwnPropertySymbols:qe,getPrototypeOf:Ze}=Object,L=globalThis,ae=L.trustedTypes,Ge=ae?ae.emptyScript:"",Je=L.reactiveElementPolyfillSupport,T=(e,t)=>e,q={toAttribute(e,t){switch(t){case Boolean:e=e?Ge:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(i){s=null}}return s}},ce=(e,t)=>!je(e,t),de={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:ce};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;class _ extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=de){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ke(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=We(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let o=i?.call(this);n?.call(this,r),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??de}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let e=Ze(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let t=this.properties,s=[...Fe(t),...qe(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(F(i))}else e!==void 0&&t.push(F(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e)=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e)=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return oe(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e)=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e)=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:q).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:q;this._$Em=i;let o=r.fromAttribute(t,n.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let r=this.constructor;if(i===!1&&(n=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??ce)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),n!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:r}=n,o=this[i];r!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,n,o)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((s)=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((t)=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((t)=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}}_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[T("elementProperties")]=new Map,_[T("finalized")]=new Map,Je?.({ReactiveElement:_}),(L.reactiveElementVersions??=[]).push("2.1.2");var Z=globalThis,le=(e)=>e,D=Z.trustedTypes,he=D?D.createPolicy("lit-html",{createHTML:(e)=>e}):void 0;var b=`lit$${Math.random().toFixed(9).slice(2)}$`,_e="?"+b,Ye=`<${_e}>`,A=document,k=()=>A.createComment(""),P=(e)=>e===null||typeof e!="object"&&typeof e!="function",G=Array.isArray,Qe=(e)=>G(e)||typeof e?.[Symbol.iterator]=="function";var M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,ue=/>/g,y=RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),me=/'/g,fe=/"/g,be=/^(?:script|style|textarea|title)$/i,J=(e)=>(t,...s)=>({_$litType$:e,strings:t,values:s}),v=J(1),f=J(2),ut=J(3),w=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),ge=new WeakMap,x=A.createTreeWalker(A,129);function $e(e,t){if(!G(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return he!==void 0?he.createHTML(t):t}var Xe=(e,t)=>{let s=e.length-1,i=[],n,r=t===2?"<svg>":t===3?"<math>":"",o=M;for(let a=0;a<s;a++){let c=e[a],u,d,h=-1,p=0;for(;p<c.length&&(o.lastIndex=p,d=o.exec(c),d!==null);)p=o.lastIndex,o===M?d[1]==="!--"?o=pe:d[1]!==void 0?o=ue:d[2]!==void 0?(be.test(d[2])&&(n=RegExp("</"+d[2],"g")),o=y):d[3]!==void 0&&(o=y):o===y?d[0]===">"?(o=n??M,h=-1):d[1]===void 0?h=-2:(h=o.lastIndex-d[2].length,u=d[1],o=d[3]===void 0?y:d[3]==='"'?fe:me):o===fe||o===me?o=y:o===pe||o===ue?o=M:(o=y,n=void 0);let g=o===y&&e[a+1].startsWith("/>")?" ":"";r+=o===M?c+Ye:h>=0?(i.push(u),c.slice(0,h)+"$lit$"+c.slice(h)+b+g):c+b+(h===-2?a:g)}return[$e(e,r+(e[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class R{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,r=0,o=e.length-1,a=this.parts,[c,u]=Xe(e,t);if(this.el=R.createElement(c,s),x.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=x.nextNode())!==null&&a.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith("$lit$")){let h=u[r++],p=i.getAttribute(d).split(b),g=/([.?@])?(.*)/.exec(h);a.push({type:1,index:n,name:g[2],strings:p,ctor:g[1]==="."?ye:g[1]==="?"?xe:g[1]==="@"?Ae:H}),i.removeAttribute(d)}else d.startsWith(b)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(be.test(i.tagName)){let d=i.textContent.split(b),h=d.length-1;if(h>0){i.textContent=D?D.emptyScript:"";for(let p=0;p<h;p++)i.append(d[p],k()),x.nextNode(),a.push({type:2,index:++n});i.append(d[h],k())}}}else if(i.nodeType===8)if(i.data===_e)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(b,d+1))!==-1;)a.push({type:7,index:n}),d+=b.length-1}n++}}static createElement(e,t){let s=A.createElement("template");return s.innerHTML=e,s}}function C(e,t,s=e,i){if(t===w)return t;let n=i!==void 0?s._$Co?.[i]:s._$Cl,r=P(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(e),n._$AT(e,s,i)),i!==void 0?(s._$Co??=[])[i]=n:s._$Cl=n),n!==void 0&&(t=C(e,n._$AS(e,t.values),n,i)),t}class ve{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??A).importNode(t,!0);x.currentNode=i;let n=x.nextNode(),r=0,o=0,a=s[0];for(;a!==void 0;){if(r===a.index){let c;a.type===2?c=new O(n,n.nextSibling,this,e):a.type===1?c=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(c=new we(n,this,e)),this._$AV.push(c),a=s[++o]}r!==a?.index&&(n=x.nextNode(),r++)}return x.currentNode=A,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class O{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),P(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==w&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Qe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=R.createElement($e(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new ve(i,this),r=n.u(this.options);n.p(t),this.T(r),this._$AH=n}}_$AC(e){let t=ge.get(e.strings);return t===void 0&&ge.set(e.strings,t=new R(e)),t}k(e){G(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new O(this.O(k()),this.O(k()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=le(e).nextSibling;le(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=l}_$AI(e,t=this,s,i){let n=this.strings,r=!1;if(n===void 0)e=C(this,e,t,0),r=!P(e)||e!==this._$AH&&e!==w,r&&(this._$AH=e);else{let o=e,a,c;for(e=n[0],a=0;a<n.length-1;a++)c=C(this,o[s+a],t,a),c===w&&(c=this._$AH[a]),r||=!P(c)||c!==this._$AH[a],c===l?e=l:e!==l&&(e+=(c??"")+n[a+1]),this._$AH[a]=c}r&&!i&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ye extends H{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}}class xe extends H{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}}class Ae extends H{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??l)===w)return;let s=this._$AH,i=e===l&&s!==l||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==l&&(s===l||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class we{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}}var et=Z.litHtmlPolyfillSupport;et?.(R,O),(Z.litHtmlVersions??=[]).push("3.3.3");var Ee=(e,t,s)=>{let i=s?.renderBefore??t,n=i._$litPart$;if(n===void 0){let r=s?.renderBefore??null;i._$litPart$=n=new O(t.insertBefore(k(),r),r,void 0,s??{})}return n._$AI(e),n};var Y=globalThis;class E extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ee(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}}E._$litElement$=!0,E.finalized=!0,Y.litElementHydrateSupport?.({LitElement:E});var tt=Y.litElementPolyfillSupport;tt?.({LitElement:E});(Y.litElementVersions??=[]).push("4.2.2");var Se=W`
  :host {
    --_heat: var(--ambient-heat-color, #f0706a);
    --_eco: var(--ambient-eco-color, #8cc98c);
    --_window: var(--ambient-window-color, #4cb4ee);
    --_off: var(--ambient-off-color, #a8a8a8);

    --_text: var(--ambient-text-color, #e1e1e1);
    --_text-strong: #f2f2f2;
    --_text-muted: #a8a8a8;
    --_text-faint: #9e9e9e;
    --_selected-text: #161616;
    --_unselected-text: #cfcfcf;
    --_text-dim: #6e6e6e;
    --_text-disabled: #8a8a8a;
    --_surface: rgba(255, 255, 255, 0.08);
    --_surface-hover: rgba(255, 255, 255, 0.06);
    --_well: rgba(0, 0, 0, 0.28);

    display: block;
  }

  ha-card {
    --_bg: var(--ambient-off-background, #1c1c1c);
    --_accent: var(--_off);

    box-sizing: border-box;
    height: 100%;
    min-height: 188px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--_bg);
    border-radius: var(--ha-card-border-radius, 16px);
    color: var(--_text);
    font-family: var(--ha-font-family-body, Roboto, system-ui, sans-serif);
    /* Inherited text styles cross the shadow boundary; don't let dashboards leak in. */
    text-transform: none;
    letter-spacing: normal;
    line-height: normal;
    transition: background 0.4s ease;
  }
  ha-card[data-tone="heat"] {
    --_accent: var(--_heat);
    --_bg: var(--ambient-heat-idle-background, #241e1d);
  }
  ha-card[data-tone="heat"][data-heating] {
    --_bg: var(--ambient-heat-background, #2e1d1c);
  }
  ha-card[data-tone="eco"] {
    --_accent: var(--_eco);
    --_bg: var(--ambient-eco-idle-background, #1e221e);
  }
  ha-card[data-tone="eco"][data-heating] {
    --_bg: var(--ambient-eco-background, #1d281d);
  }
  ha-card[data-tone="window"] {
    --_accent: var(--_window);
    --_bg: var(--ambient-window-background, #14232d);
  }

  svg {
    flex: none;
  }

  /* Header: name + status */
  /*
   * Rows use min-height, never height: with OS/app text scaling (accessibility "larger
   * text") fonts grow but fixed boxes don't, and text would overflow into the next row.
   */
  .header {
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-left: 4px;
    font-size: 13px;
    font-weight: 500;
  }
  .name {
    all: unset;
    color: var(--_unselected-text);
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .name:focus-visible {
    outline: 2px solid var(--_accent);
    outline-offset: 2px;
    border-radius: 4px;
  }
  .status {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--_accent);
    white-space: nowrap;
  }
  .pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--_accent);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .pulse {
      animation: none;
    }
  }

  /* Main row: current temperature + target stepper */
  .main {
    min-height: 68px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    padding-left: 4px;
  }
  .current {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .reading {
    display: flex;
    align-items: flex-start;
  }
  .value {
    font-size: 52px;
    line-height: 52px;
    font-weight: 300;
    letter-spacing: -0.03em;
    color: var(--_text-strong);
  }
  .unit {
    font-size: 18px;
    line-height: 26px;
    color: var(--_text-faint);
    padding-left: 3px;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 6px;
    font-size: 13px;
    line-height: 16px;
    color: var(--_text-muted);
    white-space: nowrap;
  }
  .dot {
    color: var(--_text-dim);
  }
  .humidity {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .target {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: opacity 0.2s ease;
  }
  .target[data-disabled] {
    opacity: 0.4;
  }
  .target-label {
    font-size: 12px;
    line-height: 16px;
    color: var(--_text-muted);
    letter-spacing: 0.04em;
  }
  .stepper {
    min-height: 44px;
    display: flex;
    align-items: center;
    border-radius: 22px;
    background: var(--_surface);
  }
  .stepper output {
    min-width: 52px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: var(--_text-strong);
    font-variant-numeric: tabular-nums;
  }
  .target[data-disabled] output {
    color: var(--_text-disabled);
  }

  button {
    border: none;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:disabled {
    cursor: default;
  }
  button:focus-visible {
    outline: 2px solid var(--_accent);
    outline-offset: -2px;
  }
  .step {
    width: 44px;
    min-height: 44px;
    align-self: stretch;
    border-radius: 50%;
    color: var(--_text);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .step:not(:disabled):hover {
    background: var(--_surface-hover);
  }

  /* Mode selector */
  .modes {
    min-height: 44px;
    margin-top: 4px;
    display: flex;
    gap: 4px;
    padding: 3px;
    box-sizing: border-box;
    border-radius: 22px;
    background: var(--_well);
  }
  .mode {
    flex: 1;
    border-radius: 19px;
    color: var(--_unselected-text);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }
  .mode:not([aria-checked="true"]):not(:disabled):hover {
    background: var(--_surface-hover);
  }
  .mode[aria-checked="true"] {
    color: var(--_selected-text);
  }
  .mode[data-mode="heat"][aria-checked="true"] {
    background: var(--_heat);
  }
  .mode[data-mode="eco"][aria-checked="true"] {
    background: var(--_eco);
  }
  .mode[data-mode="off"][aria-checked="true"] {
    background: var(--_text);
  }
`;var V={room:"Room",humidity:"{value} humidity",target:"Target",heat:"Heat",eco:"Eco",off:"Off",mode:"Mode",lower:"Lower target temperature",raise:"Raise target temperature","status.unavailable":"Unavailable","status.off":"Off","status.window":"Window open · paused","status.door":"Door open · paused","status.heating":"Heating","status.cooling":"Cooling","status.idle":"Idle","status.preset_heating":"{preset} · heating","status.preset_cooling":"{preset} · cooling","status.preset_idle":"{preset} · idle","preset.eco":"Eco","preset.away":"Away","preset.boost":"Boost","preset.comfort":"Comfort","preset.home":"Home","preset.sleep":"Sleep","preset.activity":"Activity"},st={room:"Raum",humidity:"{value} Luftfeuchte",target:"Ziel",heat:"Heizen",eco:"Eco",off:"Aus",mode:"Modus",lower:"Zieltemperatur senken",raise:"Zieltemperatur erhöhen","status.unavailable":"Nicht verfügbar","status.off":"Aus","status.window":"Fenster offen · pausiert","status.door":"Tür offen · pausiert","status.heating":"Heizt","status.cooling":"Kühlt","status.idle":"Bereit","status.preset_heating":"{preset} · heizt","status.preset_cooling":"{preset} · kühlt","status.preset_idle":"{preset} · bereit","preset.eco":"Eco","preset.away":"Abwesend","preset.boost":"Boost","preset.comfort":"Komfort","preset.home":"Zuhause","preset.sleep":"Schlafen","preset.activity":"Aktivität"},it={en:V,de:st};function Ce(e="en"){let t=it[e.split("-")[0]]??V;return(s,i={})=>(t[s]??V[s]).replace(/\{(\w+)\}/g,(n,r)=>i[r]??"")}function Te(e,t){switch(e.kind){case"unavailable":case"off":return t(`status.${e.kind}`);case"paused":return t(`status.${e.reason}`);case"active":{if(!e.preset)return t(`status.${e.action}`);let s=`preset.${e.preset}`,i=s in V?t(s):nt(e.preset);return t(`status.preset_${e.action}`,{preset:i})}}}var nt=(e)=>e.charAt(0).toUpperCase()+e.slice(1);var m=(e)=>{if(e===null||e===void 0||e==="")return;let t=Number(e);return Number.isFinite(t)?t:void 0},Q=(e)=>e===!0||typeof e==="string"&&e.toLowerCase()==="true",ee=(e)=>e.attributes.call_for_heat!==void 0;function te(e){if(e.state==="off")return"off";return e.attributes.preset_mode==="eco"?"eco":"heat"}function Me(e,t={}){let s=e?.attributes??{},i=!!e&&e.state!=="unavailable"&&e.state!=="unknown",n=t.mode??(e?te(e):"off"),r=!i||n==="off",o=!r&&(Q(s.window_open)||Q(s.door_open)),a=m(s.current_temperature),c=t.target??(e?B(e):void 0),u=m(s.current_humidity);if(u===0&&e&&ee(e))u=void 0;let d=String(s.hvac_action??""),h=!r&&!o&&(d?d==="heating":a!==void 0&&c!==void 0&&a<c),p;if(!i)p={kind:"unavailable"};else if(r)p={kind:"off"};else if(o)p={kind:"paused",reason:Q(s.window_open)?"window":"door"};else{let ie=n==="eco"?"eco":t.mode?void 0:ke(s.preset_mode);p={kind:"active",action:h?"heating":d==="cooling"?"cooling":"idle",...ie?{preset:ie}:{}}}return{available:i,mode:n,tone:r?"off":o?"window":n,heating:h,status:p,current:a,humidity:u,target:c,min:m(s.min_temp)??7,max:m(s.max_temp)??35,step:m(s.target_temp_step)??0.5,ecoAvailable:X(s.preset_modes).includes("eco")}}function ke(e){return typeof e==="string"&&e!=="none"?e:void 0}function Pe(e,t){if(e.target===void 0)return;let s=e.target+t*e.step,i=Math.round(s/e.step)*e.step,n=Math.min(e.max,Math.max(e.min,i));return Number(n.toFixed(2))}var X=(e)=>Array.isArray(e)?e:[],N=(e,t)=>({domain:"climate",service:e,data:t}),se=(e)=>m(e.attributes.temperature)===void 0&&m(e.attributes.target_temp_low)!==void 0;function B(e){return se(e)?m(e.attributes.target_temp_low):m(e.attributes.temperature)}function Re(e,t,s){let i=rt(e,s);if(i)return{domain:"number",service:"set_value",data:{entity_id:i,value:t}};let{entity_id:n,attributes:r}=e;if(!se(e))return N("set_temperature",{entity_id:n,temperature:t});let o=m(r.target_temp_high);return N("set_temperature",{entity_id:n,target_temp_low:t,target_temp_high:o!==void 0?Math.max(o,t):t})}function rt(e,t){let s=ke(e.attributes.preset_mode),i=t?.[e.entity_id]?.device_id;if(!s||!i)return;let n=se(e)?`preset_${s}_min`:`preset_${s}`;return Object.values(t).find((r)=>r.device_id===i&&r.platform==="better_thermostat"&&r.entity_id.startsWith("number.")&&r.translation_key===n)?.entity_id}function Oe(e,t){let{entity_id:s,attributes:i}=e;if(t==="off")return[N("set_hvac_mode",{entity_id:s,hvac_mode:"off"})];let n=[];if(e.state==="off"){let a=X(i.hvac_modes),c=a.includes("heat")?"heat":a.find((u)=>u!=="off")??"heat";n.push(N("set_hvac_mode",{entity_id:s,hvac_mode:c}))}let r=t==="eco"?"eco":"none";if((i.preset_mode??"none")!==r&&X(i.preset_modes).includes(r))n.push(N("set_preset_mode",{entity_id:s,preset_mode:r}));return n}var S=(e,t)=>f`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t}</svg>`,He=S(14,f`<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M12 3v18M5 12h14"/>`),Ne=S(12,f`<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>`),Ue=S(18,f`<path d="M6 12h12"/>`),Ie=S(18,f`<path d="M12 6v12M6 12h12"/>`),ze=S(16,f`<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.3 1.6 1.1 2.6 2.3 3.1C11 9.2 11 6 12 3z"/>`),Le=S(16,f`<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19l7-7"/>`),De=S(16,f`<path d="M12 3v9"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/>`);var j="ambient-thermostat-card",ot=700,at=1e4,dt={entity:"Entity",name:"Name (optional)"};class Be extends E{static styles=Se;static properties={hass:{attribute:!1},_config:{state:!0},_pending:{state:!0}};_targetTimer;_pendingTimer;constructor(){super();this._pending={}}setConfig(e){if(!e?.entity||e.entity.split(".")[0]!=="climate")throw Error("Please set `entity` to a climate entity, e.g. climate.living_room");this._config=e}getCardSize(){return 4}getGridOptions(){return{columns:12,min_columns:6}}static getStubConfig(e){let t=Object.values(e.states).filter((i)=>i.entity_id.startsWith("climate."));return{entity:(t.find(ee)??t[0])?.entity_id??"climate.example"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{domain:"climate"}}},{name:"name",selector:{text:{}}}],computeLabel:(e)=>dt[e.name]}}disconnectedCallback(){if(super.disconnectedCallback(),this._targetTimer)clearTimeout(this._targetTimer),this._sendTarget();clearTimeout(this._pendingTimer),this._pending={}}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;let t=e.get("hass"),s=this._config?.entity;return!t||!s||t.states[s]!==this.hass?.states[s]||t.locale!==this.hass?.locale||t.config!==this.hass?.config}willUpdate(e){let t=this._entity;if(!e.has("hass")||!t)return;let s=e.get("hass")?.states[t.entity_id],{mode:i,target:n}=this._pending,r={...this._pending};if(i!==void 0&&te(t)===i)delete r.mode;let o=B(t),a=s!==void 0&&B(s)!==o;if(n!==void 0&&!this._targetTimer&&(o===n||a))delete r.target;if(r.mode!==i||r.target!==n)this._pending=r}get _entity(){return this._config?this.hass?.states[this._config.entity]:void 0}render(){if(!this._config||!this.hass)return l;let e=this._entity,t=Ce(Ve(this.hass)),s=Me(e,this._pending),i=this._config.name??e?.attributes.friendly_name??this._config.entity;return v`
      <ha-card data-tone=${s.tone} ?data-heating=${s.heating}>
        <div class="header">
          <button class="name" @click=${this._openMoreInfo}>${i}</button>
          <span class="status" role="status">
            ${s.status.kind==="paused"?He:l}
            ${s.heating?v`<span class="pulse"></span>`:l}
            <span>${Te(s.status,t)}</span>
          </span>
        </div>

        <div class="main">
          ${this._renderCurrent(s,t)} ${this._renderTarget(s,t)}
        </div>

        ${this._renderModes(s,t)}
      </ha-card>
    `}_renderCurrent(e,t){return v`
      <div class="current">
        <div class="reading">
          <span class="value">${this._format(e.current)}</span>
          <span class="unit">${this.hass?.config?.unit_system?.temperature??"°C"}</span>
        </div>
        <span class="meta">
          <span>${t("room")}</span>
          ${e.humidity!==void 0?v`<span class="dot">·</span>
                <span class="humidity">
                  ${Ne}<span>${t("humidity",{value:`${Math.round(e.humidity)}%`})}</span>
                </span>`:l}
        </span>
      </div>
    `}_renderTarget(e,t){let s=!e.available||e.mode==="off"||e.target===void 0;return v`
      <div class="target" ?data-disabled=${s}>
        <span class="target-label">${t("target")}</span>
        <div class="stepper">
          <button
            class="step"
            aria-label=${t("lower")}
            ?disabled=${s||e.target<=e.min}
            @click=${()=>this._step(e,-1)}
          >
            ${Ue}
          </button>
          <output aria-live="polite">${this._format(e.target)}°</output>
          <button
            class="step"
            aria-label=${t("raise")}
            ?disabled=${s||e.target>=e.max}
            @click=${()=>this._step(e,1)}
          >
            ${Ie}
          </button>
        </div>
      </div>
    `}_renderModes(e,t){let s=(i,n,r)=>v`
      <button
        class="mode"
        role="radio"
        data-mode=${i}
        aria-checked=${e.available&&e.mode===i?"true":"false"}
        ?disabled=${!e.available}
        @click=${()=>this._setMode(i)}
      >
        ${n}<span>${r}</span>
      </button>
    `;return v`
      <div class="modes" role="radiogroup" aria-label=${t("mode")}>
        ${s("heat",ze,t("heat"))}
        ${e.ecoAvailable||e.mode==="eco"?s("eco",Le,t("eco")):l}
        ${s("off",De,t("off"))}
      </div>
    `}_format(e){if(e===void 0)return"–";return new Intl.NumberFormat(Ve(this.hass),{minimumFractionDigits:1,maximumFractionDigits:1}).format(e)}_step(e,t){let s=Pe(e,t);if(s===void 0)return;this._setPending({target:s}),clearTimeout(this._targetTimer),this._targetTimer=setTimeout(()=>this._sendTarget(),ot)}_sendTarget(){this._targetTimer=void 0;let e=this._entity,{target:t}=this._pending;if(!e||t===void 0)return;this._callServices([Re(e,t,this.hass?.entities)])}_setMode(e){let t=this._entity;if(!t)return;let s=Oe(t,e);if(s.length===0)return;this._setPending({mode:e}),this._callServices(s)}async _callServices(e){try{for(let{domain:t,service:s,data:i}of e)await this.hass.callService(t,s,i)}catch(t){this._pending={},console.error("[ambient-thermostat-card]",t)}}_setPending(e){this._pending={...this._pending,...e},clearTimeout(this._pendingTimer),this._pendingTimer=setTimeout(()=>this._pending={},at)}_openMoreInfo(){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this._config?.entity},bubbles:!0,composed:!0}))}}function Ve(e){return e?.locale?.language??e?.language??"en"}if(!customElements.get(j))customElements.define(j,Be);window.customCards??=[];if(!window.customCards.some((e)=>e.type===j))window.customCards.push({type:j,name:"Ambient Thermostat Card",description:"A calm thermostat card made for Better Thermostat.",preview:!0,documentationURL:"https://github.com/andresattler/ambient-thermostat-card"});console.info("%c AMBIENT-THERMOSTAT-CARD %c 0.1.1 ","background:#f0706a;color:#161616","");export{Be as AmbientThermostatCard};
