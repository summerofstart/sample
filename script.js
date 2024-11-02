// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    const elements = {
        input: document.getElementById('input'),
        output: document.getElementById('output'),
        errorDiv: document.getElementById('error'),
        copyStatus: document.getElementById('copy-status'),
        outputContainer: document.getElementById('output-container'),
        helpModal: document.getElementById('help-modal'),
        loadingOverlay: document.querySelector('.loading-overlay')
    };

    let currentFormat = 'json';

    // フォーマットセレクター
    document.querySelectorAll('.format-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.format-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            currentFormat = option.dataset.format;
        });
    });

    // サンプルデータ
    document.getElementById('sample-data').addEventListener('click', () => {
        const sampleData = {
            "person": {
                "name": "山田太郎",
                "age": 30,
                "email": "yamada@example.com",
                "hobbies": ["読書", "旅行", "プログラミング"],
                "address": {
                    "city": "東京",
                    "country": "日本"
                }
            }
        };
        elements.input.value = JSON.stringify(sampleData, null, 2);
    });

    // XMLフォーマット関数
    function formatXML(obj, level = 0) {
        const indent = '  '.repeat(level);
        let xml = '';
        for (const key in obj) {
            const value = obj[key];
            if (Array.isArray(value)) {
                value.forEach(item => {
                    xml += `${indent}<${key}>\n${formatXML(item, level + 1)}${indent}</${key}>\n`;
                });
            } else if (typeof value === 'object' && value !== null) {
                xml += `${indent}<${key}>\n${formatXML(value, level + 1)}${indent}</${key}>\n`;
            } else {
                xml += `${indent}<${key}>${value}</${key}>\n`;
            }
        }
        return xml;
    }

    // YAMLフォーマット関数
    function formatYAML(obj, level = 0) {
        const indent = '  '.repeat(level);
        let yaml = '';
        for (const key in obj) {
            const value = obj[key];
            if (Array.isArray(value)) {
                yaml += `${indent}${key}:\n`;
                value.forEach(item => {
                    yaml += `${indent}- ${typeof item === 'object' ? '\n' + formatYAML(item, level + 2) : item}\n`;
                });
            } else if (typeof value === 'object' && value !== null) {
                yaml += `${indent}${key}:\n${formatYAML(value, level + 1)}`;
            } else {
                yaml += `${indent}${key}: ${value}\n`;
            }
        }
        return yaml;
    }

    // 変換処理
    document.getElementById('convert').addEventListener('click', async () => {
        try {
            showLoading();
            elements.errorDiv.style.display = 'none';
            
            // 入力値の検証
            if (!elements.input.value.trim()) {
                throw new Error('入力が空です');
            }

            const parsedInput = JSON.parse(elements.input.value);
            let result = '';

            // 非同期処理をシミュレート
            await new Promise(resolve => setTimeout(resolve, 500));

            switch (currentFormat) {
                case 'json':
                    result = JSON.stringify(parsedInput, null, 2);
                    break;
                case 'xml':
                    result = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${formatXML(parsedInput, 1)}</root>`;
                    break;
                case 'yaml':
                    result = formatYAML(parsedInput);
                    break;
            }

            elements.output.value = result;
            elements.outputContainer.style.display = 'block';
            showSuccess('変換が完了しました！');
        } catch (err) {
            showError(err.message);
        } finally {
            hideLoading();
        }
    });

    // コピー処理
    document.getElementById('copy').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(elements.output.value);
            showSuccess('コピーしました！');
        } catch (err) {
            showError('コピーに失敗しました');
        }
    });

    // ダウンロード処理
    document.getElementById('download').addEventListener('click', () => {
        try {
            const blob = new Blob([elements.output.value], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted.${currentFormat}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showSuccess('ダウンロードを開始しました');
        } catch (err) {
            showError('ダウンロードに失敗しました');
        }
    });

    // リセット処理
    document.getElementById('reset').addEventListener('click', () => {
        elements.input.value = '';
        elements.output.value = '';
        elements.errorDiv.style.display = 'none';
        elements.copyStatus.style.display = 'none';
        elements.outputContainer.style.display = 'none';
    });

    // ヘルプモーダル
    document.getElementById('help-button').addEventListener('click', (e) => {
        e.preventDefault();
        elements.helpModal.style.display = 'block';
    });

    document.querySelector('.modal-close').addEventListener('click', () => {
        elements.helpModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === elements.helpModal) {
            elements.helpModal.style.display = 'none';
        }
    });

    // ユーティリティ関数
    function showLoading() {
        elements.loadingOverlay.style.display = 'flex';
    }

    function hideLoading() {
        elements.loadingOverlay.style.display = 'none';
    }

    function showError(message) {
        elements.errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span class="error-message">${message}</span>
        `;
        elements.errorDiv.style.display = 'flex';
    }

    function showSuccess(message) {
        elements.copyStatus.innerHTML = `
            <i class="fas fa-check"></i>
            <span>${message}</span>
        `;
        elements.copyStatus.style.display = 'flex';
        setTimeout(() => {
            elements.copyStatus.style.display = 'none';
        }, 2000);
    }

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter で変換
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            document.getElementById('convert').click();
        }
        
        // Esc でモーダルを閉じる
        if (e.key === 'Escape' && elements.helpModal.style.display === 'block') {
            elements.helpModal.style.display = 'none';
        }
    });

    // 入力フィールドの自動リサイズ
    elements.input.addEventListener('input', autoResize);
    elements.output.addEventListener('input', autoResize);

    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }
}
