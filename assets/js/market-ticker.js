(() => {
  "use strict";
  const root = document.querySelector("[data-market-ticker]");
  if (!root) return;
  const CACHE_KEY = "ft7-market-prices-v1";
  const HOUR = 60 * 60 * 1000;
  const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];
  const byAsset = { BTCUSDT: "BTC", ETHUSDT: "ETH", BNBUSDT: "BNB", SOLUSDT: "SOL" };
  const status = root.querySelector("[data-market-status]");
  let market = readCache();
  function readCache() {
    try { const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); return saved && typeof saved === "object" ? { prices: saved.prices && typeof saved.prices === "object" ? saved.prices : {}, times: saved.times && typeof saved.times === "object" ? saved.times : {}, partialFailure: false, fetchFailed: false } : { prices: {}, times: {}, partialFailure: false, fetchFailed: false }; }
    catch { return { prices: {}, times: {} }; }
  }
  function persist() { try { localStorage.setItem(CACHE_KEY, JSON.stringify(market)); } catch { /* Storage is optional. */ } }
  function number(value) { return Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null; }
  function priceText(asset, value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: asset === "USD_EGP" ? "EGP" : "USD", maximumFractionDigits: asset === "BTC" ? 0 : 2, minimumFractionDigits: 0 }).format(value);
  }
  function clock(timestamp) { return new Intl.DateTimeFormat("ar-EG", { hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp)); }
  function render() {
    root.querySelectorAll("[data-market]").forEach((item) => {
      const value = number(market.prices?.[item.dataset.market]);
      const output = item.querySelector("[data-price]");
      if (output) output.textContent = value === null ? "—" : priceText(item.dataset.market, value);
    });
    const times = Object.values(market.times || {}).map(Number).filter(Number.isFinite);
    const latest = times.length ? Math.max(...times) : 0;
    if (!status) return;
    if (!latest) status.textContent = market.fetchFailed ? "تعذر جلب الأسعار حاليًا" : "جارٍ جلب الأسعار الاسترشادية";
    else if (market.fetchFailed) status.textContent = "تعذر التحديث · آخر بيانات " + clock(latest);
    else if (market.partialFailure) status.textContent = "تعذر تحديث بعض الأسعار · آخر جلب " + clock(latest);
    else if (Date.now() - latest > HOUR) status.textContent = "بيانات محفوظة · آخر جلب " + clock(latest);
    else status.textContent = "تحديث ساعي · آخر جلب " + clock(latest);
  }
  async function jsonWithTimeout(url) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try { const response = await fetch(url, { cache: "no-store", signal: controller.signal }); if (!response.ok) throw new Error("Market source returned " + response.status); return await response.json(); }
    finally { window.clearTimeout(timeout); }
  }
  async function fetchCrypto() {
    const query = "symbols=" + encodeURIComponent(JSON.stringify(symbols));
    const endpoints = ["https://data-api.binance.vision/api/v3/ticker/price?" + query, "https://api.binance.com/api/v3/ticker/price?" + query];
    let lastError;
    for (const endpoint of endpoints) {
      try {
        const rows = await jsonWithTimeout(endpoint), prices = {};
        rows.forEach((row) => { const asset = byAsset[row.symbol], value = number(row.price); if (asset && value !== null) prices[asset] = value; });
        if (Object.keys(prices).length !== symbols.length) throw new Error("Incomplete market response");
        return prices;
      } catch (error) { lastError = error; }
    }
    throw lastError || new Error("Crypto prices unavailable");
  }
  async function fetchUsdEgp() {
    const data = await jsonWithTimeout("https://api.exchangerate.fun/latest?base=USD");
    const rate = number(data?.rates?.EGP);
    if (rate === null) throw new Error("USD/EGP rate unavailable");
    return rate;
  }
  async function refresh() {
    market.partialFailure = false;
    const results = await Promise.allSettled([fetchUsdEgp(), fetchCrypto()]);
    const checkedAt = Date.now();
    let successes = 0;
    if (results[0].status === "fulfilled") { market.prices.USD_EGP = results[0].value; market.times.USD_EGP = checkedAt; successes++; }
    if (results[1].status === "fulfilled") { Object.assign(market.prices, results[1].value); Object.keys(results[1].value).forEach((asset) => { market.times[asset] = checkedAt; }); successes++; }
    market.partialFailure = successes > 0 && successes < 2;
    market.fetchFailed = successes === 0;
    if (successes) { market.checkedAt = checkedAt; persist(); }
    render();
  }
  render();
  refresh();
  window.setInterval(refresh, HOUR);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    const times = Object.values(market.times || {}).map(Number).filter(Number.isFinite);
    const latest = times.length ? Math.max(...times) : 0;
    if (!latest || Date.now() - latest >= HOUR) refresh();
  });
})();