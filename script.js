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

            // Add ripple effect
            this.addRippleEffect(button);
        },

        calculate() {
            try {
                let exp = this.displayExpression.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/−/g, '-')
                    .replace(/π/g, 'Math.PI')
                    .replace(/e/g, 'Math.E');

                // Handle special functions
                exp = this.handleMathFunctions(exp);

                const result = eval(exp);
                this.displayResult.value = this.formatResult(result);
                this.addToHistory(this.displayExpression.value, this.displayResult.value);
            } catch (error) {
                this.displayResult.value =
