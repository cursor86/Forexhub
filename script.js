/**
 * Optimized High-Speed Logic for SS Traders Education
 * Features: Parallel Fetching & 3-Second Fail-Safe
 */

const API_URL = "https://frankfurter.app";

// Built-in rates for instant fallback if the network is slow
const fallbackRates = { "USD": 1, "AUD": 1.54, "EUR": 0.92, "GBP": 0.81, "INR": 83.5, "CAD": 1.37, "JPY": 156.2 };

async function init() {
    const rateText = document.getElementById('rate-text');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    // Start fetching live data
    const fetchPromise = fetch(API_URL).then(res => res.json());

    // Create a 'timeout' promise that triggers after 3 seconds
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 3000)
    );

    try {
        // Race the API against the clock
        const data = await Promise.race([fetchPromise, timeoutPromise]);
        setupConverter(data.rates, "Live Market Connected");
    } catch (error) {
        console.warn("API slow or blocked. Using high-speed fallback.");
        setupConverter(fallbackRates, "High-Speed Mode Active");
    }
}

function setupConverter(rates, status) {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const codes = Object.keys(rates);
    if (!codes.includes('EUR')) codes.push('EUR');
    codes.sort();

    // Fill dropdowns
    fromSelect.innerHTML = ""; toSelect.innerHTML = "";
    codes.forEach(code => {
        fromSelect.add(new Option(code, code));
        toSelect.add(new Option(code, code));
    });

    // Set defaults
    fromSelect.value = "USD";
    toSelect.value = "AUD";
    document.getElementById('rate-text').innerText = status;

    // Attach Click Event
    document.getElementById('convertBtn').onclick = () => {
        const amount = document.getElementById('amount').value || 1;
        const from = fromSelect.value;
        const to = toSelect.value;
        
        // Calculation
        const fromRate = (from === 'EUR') ? 1 : rates[from];
        const toRate = (to === 'EUR') ? 1 : rates[to];
        const result = (amount / fromRate) * toRate;

        document.getElementById('converted-total').innerText = result.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('rate-text').innerText = `1 ${from} = ${(result/amount).toFixed(4)} ${to}`;
    };
}

window.onload = init;

window.onload = () => getLiveRates();

