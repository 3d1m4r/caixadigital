// ===== INICIALIZAÇÃO ===== //
document.addEventListener('DOMContentLoaded', function() {
    initializeToolbox();
});

function initializeToolbox() {
    initializeCurrencyConverter();
}

function initializeCurrencyConverter() {
    // Inicializar componentes comuns
    setupMobileNavigation();
    
    // Verificar qual página está ativa de forma mais precisa
    const currentPage = window.location.pathname;
    const isPasswordGenerator = currentPage.includes('gerador.html') || document.getElementById('password-form');
    const isCurrencyConverter = document.getElementById('converter-form');
    
    if (isPasswordGenerator && !isCurrencyConverter) {
        console.log('Inicializando gerador de senhas...');
        setupPasswordGenerator();
    } else if (isCurrencyConverter && !isPasswordGenerator) {
        console.log('Inicializando conversor de moedas...');
        setupFormHandlers();
        setupInputFormatting();
    } else {
        console.log('Página não reconhecida ou elementos não encontrados');
    }
    
    // Adicionar classe loaded para animações CSS
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    console.log('Ferramentas premium inicializadas com tecnologias avançadas!');
}

// ===== CONFIGURAÇÕES DA API ===== //
const API_CONFIG = {
    baseUrl: 'https://economia.awesomeapi.com.br/json/last/',
    timeout: 10000,
    retries: 3
};

// Mapeamento de moedas para símbolos
const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    ARS: '$',
    GBP: '£',
    CAD: 'C$',
    JPY: '¥',
    CNY: '¥',
    BTC: '₿',
    ETH: 'Ξ'
};

// ===== MANIPULAÇÃO DE FORMULÁRIO ===== //
function setupFormHandlers() {
    const form = document.getElementById('converter-form');
    const amountInput = document.getElementById('amount');
    const currencySelect = document.getElementById('currency');
    
    if (!form || !amountInput || !currencySelect) {
        console.log('Conversor não encontrado nesta página - OK se for o gerador de senhas');
        return;
    }
    
    console.log('Configurando manipuladores do conversor de moedas...');
    
    // Event listener para submissão do formulário
    form.addEventListener('submit', handleFormSubmission);
    
    // Event listeners para validação em tempo real
    amountInput.addEventListener('input', validateAmount);
    currencySelect.addEventListener('change', validateCurrency);
    
    // Limpeza automática de erros
    [amountInput, currencySelect].forEach(input => {
        input.addEventListener('focus', clearValidationErrors);
    });
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    
    // Validação
    if (!validateInputs(amount, currency)) {
        return;
    }
    
    // Iniciar conversão
    performCurrencyConversion(parseFloat(amount), currency);
}

// ===== VALIDAÇÃO DE INPUTS ===== //
function validateInputs(amount, currency) {
    let isValid = true;
    
    // Validar valor
    if (!amount || amount <= 0) {
        showFieldError('amount', 'Digite um valor válido maior que zero');
        isValid = false;
    }
    
    // Validar moeda
    if (!currency) {
        showFieldError('currency', 'Selecione uma moeda de destino');
        isValid = false;
    }
    
    return isValid;
}

function validateAmount(event) {
    const value = event.target.value;
    
    if (value && value <= 0) {
        showFieldError('amount', 'O valor deve ser maior que zero');
    } else {
        clearFieldError('amount');
    }
}

function validateCurrency(event) {
    const value = event.target.value;
    
    if (!value) {
        showFieldError('currency', 'Selecione uma moeda');
    } else {
        clearFieldError('currency');
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = field.parentNode.querySelector('.field-error') || createErrorElement(field);
    
    field.style.borderColor = 'var(--vermelho-erro)';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = field.parentNode.querySelector('.field-error');
    
    field.style.borderColor = '#e9ecef';
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearValidationErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(error => {
        error.style.display = 'none';
    });
    
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.style.borderColor = '#e9ecef';
    });
}

function createErrorElement(field) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: var(--vermelho-erro);
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: none;
    `;
    field.parentNode.appendChild(errorDiv);
    return errorDiv;
}

// ===== FORMATAÇÃO DE INPUTS ===== //
function setupInputFormatting() {
    const amountInput = document.getElementById('amount');
    
    if (amountInput) {
        // Formatação em tempo real (opcional - pode ser removida se causar problemas)
        amountInput.addEventListener('input', function(event) {
            let value = event.target.value;
            
            // Remover caracteres não numéricos exceto ponto e vírgula
            value = value.replace(/[^\d.,]/g, '');
            
            // Substituir vírgula por ponto para cálculos
            value = value.replace(',', '.');
            
            event.target.value = value;
        });
    }
}

// ===== CONVERSÃO DE MOEDAS ===== //
async function performCurrencyConversion(amount, targetCurrency) {
    try {
        // Mostrar estado de loading
        setLoadingState(true);
        hideResults();
        
        // Buscar cotação da API
        const exchangeRate = await fetchExchangeRate(targetCurrency);
        
        // Calcular resultado
        const convertedAmount = amount / exchangeRate.bid;
        
        // Exibir resultado
        displayConversionResult({
            originalAmount: amount,
            convertedAmount: convertedAmount,
            targetCurrency: targetCurrency,
            exchangeRate: exchangeRate,
            timestamp: exchangeRate.timestamp
        });
        
    } catch (error) {
        console.error('Erro na conversão:', error);
        displayConversionError(error.message);
    } finally {
        setLoadingState(false);
    }
}

async function fetchExchangeRate(currency) {
    const url = `${API_CONFIG.baseUrl}${currency}-BRL`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(API_CONFIG.timeout)
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        const currencyKey = `${currency}BRL`;
        
        if (!data[currencyKey]) {
            throw new Error(`Dados não encontrados para ${currency}`);
        }
        
        const rateData = data[currencyKey];
        
        return {
            bid: parseFloat(rateData.bid),
            ask: parseFloat(rateData.ask),
            timestamp: rateData.create_date,
            name: rateData.name
        };
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Tempo limite excedido. Verifique sua conexão.');
        }
        
        throw new Error(`Erro ao buscar cotação: ${error.message}`);
    }
}

// ===== EXIBIÇÃO DE RESULTADOS ===== //
function displayConversionResult(result) {
    const resultCard = document.getElementById('result-card');
    const resultValue = document.getElementById('result-value');
    const conversionRate = document.getElementById('conversion-rate');
    const updateTime = document.getElementById('update-time');
    
    if (!resultCard || !resultValue || !conversionRate || !updateTime) {
        console.error('Elementos de resultado não encontrados');
        return;
    }
    
    // Formatar valores
    const formattedOriginal = formatCurrency(result.originalAmount, 'BRL');
    const formattedConverted = formatCurrency(result.convertedAmount, result.targetCurrency);
    const formattedRate = formatCurrency(result.exchangeRate.bid, 'BRL');
    
    // Preencher conteúdo
    resultValue.innerHTML = `
        <div style="font-size: 1.2rem; color: var(--cinza-texto); margin-bottom: 0.5rem;">
            ${formattedOriginal}
        </div>
        <div style="font-size: 2.5rem; color: var(--dourado); font-weight: 700;">
            ${formattedConverted}
        </div>
    `;
    
    conversionRate.textContent = `1 ${result.targetCurrency} = ${formattedRate}`;
    
    updateTime.textContent = `Última atualização: ${formatTimestamp(result.timestamp)}`;
    
    // Mostrar resultado
    hideError();
    resultCard.classList.remove('hidden');
    
    // Animação de entrada
    setTimeout(() => {
        resultCard.style.animation = 'slideInUp 0.5s ease-out';
    }, 50);
}

function displayConversionError(errorMessage) {
    const errorCard = document.getElementById('error-card');
    const errorMessageElement = document.getElementById('error-message');
    
    if (!errorCard || !errorMessageElement) {
        console.error('Elementos de erro não encontrados');
        return;
    }
    
    errorMessageElement.textContent = errorMessage;
    
    // Mostrar erro
    hideResults();
    errorCard.classList.remove('hidden');
}

// ===== UTILITÁRIOS ===== //
function formatCurrency(amount, currency) {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    
    // Formatação especial para criptomoedas
    if (currency === 'BTC' || currency === 'ETH') {
        return `${symbol} ${amount.toLocaleString('pt-BR', {
            minimumFractionDigits: 6,
            maximumFractionDigits: 8
        })}`;
    }
    
    // Formatação padrão
    return `${symbol} ${amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Data indisponível';
    }
}

// ===== CONTROLE DE INTERFACE ===== //
function setLoadingState(isLoading) {
    const button = document.querySelector('.convert-btn');
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        btnText.style.opacity = '0';
        btnLoader.classList.remove('hidden');
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        btnText.style.opacity = '1';
        btnLoader.classList.add('hidden');
    }
}

function hideResults() {
    const resultCard = document.getElementById('result-card');
    if (resultCard) {
        resultCard.classList.add('hidden');
    }
}

function hideError() {
    const errorCard = document.getElementById('error-card');
    if (errorCard) {
        errorCard.classList.add('hidden');
    }
}

function clearError() {
    hideError();
    clearValidationErrors();
}

// ===== NAVEGAÇÃO MOBILE ===== //
function setupMobileNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== GERADOR DE SENHAS ===== //
function setupPasswordGenerator() {
    const passwordForm = document.getElementById('password-form');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordGeneration);
        
        // Setup length input validation
        const lengthInput = document.getElementById('password-length');
        if (lengthInput) {
            lengthInput.addEventListener('input', validatePasswordLength);
        }
    }
}

function handlePasswordGeneration(event) {
    event.preventDefault();
    
    const length = parseInt(document.getElementById('password-length').value);
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeLowercase = document.getElementById('include-lowercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;
    
    // Validação
    if (!validatePasswordOptions(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols)) {
        return;
    }
    
    // Gerar senha
    try {
        const password = generateSecurePassword(length, {
            uppercase: includeUppercase,
            lowercase: includeLowercase,
            numbers: includeNumbers,
            symbols: includeSymbols
        });
        
        displayGeneratedPassword(password);
        
    } catch (error) {
        console.error('Erro na geração:', error);
        displayPasswordError(error.message);
    }
}

function validatePasswordOptions(length, uppercase, lowercase, numbers, symbols) {
    // Verificar se pelo menos uma opção está selecionada
    if (!uppercase && !lowercase && !numbers && !symbols) {
        displayPasswordError('Selecione pelo menos uma opção de caracteres');
        return false;
    }
    
    // Verificar tamanho mínimo
    if (length < 4) {
        displayPasswordError('A senha deve ter pelo menos 4 caracteres');
        return false;
    }
    
    // Verificar tamanho máximo
    if (length > 128) {
        displayPasswordError('A senha não pode ter mais de 128 caracteres');
        return false;
    }
    
    return true;
}

function generateSecurePassword(length, options) {
    const characters = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let availableChars = '';
    let requiredChars = [];
    
    // Construir conjunto de caracteres disponíveis
    if (options.uppercase) {
        availableChars += characters.uppercase;
        requiredChars.push(getRandomChar(characters.uppercase));
    }
    if (options.lowercase) {
        availableChars += characters.lowercase;
        requiredChars.push(getRandomChar(characters.lowercase));
    }
    if (options.numbers) {
        availableChars += characters.numbers;
        requiredChars.push(getRandomChar(characters.numbers));
    }
    if (options.symbols) {
        availableChars += characters.symbols;
        requiredChars.push(getRandomChar(characters.symbols));
    }
    
    if (availableChars.length === 0) {
        throw new Error('Nenhum tipo de caractere selecionado');
    }
    
    // Gerar senha
    let password = '';
    
    // Adicionar caracteres obrigatórios primeiro
    for (let char of requiredChars) {
        password += char;
    }
    
    // Preencher o resto aleatoriamente
    for (let i = password.length; i < length; i++) {
        password += getRandomChar(availableChars);
    }
    
    // Embaralhar a senha para randomizar posições
    return shuffleString(password);
}

function getRandomChar(chars) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars[randomIndex];
}

function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function displayGeneratedPassword(password) {
    const resultCard = document.getElementById('password-result-card');
    const passwordDisplay = document.getElementById('password-display');
    const strengthIndicator = document.getElementById('password-strength');
    
    if (!resultCard || !passwordDisplay || !strengthIndicator) {
        console.error('Elementos de resultado não encontrados');
        return;
    }
    
    // Exibir senha
    passwordDisplay.textContent = password;
    
    // Calcular força da senha
    const strength = calculatePasswordStrength(password);
    strengthIndicator.textContent = `Força: ${strength.label}`;
    strengthIndicator.className = `password-strength ${strength.class}`;
    
    // Mostrar resultado
    hidePasswordError();
    resultCard.classList.remove('hidden');
    
    // Animação de entrada
    setTimeout(() => {
        resultCard.style.animation = 'slideInUp 0.5s ease-out';
    }, 50);
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Critérios de força
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (password.length >= 16) score += 1;
    
    // Determinar força
    if (score <= 3) {
        return { label: 'Fraca', class: 'strength-weak' };
    } else if (score <= 5) {
        return { label: 'Média', class: 'strength-medium' };
    } else {
        return { label: 'Forte', class: 'strength-strong' };
    }
}

function copyPassword() {
    const passwordDisplay = document.getElementById('password-display');
    const copyBtn = document.getElementById('copy-btn');
    const copyText = copyBtn.querySelector('.copy-text');
    
    if (!passwordDisplay || !copyBtn) return;
    
    const password = passwordDisplay.textContent;
    
    // Usar API moderna de clipboard se disponível
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(password).then(() => {
            showCopySuccess(copyBtn, copyText);
        }).catch(() => {
            fallbackCopyToClipboard(password, copyBtn, copyText);
        });
    } else {
        fallbackCopyToClipboard(password, copyBtn, copyText);
    }
}

function fallbackCopyToClipboard(text, btn, btnText) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(btn, btnText);
    } catch (err) {
        console.error('Erro ao copiar:', err);
        btnText.textContent = 'Erro';
        setTimeout(() => {
            btnText.textContent = 'Copiar';
        }, 2000);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess(btn, btnText) {
    btn.classList.add('copied');
    btnText.textContent = 'Copiado!';
    
    setTimeout(() => {
        btn.classList.remove('copied');
        btnText.textContent = 'Copiar';
    }, 2000);
}

function displayPasswordError(errorMessage) {
    const errorCard = document.getElementById('password-error-card');
    const errorMessageElement = document.getElementById('password-error-message');
    
    if (!errorCard || !errorMessageElement) {
        console.error('Elementos de erro não encontrados');
        return;
    }
    
    errorMessageElement.textContent = errorMessage;
    
    // Mostrar erro
    hidePasswordResults();
    errorCard.classList.remove('hidden');
}

function hidePasswordResults() {
    const resultCard = document.getElementById('password-result-card');
    if (resultCard) {
        resultCard.classList.add('hidden');
    }
}

function hidePasswordError() {
    const errorCard = document.getElementById('password-error-card');
    if (errorCard) {
        errorCard.classList.add('hidden');
    }
}

function clearPasswordError() {
    hidePasswordError();
}

function validatePasswordLength(event) {
    const value = parseInt(event.target.value);
    
    if (value < 4) {
        event.target.value = 4;
    } else if (value > 128) {
        event.target.value = 128;
    }
}

function setPasswordLength(length) {
    const lengthInput = document.getElementById('password-length');
    if (lengthInput) {
        lengthInput.value = length;
    }
    
    // Atualizar botões ativos
    const lengthBtns = document.querySelectorAll('.length-btn');
    lengthBtns.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === length) {
            btn.classList.add('active');
        }
    });
}

// ===== FUNÇÕES GLOBAIS AUXILIARES ===== //
window.clearError = clearError;
window.clearPasswordError = clearPasswordError;
window.copyPassword = copyPassword;
window.setPasswordLength = setPasswordLength;

// ===== TRATAMENTO DE ERROS GLOBAIS ===== //
window.addEventListener('unhandledrejection', function(event) {
    console.error('Erro não tratado:', event.reason);
    
    // Verificar qual página está ativa para mostrar erro apropriado
    if (window.location.pathname.includes('gerador.html')) {
        displayPasswordError('Ocorreu um erro inesperado. Tente novamente.');
    } else {
        displayConversionError('Ocorreu um erro inesperado. Tente novamente.');
        setLoadingState(false);
    }
});

window.addEventListener('error', function(event) {
    console.error('Erro JavaScript:', event.error);
});

// ===== INICIALIZAÇÃO FINAL ===== //
console.log('Todos os sistemas avançados carregados com sucesso!');