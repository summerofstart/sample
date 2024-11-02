/* グローバル設定 */
body {
    font-family: 'Roboto', sans-serif;
    background: linear-gradient(135deg, #f0f4f8, #e0e7ff);
    margin: 0;
    padding: 0;
    color: #344952;
}

/* コンテナ */
.container {
    max-width: 900px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
}

.container:hover {
    transform: translateY(-5px);
}

/* タイトル */
.title {
    text-align: center;
    font-size: 36px;
    margin-bottom: 20px;
    color: #2d3748;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
}

/* テキストエリア */
.textarea {
    width: 100%;
    height: 200px;
    padding: 16px;
    margin: 12px 0;
    font-family: 'Consolas', monospace;
    border: 2px solid #cbd5e0;
    border-radius: 8px;
    resize: vertical;
    background: #f9f9f9;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.textarea:focus {
    border-color: #4a5568;
    box-shadow: 0 0 0 3px rgba(74, 85, 104, 0.2);
    outline: none;
}

/* ボタングループ */
.button-group {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin: 20px 0;
}

/* ボタン */
.button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: linear-gradient(135deg, #4a5568, #2d3748);
    color: white;
    font-weight: 600;
    transition: background 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.button:hover {
    background: linear-gradient(135deg, #2c5282, #3182ce);
    transform: translateY(-2px);
}

/* エラーメッセージ */
.error {
    color: #e53e3e;
    background: rgba(229, 62, 62, 0.1);
    padding: 12px;
    border-radius: 6px;
    margin: 12px 0;
    border-left: 4px solid #e53e3e;
    display: none;
}

/* 成功メッセージ */
.success {
    color: #38a169;
    text-align: center;
    margin-top: 12px;
    display: none;
    font-weight: 600;
}

/* コピー状況 */
.copy-status {
    display: none;
    color: #38a169;
    font-weight: 600;
    text-align: center;
    margin-top: 10px;
}

/* 入力・出力コンテナ */
#output-container {
    display: none;
}

/* スマホ対応 */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }

    .button {
        padding: 10px 20px;
    }

    .textarea {
        height: 150px;
    }

    .title {
        font-size: 28px;
    }
}
