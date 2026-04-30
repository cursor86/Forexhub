// PERMANENT CORS FIX: Using Frankfurter API (CORS-Enabled)
const API_URL = "https://frankfurter.app";

async function init() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const rateText = document.getElementById('rate-text');
    const convertBtn = document.getElementById('convertBtn');

    try {
        // 1. Fetch initial data to get currency codes
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API unreachable');
        
        const data = await response.json();
        const codes = Object.keys(data.rates);
        
        // Add EUR (the base currency) and sort them
        if (!codes.includes('EUR')) codes.push('EUR');
        codes.sort();

        // 2. Populate Dropdowns
        fromSelect.innerHTML = "";
        toSelect.innerHTML = "";
        codes.forEach(code => {
            fromSelect.add(new Option(code, code));
            toSelect.add(new Option(code, code));
        });

        // 3. Set Defaults
        fromSelect.value = "USD";
        toSelect.value = "AUD";
        rateText.innerText = "Live Market Connection: Active";

        // 4. Conversion Logic
        convertBtn.onclick = async () => {
            const amount = document.getElementById('amount').value || 1;
            const from = fromSelect.value;
            const to = toSelect.value;

            if (from === to) {
                document.getElementById('converted-total').innerText = `${amount} ${to}`;
                return;
            }

            try {
                rateText.innerText = "Updating...";
                const res = await fetch(`${API_URL}?amount=${amount}&from=${from}&to=${to}`);
                const resultData = await res.json();
                const result = resultData.rates[to].toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                
                document.getElementById('converted-total').innerText = `${result} ${to}`;
                rateText.innerText = `1 ${from} = ${(resultData.rates[to]/amount).toFixed(4)} ${to}`;
            } catch (err) {
                rateText.innerText = "Conversion error. Try again.";
            }
        };

        // Run one conversion on load
        convertBtn.click();

    } catch (error) {
        console.error("CORS Fix failed:", error);
        rateText.innerText = "Connection blocked. Please disable Ad-Blockers and Refresh.";
    }
}

// Start the application
window.onload = init;
