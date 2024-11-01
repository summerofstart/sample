document.addEventListener('DOMContentLoaded', () => {
    const expression = document.getElementById('expression');
    const result = document.getElementById('result');
    const buttons = document.querySelectorAll('button');
    const history = document.getElementById('history');
    const themeToggle = document.getElementById('themeToggle');
    const clearHistoryBtn = document.getElementById('clearHistory');
    let calculations = [];

    // テーマ切り替え
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });

    // 履歴クリア
    clearHistoryBtn.addEventListener('click', () => {
        calculations = [];
        history.innerHTML = '';
    });

    // ボタンクリックハンドラー
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value === 'C') {
                expression.value = '';
                result.value = '';
            } else if (value === '=') {
                try {
                    const exp = expression.value;
                    const res = evaluateExpression(exp);
                    result.value = res;
                    addToHistory(exp, res);
                } catch (error) {
                    result.value = 'Error';
                }
            } else {
                if (['sin', 'cos', 'tan', 'log'].includes(value)) {
                    expression.value += value + '(';
                } else {
                    expression.value += value;
                }
            }
        });
    });

    // 数式の評価
    function evaluateExpression(exp) {
        // 基本的な数学関数の実装
        exp = exp.replace(/sin$/g, 'Math.sin(');
        exp = exp.replace(/cos\(/g, 'Math.cos(');
        exp = exp.replace(/tan\(/g, 'Math.tan(');
        exp = exp.replace(/log\(/g, 'Math.log(');
        exp = exp.replace(/π/g, 'Math.PI');
        exp = exp.replace(/e/g, 'Math.E');
        exp = exp.replace(/√/g, 'Math.sqrt');
        exp = exp.replace(/x²/g, '**2');
        
        return eval(exp);
    }

    // 履歴に追加
    function addToHistory(exp, res) {
        calculations.unshift({ expression: exp, result: res });
        updateHistoryDisplay();
    }

    // 履歴表示の更新
    function updateHistoryDisplay() {
        history.innerHTML = calculations
            .map(calc => `
                <div class="history-item">
                    ${calc.expression} = <span>${calc.result}</span>
                </div>
            `)
            .join('');
    }

    // キーボード入力のサポート
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (/[\d\+\-\*\/\($\.]/.test(key)) {
            expression.value += key;
        } else if (key === 'Enter') {
            document.querySelector('.equals').click();
        } else if (key === 'Escape') {
            document.querySelector('.clear').click();
        }
    });
});
