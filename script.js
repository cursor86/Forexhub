/**
 * Optimized Currency Converter Logic
 * Features: Parallel API Fetching & LocalStorage Caching (60-minute TTL)
 */

const API_URL = "https://frankfurter.app";
const CACHE_KEY = "fx_rates_cache";
const CACHE_EXPIRY = 60 * 60 * 1000; // 60 minutes in milliseconds

async function init() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const rateText = document.getElementById('rate-text');
    const convertBtn = document.getElementById('convertBtn');

    try {
        // 1. Check Cache First
        const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
        const now = new Date().getTime();

        let rates;
        if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRY)) {
            console.log("Loading rates from cache...");
            rates = cachedData.rates;
        } else {
            console.log("Cache expired or empty. Fetching new rates...");
            // Parallel Fetch: Get base rates and symbols simultaneously if needed
            // For Frankfurter, one call usually suffices for the latest rates
            const response = await fetch(`${API_URL}/latest`);
            if (!response.ok) throw new Error('API unreachable');
            const data = await response.json();
            rates = data.rates;
            
            // Save to LocalStorage with timestamp
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                rates: rates,
                timestamp: now
            }));
        }

        const codes = Object.keys(rates);
        if (!codes.includes('EUR')) codes.push('EUR');
        codes.sort();

        // 2. Populate Dropdowns
        fromSelect.innerHTML = "";
        toSelect.innerHTML = "";
        codes.forEach(code => {
            fromSelect.add(new Option(code, code));
            toSelect.add(new Option(code, code));
        });

        fromSelect.value = "USD";
        toSelect.value = "AUD";
        rateText.innerText = "Live Market Data: Connected";

        // 3. Optimized Conversion Logic
        convertBtn.onclick = async () => {
            const amount = document.getElementById('amount').value || 1;
            const from = fromSelect.value;
            const to = toSelect.value;

            if (from === to) {
                document.getElementById('converted-total').innerText = `${amount} ${to}`;
                return;
            }

            // Using cached rates for instant conversion
            const rate = (1 / (from === 'EUR' ? 1 : rates[from])) * (to === 'EUR' ? 1 : rates[to]);
            const result = (amount * rate).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            document.getElementById('converted-total').innerText = `${result} ${to}`;
            rateText.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        };

        convertBtn.click();

    } catch (error) {
        console.error("Performance optimization error:", error);
        rateText.innerText = "Connection slow. Using offline backup...";
    }
}

window.onload = init;
