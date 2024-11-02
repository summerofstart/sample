// 要素の取得
const input = document.getElementById('input');
const output = document.getElementById('output');
const errorDiv = document.getElementById('error');
const copyStatus = document.getElementById('copy-status');
const outputContainer = document.getElementById('output-container');
let currentFormat = 'json';

// フォーマットボタンの処理
document.querySelectorAll('[data-format]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('[data-format]').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        currentFormat = button.dataset.format;
    });
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
document.getElementById('convert').addEventListener('click', () => {
    try {
        errorDiv.style.display = 'none';
        let parsedInput;

        // 入力がJSON形式であるかチェック
        if (input.value.trim().startsWith('{') || input.value.trim().startsWith('[')) {
            parsedInput = JSON.parse(input.value);
        } else if (input.value.trim().startsWith('<')) {
            // XML形式の解析
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(input.value, 'application/xml');
            parsedInput = xmlToJson(xmlDoc);
        } else {
            // YAML形式の解析
            parsedInput = jsyaml.load(input.value);
        }

        let result = '';

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

        output.value = result;
        outputContainer.style.display = 'block';
    } catch (err) {
        errorDiv.textContent = '入力の形式が正しくありません。JSON、XML、またはYAML形式を使用してください。';
        errorDiv.style.display = 'block';
    }
});

// XMLをJSONに変換する関数
function xmlToJson(xml) {
    const obj = {};
    if (xml.nodeType === 1) { // element
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof (obj[nodeName]) === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName]) === "object") {
                    if (Array.isArray(obj[nodeName])) {
                        obj[nodeName].push(xmlToJson(item));
                    } else {
                        obj[nodeName] = [obj[nodeName], xmlToJson(item)];
                    }
                } else {
                    obj[nodeName] = [obj[nodeName], xmlToJson(item)];
                }
            }
        }
    }
    return obj;
}

// コピー処理
document.getElementById('copy').addEventListener('click', () => {
    navigator.clipboard.writeText(output.value);
    copyStatus.textContent = 'コピーしました！';
    copyStatus.style.display = 'block';
    setTimeout(() => {
        copyStatus.style.display = 'none';
    }, 2000);
});

// リセット処理
document.getElementById('reset').addEventListener('click', () => {
    input.value = '';
    output.value = '';
    errorDiv.style.display = 'none';
    copyStatus.style.display = 'none';
    outputContainer.style.display = 'none';
});
