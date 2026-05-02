/**
 * SS Traders Education - Permanent Live Rate Solution
 * Bypasses CORS and Network Shields via Dynamic Proxying
 */

// 1. Reliable Proxies & API
const PROXY_LIST = [
    "https://allorigins.win",
    "https://corsproxy.io/?"
];
const API_URL = "https://frankfurter.app";

async function getLiveRates(proxyIndex = 0) {
    const rateText = document.getElementById('rate-text');
    
    if (proxyIndex >= PROXY_LIST.length) {
        throw new Error("All proxies failed");
    }

    try {
        const targetUrl = PROXY_LIST[proxyIndex] + encodeURIComponent(API_URL);
        console.log(`Connecting to Live Market via Proxy ${proxyIndex + 1}...`);
        
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error();
        
        const data = await response.json();
        setupConverter(data.rates);
        rateText.innerText = "Live Market Status: Connected (Verified)";
        
    } catch (err) {
        console.warn(`Proxy ${proxyIndex + 1} blocked. Retrying...`);
        // Recursive retry with next proxy
        return getLiveRates(proxyIndex + 1);
    }
}

function setupConverter(rates) {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const convertBtn = document.getElementById('convertBtn');
    const resultDisplay = document.getElementById('converted-total');

    const codes = Object.keys(rates);
    if (!codes.includes('EUR')) codes.push('EUR');
    codes.sort();

    // Fill dropdowns once with real data
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";
    codes.forEach(code => {
        fromSelect.add(new Option(code, code));
        toSelect.add(new Option(code, code));
    });

    fromSelect.value = "USD";
    toSelect.value = "AUD";

    convertBtn.onclick = () => {
        const amount = parseFloat(document.getElementById('amount').value) || 1;
        const from = fromSelect.value;
        const to = toSelect.value;

        // Math: (Amount / BaseRateFrom) * BaseRateTo
        const baseFrom = (from === 'EUR') ? 1 : rates[from];
        const baseTo = (to === 'EUR') ? 1 : rates[to];
        const finalValue = (amount / baseFrom) * baseTo;

        resultDisplay.innerText = finalValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " " + to;

        document.getElementById('rate-text').innerText = `1 ${from} = ${(finalValue / amount).toFixed(4)} ${to}`;
    };

    convertBtn.click();
}

// Start the app
window.onload = () => getLiveRates();

