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
            document.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', () => this.handleButtonClick(button));
            });

            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
            document.addEventListener('keydown', (e) => this.handleKeyPress(e));
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

        handleButtonClick(button) {
            const value = button.textContent;
            const type = button.dataset.type;

            switch(type) {
                case 'equals':
                    this.calculate();
                    break;
                case 'clear':
                    this.clear();
                    break;
                case 'backspace':
                    this.backspace();
                    break;
                case 'operator':
                case 'function':
                case 'constant':
                    this.appendToExpression(value);
                    break;
                default:
                    this.appendToExpression(value);
            }

            this.addRippleEffect(button);
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

        appendToExpression(value) {
            this.displayExpression.value += value;
            this.displayExpression.scrollLeft = this.displayExpression.scrollWidth;
        },

        calculate() {
            try {
                let exp = this.displayExpression.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/−/g, '-')
                    .replace(/π/g, 'Math.PI')
                    .replace(/e/g, 'Math.E');

                exp = this.handleMathFunctions(exp);
                const result = this.evaluateExpression(exp);
                this.displayResult.value = this.formatResult(result);
                this.addToHistory(this.displayExpression.value, this.displayResult.value);
            } catch (error) {
                this.displayResult.value = 'Error';
            }
        },

        handleMathFunctions(exp) {
            exp = exp.replace(/sin$/g, 'Math.sin(');
            exp = exp.replace(/cos\(/g, 'Math.cos(');
            exp = exp.replace(/tan\(/g, 'Math.tan(');
            exp = exp.replace(/log\(/g, 'Math.log(');
            exp = exp.replace(/√\(/g, 'Math.sqrt(');
            return exp;
        },

        evaluateExpression(exp) {
            // 安全な式の評価のための基本的なチェック
            if (!/^[0-9\s\+\-\*\/\($\.\,Math\sqrt\sin\cos\tan\log\PI\E]+$/.test(exp)) {
                throw new Error('Invalid expression');
            }
            return Function('"use strict";return (' + exp + ')')();
        },

        formatResult(result) {
            if (Number.isInteger(result)) {
                return result.toString();
            }
            return Number(result.toFixed(8)).toString();
        },

        clear() {
            this.displayExpression.value = '';
            this.displayResult.value = '';
        },

        backspace() {
            this.displayExpression.value = this.displayExpression.value.slice(0, -1);
        },

        addToHistory(expression, result) {
            this.calculations.unshift({ expression, result });
            this.updateHistoryDisplay();
        },

        updateHistoryDisplay() {
            this.history.innerHTML = this.calculations
                .map((calc, index) => `
                    <div class="history-item" style="animation-delay: ${index * 0.1}s">
                        <div class="expression">${calc.expression}</div>
                        <div class="result">=&nbsp;<span>${calc.result}</span></div>
                    </div>
                `)
                .join('');
        },

        clearHistory() {
            this.calculations = [];
            this.updateHistoryDisplay();
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
            this.updateParticlesColor();
        },

        updateParticlesColor() {
            const isDark = document.body.classList.contains('dark-theme');
            document.querySelectorAll('.particle').forEach(particle => {
                particle.style.background = isDark ? 
                    `hsl(${Math.random() * 60 + 200}, 70%, 60%)` :
                    `hsl(${Math.random() * 60 + 260}, 70%, 60%)`;
            });
        }
    };

    // 追加のスタイル
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
