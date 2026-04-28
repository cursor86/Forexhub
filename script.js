const API_URL = "https://er-api.com";

async function init() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const rates = data.rates;
        const codes = Object.keys(rates);

        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');

        // Clear existing options
        fromSelect.innerHTML = "";
        toSelect.innerHTML = "";

        codes.forEach(code => {
            fromSelect.add(new Option(code, code));
            toSelect.add(new Option(code, code));
        });

        fromSelect.value = "USD";
        toSelect.value = "AUD";
        
        document.getElementById('rate-text').innerText = "Rates Loaded Successfully";
        console.log("Rates Loaded");
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('rate-text').innerText = "Failed to load live rates. Try refreshing.";
    }
}

window.onload = init;
