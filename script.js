document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayExpression: document.getElementById('expression'),
        displayResult: document.getElementById('result'),
        history: document.getElementById('history'),
        themeToggle: document.getElementById('themeToggle'),
        clearHistoryBtn: document.getElementById('clearHistory'),
        calculations: [],
        
        init() {
            this.setupEventListeners();
            this.setupParticles();
            this.loadTheme();
        },

        setupEventListeners() {
            // 数字ボタン
            document.querySelectorAll('.number-btn').forEach(button => {
                button.addEventListener('click', () => {
                    this.appendToExpression(button.textContent);
                    this.addRippleEffect(button);
                });
            });

            // 演算子ボタン
            document.querySelectorAll('.operator-btn').forEach(button => {
                button.addEventListener('click', () => {
                    let operator = button.textContent;
                    // 演算子の変換
                    switch(operator) {
                        case '×': operator = '*'; break;
                        case '÷': operator = '/'; break;
                        case '−': operator = '-'; break;
                    }
                    this.appendToExpression(operator);
                    this.addRippleEffect(button);
                });
            });

            // 関数ボタン
            document.querySelectorAll('.advanced-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const func = button.textContent;
                    if (['sin', 'cos', 'tan', 'log'].includes(func)) {
                        this.appendToExpression(func + '(');
                    } else if (func === '√') {
                        this.appendToExpression('sqrt(');
                    } else {
                        this.appendToExpression(func);
                    }
                    this.addRippleEffect(button);
                });
            });

            // イコールボタン
            document.querySelector('.equals-btn').addEventListener('click', () => {
                this.calculate();
                this.addRippleEffect(document.querySelector('.equals-btn'));
            });

            // クリアボタン
            document.querySelector('[data-type="clear"]').addEventListener('click', () => {
                this.clear();
                this.addRippleEffect(document.querySelector('[data-type="clear"]'));
            });

            // バックスペースボタン
            document.querySelector('[data-type="backspace"]').addEventListener('click', () => {
                this.backspace();
                this.addRippleEffect(document.querySelector('[data-type="backspace"]'));
            });

            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
            document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        },

        appendToExpression(value) {
            this.displayExpression.value += value;
        },

        calculate() {
            try {
                let expression = this.displayExpression.value;
                
                // 特殊文字の置換
                expression = expression
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/−/g, '-')
                    .replace(/π/g, Math.PI)
                    .replace(/e/g, Math.E)
                    .replace(/sin$/g, 'Math.sin(')
                    .replace(/cos\(/g, 'Math.cos(')
                    .replace(/tan\(/g, 'Math.tan(')
                    .replace(/log\(/g, 'Math.log(')
                    .replace(/sqrt\(/g, 'Math.sqrt(');

                // 計算実行
                const result = this.safeEval(expression);
                
                // 結果の表示
                if (isNaN(result)) {
                    this.displayResult.value = 'Error';
                } else {
                    const formattedResult = this.formatResult(result);
                    this.displayResult.value = formattedResult;
                    this.addToHistory(this.displayExpression.value, formattedResult);
                }
            } catch (error) {
                this.displayResult.value = 'Error';
            }
        },

        safeEval(expression) {
            // 基本的な安全性チェック
            if (!/^[0-9\s\+\-\*\/\($\.\,Math\sqrt\sin\cos\tan\log\d\.]+$/.test(expression)) {
                throw new Error('Invalid expression');
            }
            
            try {
                return Function('"use strict";return (' + expression + ')')();
            } catch (e) {
                throw new Error('Calculation error');
            }
        },

        formatResult(result) {
            if (typeof result === 'number') {
                if (Number.isInteger(result)) {
                    return result.toString();
                }
                return parseFloat(result.toFixed(8)).toString();
            }
            return 'Error';
        },

        clear() {
            this.displayExpression.value = '';
            this.displayResult.value = '';
        },

        backspace() {
            this.displayExpression.value = this.displayExpression.value.slice(0, -1);
        },

        handleKeyPress(e) {
            const key = e.key;
            if (/[\d\+\-\*\/$$\.]/.test(key)) {
                this.appendToExpression(key);
            } else if (key === 'Enter') {
                this.calculate();
            } else if (key === 'Escape') {
                this.clear();
            } else if (key === 'Backspace') {
                this.backspace();
            }
        },

        addToHistory(expression, result) {
            this.calculations.unshift({ expression, result });
            this.updateHistoryDisplay();
        },

        updateHistoryDisplay() {
            this.history.innerHTML = this.calculations
                .map((calc, index) => `
                    <div class="history-item">
                        ${calc.expression} = <span>${calc.result}</span>
                    </div>
                `)
                .join('');
        },

        clearHistory() {
            this.calculations = [];
            this.updateHistoryDisplay();
        },

        setupParticles() {
            const particles = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.setProperty('--x', `${Math.random() * 100}%`);
                particle.style.setProperty('--y', `${Math.random() * 100}%`);
                particle.style.setProperty('--duration', `${Math.random() * 20 + 10}s`);
                particle.style.setProperty('--delay', `${Math.random() * 10}s`);
                particles.appendChild(particle);
            }
        },

        addRippleEffect(button) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            button.appendChild(ripple);

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(1)';
                ripple.style.opacity = '0';
            });

            setTimeout(() => ripple.remove(), 1000);
        },

        loadTheme() {
            const savedTheme = localStorage.getItem('calculator-theme') || 'light';
            document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        },

        toggleTheme() {
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('calculator-theme', isDark ? 'dark' : 'light');
        }
    };

    // スタイルの追加
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: hsl(260, 70%, 60%);
            opacity: 0.3;
            transform: translate(var(--x), var(--y));
            animation: float var(--duration) ease-in-out var(--delay) infinite;
        }

        @keyframes float {
            0%, 100% {
                transform: translate(var(--x), var(--y)) translate(0, 0);
            }
            50% {
                transform: translate(var(--x), var(--y)) translate(20px, -20px);
            }
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            pointer-events: none;
            transition: transform 0.6s, opacity 0.6s;
        }
    `;
    document.head.appendChild(style);

    calculator.init();
});
