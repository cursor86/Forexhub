/**
 * SS Traders Education - JSONP Currency Logic
 * Bypasses CORS by using the Script Tag Hack
 */

// 1. Define the Callback Function FIRST
// This function runs automatically when the API script loads
window.myCurrencyCallback = function(data) {
    console.log("Data received via JSONP:", data);
    
    if (data.success || data.rates) {
        const rates = data.rates || data.quotes;
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        const codes = Object.keys(rates);

        // Populate dropdowns
        fromSelect.innerHTML = "";
        toSelect.innerHTML = "";
        codes.forEach(code => {
            const cleanCode = code.replace("USD", ""); // For APIs that return 'USDGBP'
            fromSelect.add(new Option(cleanCode, cleanCode));
            toSelect.add(new Option(cleanCode, cleanCode));
        });

        // Set Defaults
        fromSelect.value = "USD";
        toSelect.value = "AUD";

        // Enable the button logic
        document.getElementById('convertBtn').onclick = () => {
            const amount = document.getElementById('amount').value;
            const from = fromSelect.value;
            const to = toSelect.value;
            
            // Cross-rate calculation
            const rate = (1 / rates["USD" + from]) * rates["USD" + to];
            const result = (amount * rate).toFixed(2);
            document.getElementById('converted-total').innerText = `${result} ${to}`;
        };
        
        document.getElementById('rate-text').innerText = "Live Rates Connected (JSONP)";
    } else {
        document.getElementById('rate-text').innerText = "API Error. Check Key.";
    }
};

// 2. The function that triggers the "Script Hack"
function loadJSONP() {
    const script = document.createElement('script');
    
    // Replace YOUR_API_KEY with your actual key from Currencylayer or similar
    const API_KEY = "YOUR_FREE_KEY_HERE"; 
    const URL = `https://currencylayer.com{API_KEY}&callback=myCurrencyCallback`;

    script.src = URL;
    document.body.appendChild(script);
}

// 3. Start the process
window.onload = loadJSONP;
// Start the application
window.onload = init;
