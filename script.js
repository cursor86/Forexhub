/**
 * SS Traders Education - Permanent Live Rate Fix
 * Uses Dual-Proxy Strategy to bypass CORS & Network Shields
 */

const API_URL = "https://frankfurter.app";
const PROXIES = [
    "https://allorigins.win",
    "https://corsproxy.io?"
];

async function init(proxyIndex = 0) {
    const rateText = document.getElementById('rate-text');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    if (proxyIndex >= PROXIES.length) {
        rateText.innerText = "Connection Blocked. Please disable Ad-blockers.";
        return;
    }

    try {
        console.log(`Connecting via Proxy ${proxyIndex + 1}...`);
        const response = await fetch(PROXIES[proxyIndex] + encodeURIComponent(API_URL));
        
        if (!response.ok) throw new Error();
        
        const data = await response.json();
        setupConverter(data.rates);
        rateText.innerText = "Live Market Status: Connected (Verified)";

    } catch (error) {
        console.warn(`Proxy ${proxyIndex + 1} failed. Retrying...`);
        init(proxyIndex + 1); // Try the next proxy
    }
}

function setupConverter(rates) {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const codes = Object.keys(rates);
    if (!codes.includes('EUR')) codes.push('EUR');
    codes.sort();

    // Fill Dropdowns
    fromSelect.innerHTML = ""; toSelect.innerHTML = "";
    codes.forEach(code => {
        fromSelect.add(new Option(code, code));
        toSelect.add(new Option(code, code));
    });

    fromSelect.value = "USD";
    toSelect.value = "AUD";

    document.getElementById('convertBtn').onclick = () => {
        const amount = document.getElementById('amount').value || 1;
        const from = fromSelect.value;
        const to = toSelect.value;
        
        const fromRate = (from === 'EUR') ? 1 : rates[from];
        const toRate = (to === 'EUR') ? 1 : rates[to];
        const result = (amount / fromRate) * toRate;

        document.getElementById('converted-total').innerText = result.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('rate-text').innerText = `1 ${from} = ${(result/amount).toFixed(4)} ${to}`;
    };
}

window.onload = () => init();

