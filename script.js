/**
 * SS Traders Education - Final "CORS-Proof" Logic
 * Method: JSONP (Bypasses browser security blocks)
 */

// 1. The Callback: This runs as soon as the data arrives
window.handleRates = function(data) {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const rateText = document.getElementById('rate-text');
    const convertBtn = document.getElementById('convertBtn');
    const resultDisplay = document.getElementById('converted-total');

    if (data && data.rates) {
        const rates = data.rates;
        const codes = Object.keys(rates);
        codes.push('USD'); // Ensure base is included
        codes.sort();

        // Populate Dropdowns
        fromSelect.innerHTML = "";
        toSelect.innerHTML = "";
        codes.forEach(code => {
            fromSelect.add(new Option(code, code));
            toSelect.add(new Option(code, code));
        });

        fromSelect.value = "USD";
        toSelect.value = "AUD";
        rateText.innerText = "Live Market Status: Connected (Secure)";

        // Conversion Logic
        convertBtn.onclick = () => {
            const amt = parseFloat(document.getElementById('amount').value) || 1;
            const from = fromSelect.value;
            const to = toSelect.value;

            // Calculate via USD base: (Amount / RateOfFrom) * RateOfTo
            const fromRate = (from === 'USD') ? 1 : rates[from];
            const toRate = (to === 'USD') ? 1 : rates[to];
            const finalValue = (amt / fromRate) * toRate;

            resultDisplay.innerText = finalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2
            }) + " " + to;

            rateText.innerText = `1 ${from} = ${(toRate / fromRate).toFixed(4)} ${to}`;
        };

        // Initial Calculation
        convertBtn.click();
    }
};

// 2. The Trigger: Loads the API as a Script to bypass CORS
function connectToLiveMarket() {
    const script = document.createElement('script');
    // Using Open-ER-API which supports the ?callback= parameter
    script.src = "https://er-api.com";
    
    script.onerror = () => {
        document.getElementById('rate-text').innerText = "Network Shield Active. Please disable Ad-blockers.";
    };
    
    document.body.appendChild(script);
}

// Start the process
window.onload = connectToLiveMarket;
