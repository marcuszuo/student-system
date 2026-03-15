(function () {
  // Fill these IDs to enable tracking.
  // BAIDU_HM_ID example: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  // GA4_MEASUREMENT_ID example: "G-XXXXXXXXXX"
  const BAIDU_HM_ID = "245b0a8dbd93e5654d9a86b4108b86c1";
  const GA4_MEASUREMENT_ID = "G-S2R7PBXZYP";

  window.trackEvent = function (eventName, params) {
    if (!eventName) return;
    if (window.gtag) {
      window.gtag("event", eventName, params || {});
    }
    if (window._hmt) {
      const label = params && params.label ? String(params.label) : "";
      const value = params && typeof params.value === "number" ? params.value : 0;
      window._hmt.push(["_trackEvent", "majornavi", eventName, label, value]);
    }
  };

  if (BAIDU_HM_ID) {
    window._hmt = window._hmt || [];
    const hmScript = document.createElement("script");
    hmScript.src = "https://hm.baidu.com/hm.js?" + BAIDU_HM_ID;
    hmScript.async = true;
    document.head.appendChild(hmScript);
  }

  if (GA4_MEASUREMENT_ID) {
    const gaScript = document.createElement("script");
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_MEASUREMENT_ID;
    gaScript.async = true;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA4_MEASUREMENT_ID);
  }
})();
