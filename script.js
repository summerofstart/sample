document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayExpression: document.getElementById('expression'),
        displayResult: document.getElementById('result'),
        historyPanel: document.getElementById('historyPanel'),
        historyList: document.getElementById('historyList'),
        currentExpression: '',
        history: [],

        init() {
            this.setupEventListeners();
            this.updateDisplay();
        },

        setupEventListeners() {
            document.querySelectorAll('.key').forEach(key => {
                key.addEventListener('click', () => this.handleInput(key.textContent));
            });

            document.getElementById('themeToggle').addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
            });

            document.getElementById('historyToggle').addEventListener('click', () => {
                this.historyPanel.classList.toggle('active');
            });

            document.getElementById('clearHistory').addEventListener('click', () => {
                this.history = [];
                this.updateHistory();
            });

            document.addEventListener('keydown', (e) => this.handleKeyboardInput(e));
        },

        handleInput(value) {
            switch(value) {
                case '=':
                    this.calculate();
                    break;
                case 'C':
                    this.clear();
                    break;
                default:
                    this.appendValue(value);
            }
            this.updateDisplay();
        },

        appendValue(value) {
            this.currentExpression += value;
        },

        calculate() {
            try {
                const result = eval(this.prepareExpression(this.currentExpression));
                this.history.unshift({
                    expression: this.currentExpression,
                    result: result
                });
                this.currentExpression = result.toString();
                this.updateHistory();
            } catch (error) {
                this.currentExpression = 'Error';
            }
        },

        prepareExpression(exp) {
            return exp
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/√/g, 'Math.sqrt')
                .replace(/π/g, 'Math.PI');
        },

        clear() {
            this.currentExpression = '';
            this.displayResult.textContent = '0';
        },

        updateDisplay() {
            this.displayExpression.textContent = this.currentExpression;
            if (this.currentExpression && this.currentExpression !== 'Error') {
                try {
                    const result = eval(this.prepareExpression(this.currentExpression));
                    this.displayResult.textContent = result;
                } catch (error) {
                    this.displayResult.textContent = this.currentExpression;
                }
            }
        },

        updateHistory() {
            this.historyList.innerHTML = this.history
                .map(item => `
                    <div class="history-item">
                        <div class="expression">${item.expression}</div>
                        <div class="result">${item.result}</div>
                    </div>
                `)
                .join('');
        },

        handleKeyboardInput(e) {
            const key = e.key;
            if (/[\d\+\-\*\/$$\.]/.test(key)) {
                this.handleInput(key);
            } else if (key === 'Enter') {
                this.handleInput('=');
            } else if (key === 'Escape') {
                this.handleInput('C');
            }
            e.preventDefault();
        }
    };

    calculator.init();
});
