(() => {
  "use strict";

  const root = document.querySelector("[data-market-ticker]");
  if (!root) return;

  const CACHE_STORAGE_SLOT = "ft7-market-prices-v2";
  const LEGACY_CACHE_STORAGE_SLOT = "ft7-market-prices-v1";
  const HOUR = 60 * 60 * 1000;
  const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XMRUSDT"];
  const bySymbol = { BTCUSDT: "BTC", ETHUSDT: "ETH", SOLUSDT: "SOL", BNBUSDT: "BNB", XMRUSDT: "XMR" };
  const cryptoAssets = Object.values(bySymbol);
  const status = root.querySelector("[data-market-status]");
  let refreshing = false;
  let market = readCache();

  function readCache() {
    const empty = { prices: {}, times: {}, sourceTimes: {}, failedSources: {}, partialFailure: false, fetchFailed: false, lastAttempt: 0 };
    try {
      const saved = JSON.parse(localStorage.getItem(CACHE_STORAGE_SLOT) || localStorage.getItem(LEGACY_CACHE_STORAGE_SLOT) || "null");
      if (!saved || typeof saved !== "object") return empty;
      const prices = {};
      const times = {};
      Object.entries(saved.prices || {}).forEach(([asset, value]) => {
        const parsed = number(value);
        if (parsed !== null) prices[asset] = parsed;
      });
      Object.entries(saved.times || {}).forEach(([asset, value]) => {
        const parsed = Number(value);
        if (Number.isFinite(parsed) && parsed > 0) times[asset] = parsed;
      });
      const sourceTimes = saved.sourceTimes && typeof saved.sourceTimes === "object" ? { ...saved.sourceTimes } : {};
      if (!Number(sourceTimes.crypto)) {
        sourceTimes.crypto = Math.max(0, ...cryptoAssets.map((asset) => Number(times[asset]) || 0));
      }
      if (!Number(sourceTimes.fx)) sourceTimes.fx = Number(times.USD_EGP) || 0;
      return {
        prices,
        times,
        sourceTimes,
        failedSources: saved.failedSources && typeof saved.failedSources === "object" ? saved.failedSources : {},
        partialFailure: Boolean(saved.partialFailure),
        fetchFailed: Boolean(saved.fetchFailed),
        lastAttempt: Number(saved.lastAttempt) || 0
      };
    } catch {
      return empty;
    }
  }

  function persist() {
    try { localStorage.setItem(CACHE_STORAGE_SLOT, JSON.stringify(market)); } catch { /* Storage is optional. */ }
  }

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  function isFresh(asset, now = Date.now()) {
    const timestamp = Number(market.times[asset]);
    return number(market.prices[asset]) !== null && Number.isFinite(timestamp) && now - timestamp < HOUR;
  }

  function sourceIsFresh(source, now = Date.now()) {
    const timestamp = Number(market.sourceTimes[source]);
    return Number.isFinite(timestamp) && timestamp > 0 && now - timestamp < HOUR;
  }

  function priceText(asset, value) {
    const digits = asset === "BTC" ? 0 : asset === "EGP" ? 5 : 2;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: asset === "EGP" ? 5 : 0,
      maximumFractionDigits: digits
    }).format(value);
  }

  function clock(timestamp) {
    return new Intl.DateTimeFormat("ar-EG", { hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp));
  }

  function latestTimestamp() {
    const times = Object.values(market.times).map(Number).filter((value) => Number.isFinite(value) && value > 0);
    return times.length ? Math.max(...times) : 0;
  }

  function render() {
    root.querySelectorAll("[data-market]").forEach((item) => {
      const asset = item.dataset.market;
      const rawValue = asset === "EGP" && number(market.prices.USD_EGP) !== null
        ? 1 / market.prices.USD_EGP
        : market.prices[asset];
      const value = number(rawValue);
      const output = item.querySelector("[data-price]");
      if (output) output.textContent = value === null ? "—" : priceText(asset, value);
    });

    if (!status) return;
    const latest = latestTimestamp();
    const stale = [...cryptoAssets, "USD_EGP"].some((asset) => !isFresh(asset));
    const hasFailure = Object.values(market.failedSources).some(Boolean);
    if (!latest) status.textContent = market.fetchFailed ? "تعذر جلب الأسعار حاليًا" : "جارٍ جلب الأسعار الاسترشادية";
    else if (market.fetchFailed) status.textContent = "تعذر التحديث · تعرض آخر بيانات محفوظة · " + clock(latest);
    else if (hasFailure || market.partialFailure) status.textContent = "تعذر تحديث بعض الأسعار · بيانات محفوظة · " + clock(latest);
    else if (stale) status.textContent = "بيانات محفوظة · آخر جلب " + clock(latest);
    else status.textContent = "تحديث كل ساعة · آخر جلب " + clock(latest);
  }

  async function jsonWithTimeout(url) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Market source returned " + response.status);
      return await response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function fetchCrypto() {
    const query = "symbols=" + encodeURIComponent(JSON.stringify(symbols));
    const endpoints = [
      "https://data-api.binance.vision/api/v3/ticker/price?" + query,
      "https://api.binance.com/api/v3/ticker/price?" + query
    ];
    let lastError;
    for (const endpoint of endpoints) {
      try {
        const rows = await jsonWithTimeout(endpoint);
        const prices = {};
        if (!Array.isArray(rows)) throw new Error("Invalid crypto market response");
        rows.forEach((row) => {
          const asset = bySymbol[row.symbol];
          const value = number(row.price);
          if (asset && value !== null) prices[asset] = value;
        });
        if (Object.keys(prices).length) return prices;
        throw new Error("Empty crypto market response");
      } catch (error) {
        lastError = error;
      }
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
    if (refreshing) return;
    const now = Date.now();
    const needsCrypto = !sourceIsFresh("crypto", now);
    const needsEgp = !sourceIsFresh("fx", now);
    if (!needsCrypto && !needsEgp) {
      render();
      return;
    }

    refreshing = true;
    const tasks = [];
    if (needsCrypto) tasks.push(["crypto", fetchCrypto()]);
    if (needsEgp) tasks.push(["fx", fetchUsdEgp()]);
    const results = await Promise.allSettled(tasks.map(([, task]) => task));
    const checkedAt = Date.now();
    let updated = 0;
    market.failedSources = { ...market.failedSources };

    results.forEach((result, index) => {
      const source = tasks[index][0];
      market.sourceTimes[source] = checkedAt;
      if (result.status === "rejected") {
        market.failedSources[source] = true;
        return;
      }
      if (source === "crypto") {
        const returnedAssets = Object.keys(result.value);
        Object.assign(market.prices, result.value);
        returnedAssets.forEach((asset) => { market.times[asset] = checkedAt; });
        market.failedSources.crypto = returnedAssets.length < cryptoAssets.length;
        updated += returnedAssets.length;
      } else {
        market.prices.USD_EGP = result.value;
        market.times.USD_EGP = checkedAt;
        market.failedSources.fx = false;
        updated++;
      }
    });

    market.lastAttempt = checkedAt;
    market.partialFailure = Object.values(market.failedSources).some(Boolean);
    market.fetchFailed = updated === 0;
    persist();
    refreshing = false;
    render();
  }

  function updateExpanded(item) {
    const button = item.querySelector(".market-asset-button");
    if (!button) return;
    const expanded = item.classList.contains("is-pinned") || item.classList.contains("is-hovered") || item.contains(document.activeElement);
    item.classList.toggle("is-expanded", expanded);
    button.setAttribute("aria-expanded", String(expanded));
  }

  const items = [...root.querySelectorAll(".market-asset")];
  items.forEach((item) => {
    const button = item.querySelector(".market-asset-button");
    if (!button) return;
    button.addEventListener("click", () => {
      const pin = !item.classList.contains("is-pinned");
      items.forEach((candidate) => {
        candidate.classList.remove("is-pinned");
        updateExpanded(candidate);
      });
      if (pin) item.classList.add("is-pinned");
      updateExpanded(item);
    });
    item.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      item.classList.add("is-hovered");
      updateExpanded(item);
    });
    item.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "mouse") return;
      item.classList.remove("is-hovered");
      updateExpanded(item);
    });
    item.addEventListener("focusin", () => updateExpanded(item));
    item.addEventListener("focusout", () => window.setTimeout(() => updateExpanded(item), 0));
  });

  document.addEventListener("click", (event) => {
    if (root.contains(event.target)) return;
    items.forEach((item) => {
      item.classList.remove("is-pinned");
      updateExpanded(item);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    items.forEach((item) => {
      item.classList.remove("is-pinned");
      updateExpanded(item);
    });
  });

  render();
  refresh();
  window.setInterval(refresh, HOUR);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refresh();
  });
})();
