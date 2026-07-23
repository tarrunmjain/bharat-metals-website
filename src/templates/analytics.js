const MEASUREMENT_ID = "G-BNQJRR11FD";

const APPROVED_EVENTS = [
  "click_call",
  "click_whatsapp",
  "click_email",
  "click_request_quote",
  "click_google_business_profile",
  "click_google_maps",
  "click_indiamart"
];

const GOOGLE_BUSINESS_HOST = "share.google";
const GOOGLE_MAPS_HOST = "maps.app.goo.gl";
const INDIAMART_HOST = "www.indiamart.com";

const googleTagMarkup = `    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${MEASUREMENT_ID}');
    </script>`;

function decodeText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAttribute(openingTag, name) {
  const match = openingTag.match(new RegExp(`\\s${name}=(["'])(.*?)\\1`, "i"));
  return match ? match[2] : "";
}

function defaultLabel(eventName, location, destinationType) {
  const suffix = {
    click_call: "call",
    click_whatsapp: "whatsapp",
    click_email: "email",
    click_request_quote: destinationType === "mailto" ? "email_rfq" : destinationType === "whatsapp" ? "whatsapp_quote" : "request_quote",
    click_google_business_profile: "google_business_profile",
    click_google_maps: "google_maps",
    click_indiamart: "indiamart"
  }[eventName];
  return `${location}_${suffix || "contact_action"}`;
}

function linkDestination(href) {
  const decodedHref = href.replace(/&amp;/gi, "&");
  if (/^tel:/i.test(decodedHref)) return { type: "tel", host: "" };
  if (/^mailto:/i.test(decodedHref)) return { type: "mailto", host: "" };
  if (/^https?:\/\/wa\.me\/919941233888(?:[/?#]|$)/i.test(decodedHref)) {
    return { type: "whatsapp", host: "wa.me" };
  }
  if (/^(?:\.\.\/|\.\/|\/)?request-quote\/?(?:[?#].*)?$/i.test(decodedHref)) {
    return { type: "internal_quote", host: "" };
  }

  try {
    const url = new URL(decodedHref, "https://www.stainlesssteeldealers.com/");
    if (url.hostname === GOOGLE_BUSINESS_HOST) return { type: "google_business_profile", host: url.hostname };
    if (url.hostname === GOOGLE_MAPS_HOST) return { type: "google_maps", host: url.hostname };
    if (url.hostname === INDIAMART_HOST || url.hostname.endsWith(".indiamart.com")) {
      return { type: "indiamart", host: url.hostname };
    }
  } catch (error) {
    return { type: "", host: "" };
  }

  return { type: "", host: "" };
}

function analyticsDetails(openingTag, innerHtml, html, offset) {
  const href = getAttribute(openingTag, "href");
  if (!href) return null;

  const destination = linkDestination(href);
  if (!destination.type) return null;

  const className = getAttribute(openingTag, "class");
  const ariaLabel = getAttribute(openingTag, "aria-label");
  const visibleText = decodeText(innerHtml);
  const intentText = `${visibleText} ${ariaLabel}`.trim();
  const isQuoteIntent =
    destination.type === "internal_quote" ||
    /\b(?:quick\s+quote|request(?:\s+a)?\s+quote|quote|rfq|mail\s+your\s+requirement|email\s+requirement|whatsapp\s+requirement|send\s+(?:your\s+)?requirement)\b/i.test(intentText) ||
    (destination.type === "whatsapp" && /\bbutton-on-dark\b/.test(className));

  let eventName = "";
  if (destination.type === "tel") eventName = "click_call";
  if (destination.type === "whatsapp") eventName = isQuoteIntent ? "click_request_quote" : "click_whatsapp";
  if (destination.type === "mailto") eventName = isQuoteIntent ? "click_request_quote" : "click_email";
  if (destination.type === "internal_quote") eventName = "click_request_quote";
  if (destination.type === "google_business_profile") eventName = "click_google_business_profile";
  if (destination.type === "google_maps") eventName = "click_google_maps";
  if (destination.type === "indiamart") eventName = "click_indiamart";
  if (!eventName) return null;

  const footerStart = html.indexOf("<footer");
  const isFooter = footerStart >= 0 && offset > footerStart;
  let location = "page_content";

  if (/\btop-icon\b/.test(className)) location = "topbar";
  else if (/\bnav-quick\b/.test(className) || (/\bnav-link\b/.test(className) && destination.type === "internal_quote")) location = "header";
  else if (isFooter) location = "footer";
  else if (/mail\s+your\s+requirement/i.test(intentText)) location = "fast_rfq";
  else if (/\bbutton-on-dark\b/.test(className)) location = "final_quote";
  else if (/\b(?:call|whatsapp|mail)\s+us\b/i.test(intentText)) location = "hero";
  else if (/\bbutton-primary\b/.test(className) && /\b(?:call|whatsapp|email\s+rfq)\b/i.test(intentText)) location = "page_hero";
  else if (destination.type === "google_business_profile" || destination.type === "google_maps") location = "local_trust";

  let label = defaultLabel(eventName, location, destination.type);
  const labelMap = {
    "topbar:click_call": "topbar_call",
    "topbar:click_whatsapp": "topbar_whatsapp",
    "topbar:click_email": "topbar_email",
    "topbar:click_google_business_profile": "topbar_google_business_profile",
    "topbar:click_indiamart": "topbar_indiamart",
    "header:click_request_quote": destination.type === "internal_quote" ? "header_request_quote" : "header_quick_quote",
    "hero:click_call": "hero_call",
    "hero:click_whatsapp": "hero_whatsapp",
    "hero:click_email": "hero_email",
    "fast_rfq:click_request_quote": "fast_rfq_mail_requirement",
    "final_quote:click_call": "final_quote_call",
    "final_quote:click_whatsapp": "final_quote_whatsapp",
    "final_quote:click_request_quote": destination.type === "mailto" ? "final_quote_email_rfq" : "final_quote_whatsapp",
    "footer:click_call": "footer_call",
    "footer:click_whatsapp": "footer_whatsapp",
    "footer:click_email": "footer_email",
    "footer:click_request_quote": "footer_request_quote",
    "footer:click_google_maps": "footer_google_maps",
    "footer:click_indiamart": "footer_indiamart",
    "page_hero:click_call": "page_hero_call",
    "page_hero:click_whatsapp": "page_hero_whatsapp",
    "page_hero:click_request_quote": "page_hero_email_rfq"
  };
  label = labelMap[`${location}:${eventName}`] || label;

  return {
    eventName,
    location,
    label,
    destinationType: destination.type,
    outboundHost: destination.host
  };
}

function removeAnalyticsAttributes(openingTag) {
  return openingTag.replace(/\sdata-ga-(?:event|location|label)="[^"]*"/gi, "");
}

function annotateAnalyticsLinks(html) {
  return html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (anchor, offset) => {
    const openingEnd = anchor.indexOf(">");
    if (openingEnd < 0) return anchor;

    const openingTag = anchor.slice(0, openingEnd + 1);
    const innerHtml = anchor.slice(openingEnd + 1, -4);
    const details = analyticsDetails(openingTag, innerHtml, html, offset);
    if (!details) return anchor;

    const cleanOpeningTag = removeAnalyticsAttributes(openingTag);
    const attributes = ` data-ga-event="${details.eventName}" data-ga-location="${details.location}" data-ga-label="${details.label}"`;
    return `${cleanOpeningTag.slice(0, -1)}${attributes}>${innerHtml}</a>`;
  });
}

function ensureGoogleTag(html) {
  const request = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  if (html.includes(request)) return html;
  return html.replace(/<head>/i, `<head>\n${googleTagMarkup}`);
}

function applyGoogleAnalytics(html) {
  return annotateAnalyticsLinks(ensureGoogleTag(html));
}

module.exports = {
  APPROVED_EVENTS,
  MEASUREMENT_ID,
  applyGoogleAnalytics,
  annotateAnalyticsLinks,
  googleTagMarkup,
  linkDestination
};
