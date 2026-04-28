// Using the Frankfurter API - Guaranteed to work on GitHub Pages
const API_URL = "https://frankfurter.app";

async function init() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const rateText = document.getElementById('rate-text');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Connection failed');
        
        const data = await response.json();
        const codes = Object.keys(data.rates);
        
        // Add EUR (the base) and sort alphabetically
        if (!codes.includes('EUR')) codes.push('EUR');
        codes.sort();

        // Clear and fill dropdowns
        fromSelect.innerHTML = "";
        toSelect.innerHTML = "";
        
        codes.forEach(code => {
            fromSelect.add(new Option(code, code));
            toSelect.add(new Option(code, code));
        });

        // Set defaults
        fromSelect.value = "USD";
        toSelect.value = "AUD";
        rateText.innerText = "Live Rates Active (Secure)";

        // Set up the click event for the Convert button
        document.getElementById('convertBtn').onclick = async () => {
            const amount = document.getElementById('amount').value;
            const from = fromSelect.value;
            const to = toSelect.value;

            if (from === to) {
                document.getElementById('converted-total').innerText = `${amount} ${to}`;
                return;
            }

            try {
                const res = await fetch(`${API_URL}?amount=${amount}&from=${from}&to=${to}`);
                const resultData = await res.json();
                const result = resultData.rates[to].toLocaleString(undefined, {minimumFractionDigits: 2});
                document.getElementById('converted-total').innerText = `${result} ${to}`;
            } catch (err) {
                rateText.innerText = "Error calculating. Try again.";
            }
        };

    } catch (error) {
        console.error("Fetch error:", error);
        rateText.innerText = "Connection blocked. Check internet or extensions.";
    }
}

// Start the script
window.onload = init;

