const API = "https://frankfurter.app";

async function init() {
    try {
        const [today, yesterday] = await Promise.all([
            fetch(`${API}/latest?from=USD`).then(r => r.json()),
            fetch(`${API}/${getYesterdayDate()}?from=USD`).then(r => r.json())
        ]);

        const rates = today.rates;
        const codes = Object.keys(rates);
        codes.push('USD'); codes.sort();

        // 1. Dropdowns
        const from = document.getElementById('fromCurrency');
        const to = document.getElementById('toCurrency');
        codes.forEach(c => {
            from.add(new Option(c, c));
            to.add(new Option(c, c));
        });
        from.value = "USD"; to.value = "AUD";

        // 2. Render TOP 3 TRENDS
        const top3 = ['EUR', 'GBP', 'AUD'];
        document.getElementById('top-3-body').innerHTML = top3.map(code => {
            const change = ((today.rates[code] - yesterday.rates[code]) / yesterday.rates[code] * 100).toFixed(2);
            const isUp = change >= 0;
            return `
                <div class="trend-card">
                    <div>
                        <div class="trend-pair">USD/${code}</div>
                        <div class="trend-val">${today.rates[code].toFixed(4)}</div>
                    </div>
                    <div class="change-badge" style="background:${isUp?'#10b98120':'#ef444420'}; color:${isUp?'#10b981':'#ef4444'}">
                        ${isUp?'▲':'▼'} ${Math.abs(change)}%
                    </div>
                </div>
            `;
        }).join('');

        // 3. Converter Calculation
        document.getElementById('convertBtn').onclick = () => {
            const amt = document.getElementById('amount').value || 1;
            const fromVal = (from.value === 'USD') ? 1 : rates[from.value];
            const toVal = (to.value === 'USD') ? 1 : rates[to.value];
            const result = (amt / fromVal) * toVal;
            document.getElementById('converted-total').innerText = result.toLocaleString(undefined, {minimumFractionDigits: 2});
        };

        document.getElementById('rate-text').innerText = "● System Online";

    } catch (e) {
        document.getElementById('rate-text').innerText = "● Market Connection Error";
    }
}

function getYesterdayDate() {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

init();

    updateMarketTrends();
};
