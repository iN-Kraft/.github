var consent = __md_get("__consent")
if (consent) {
    if (consent.adsense) {
        let script = document.createElement("script");
        script.async = true;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1012952679774175";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
    }
    if (consent.analytics) {
        let script = document.createElement("script");
        script.defer = true;
        script.setAttribute("data-site-id", "dbd075bf3dac");
        script.src = "https://app.rybbit.io/api/script.js";
        document.head.appendChild(script);
    }
}