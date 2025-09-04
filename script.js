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
    const isImcCalculator = currentPage.includes('imc.html') || document.getElementById('imc-form');
    const isWordCounter = currentPage.includes('contador.html') || document.getElementById('counter-form');
    const isLottery = currentPage.includes('sorteio.html') || document.getElementById('lottery-form');
    const isInss = currentPage.includes('inss.html') || document.getElementById('inss-form');
    const isIrpf = currentPage.includes('irpf.html') || document.getElementById('irpf-form');
    const isRuleOfThree = currentPage.includes('regra.html') || document.getElementById('rule-form');
    
    if (isPasswordGenerator && !isCurrencyConverter && !isImcCalculator && !isWordCounter && !isLottery && !isInss && !isIrpf && !isRuleOfThree) {
        console.log('Inicializando gerador de senhas...');
        setupPasswordGenerator();
    } else if (isCurrencyConverter && !isPasswordGenerator && !isImcCalculator && !isWordCounter && !isLottery && !isInss && !isIrpf && !isRuleOfThree) {
        console.log('Inicializando conversor de moedas...');
        setupFormHandlers();
        setupInputFormatting();
    } else if (isImcCalculator && !isCurrencyConverter && !isPasswordGenerator && !isWordCounter && !isLottery && !isInss && !isIrpf && !isRuleOfThree) {
        console.log('Inicializando calculadora de IMC...');
        setupImcCalculator();
    } else if (isWordCounter && !isCurrencyConverter && !isPasswordGenerator && !isImcCalculator && !isLottery && !isInss && !isIrpf && !isRuleOfThree) {
        console.log('Inicializando contador de palavras...');
        setupWordCounter();
    } else if (isLottery && !isCurrencyConverter && !isPasswordGenerator && !isImcCalculator && !isWordCounter && !isInss && !isIrpf && !isRuleOfThree) {
        console.log('Inicializando simulador de sorteios...');
        setupLottery();
    } else if (isInss && !isCurrencyConverter && !isPasswordGenerator && !isImcCalculator && !isWordCounter && !isLottery && !isIrpf && !isRuleOfThree) {
        console.log('Inicializando calculadora de INSS...');
        setupInssCalculator();
    } else if (isIrpf && !isCurrencyConverter && !isPasswordGenerator && !isImcCalculator && !isWordCounter && !isLottery && !isInss && !isRuleOfThree) {
        console.log('Inicializando calculadora de IRPF...');
        setupIrpfCalculator();
    } else if (isRuleOfThree && !isCurrencyConverter && !isPasswordGenerator && !isImcCalculator && !isWordCounter && !isLottery && !isInss && !isIrpf) {
        console.log('Inicializando calculadora de regra de três...');
        setupRuleOfThree();
    } else {
        console.log('Página não reconhecida ou elementos não encontrados');
    }
    
    // Adicionar classe loaded para animações CSS
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    console.log('Ferramentas premium inicializadas com tecnologias avançadas!');
    
    // Inicializar navegação mobile
    setupMobileNavigation();
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
        console.log('Buscando cotação para:', currency, 'URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(API_CONFIG.timeout)
        });
        
        console.log('Status da resposta:', response.status, response.statusText);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Moeda ${currency} não encontrada. Verifique o código da moeda.`);
            } else if (response.status >= 500) {
                throw new Error('Serviço temporariamente indisponível. Tente novamente em alguns minutos.');
            } else {
                throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        const currencyKey = `${currency}BRL`;
        
        if (!data[currencyKey]) {
            throw new Error(`Dados não encontrados para ${currency}. Verifique se a moeda está disponível.`);
        }
        
        const rateData = data[currencyKey];
        
        // Validar se os dados estão completos
        if (!rateData.bid || !rateData.ask) {
            throw new Error('Dados de cotação incompletos recebidos da API.');
        }
        
        return {
            bid: parseFloat(rateData.bid),
            ask: parseFloat(rateData.ask),
            timestamp: rateData.create_date,
            name: rateData.name
        };
        
    } catch (error) {
        console.error('Erro detalhado na busca de cotação:', error);
        
        if (error.name === 'AbortError') {
            throw new Error('Tempo limite excedido. Verifique sua conexão com a internet.');
        }
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Falha na conexão. Verifique sua internet e tente novamente.');
        }
        
        // Se já é uma mensagem personalizada, mantê-la
        if (error.message.includes('Moeda') || error.message.includes('Serviço') || error.message.includes('Dados')) {
            throw error;
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
        // Toggle menu com debounce otimizado
        let isToggling = false;
        
        // Função para abrir menu
        function openMenu() {
            mobileToggle.classList.add('active');
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Previne scroll
        }
        
        // Função para fechar menu
        function closeMenu() {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restaura scroll
        }
        
        // Toggle principal - clique no botão hamburger
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isToggling) return;
            isToggling = true;
            
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
            
            // Reset debounce reduzido para maior responsividade
            setTimeout(() => {
                isToggling = false;
            }, 150);
        });
        
        // Adicionar feedback visual no botão
        mobileToggle.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        mobileToggle.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        // Fechar menu ao clicar em link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        });
        
        // Fechar menu ao clicar fora dele
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }
        });
        
        // Fechar menu com tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Fechar menu ao redimensionar a tela
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
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

// ===== CALCULADORA DE IMC ===== //
function setupImcCalculator() {
    const imcForm = document.getElementById('imc-form');
    
    if (imcForm) {
        imcForm.addEventListener('submit', handleImcCalculation);
        
        // Setup input validation
        const weightInput = document.getElementById('weight');
        const heightInput = document.getElementById('height');
        
        if (weightInput) {
            weightInput.addEventListener('input', validateWeight);
        }
        if (heightInput) {
            heightInput.addEventListener('input', validateHeight);
        }
    }
}

function handleImcCalculation(event) {
    event.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    // Validação
    if (!validateImcInputs(weight, height)) {
        return;
    }
    
    // Calcular IMC
    try {
        const imc = calculateImc(weight, height);
        const classification = getImcClassification(imc);
        
        displayImcResult({
            imc: imc,
            classification: classification,
            weight: weight,
            height: height
        });
        
    } catch (error) {
        console.error('Erro no cálculo:', error);
        displayImcError(error.message);
    }
}

function validateImcInputs(weight, height) {
    let isValid = true;
    
    // Validar peso
    if (!weight || weight <= 0 || weight > 500) {
        showFieldError('weight', 'Digite um peso válido entre 1 e 500 kg');
        isValid = false;
    }
    
    // Validar altura
    if (!height || height <= 0 || height > 3) {
        showFieldError('height', 'Digite uma altura válida entre 0.5 e 3.0 metros');
        isValid = false;
    }
    
    return isValid;
}

function validateWeight(event) {
    const value = parseFloat(event.target.value);
    
    if (value && (value <= 0 || value > 500)) {
        showFieldError('weight', 'O peso deve estar entre 1 e 500 kg');
    } else {
        clearFieldError('weight');
    }
}

function validateHeight(event) {
    const value = parseFloat(event.target.value);
    
    if (value && (value <= 0 || value > 3)) {
        showFieldError('height', 'A altura deve estar entre 0.5 e 3.0 metros');
    } else {
        clearFieldError('height');
    }
}

function calculateImc(weight, height) {
    if (height <= 0) {
        throw new Error('Altura deve ser maior que zero');
    }
    
    const imc = weight / (height * height);
    return Math.round(imc * 100) / 100; // Arredondar para 2 casas decimais
}

function getImcClassification(imc) {
    if (imc < 18.5) {
        return {
            category: 'Abaixo do peso',
            class: 'abaixo-peso',
            description: 'Você está abaixo do peso ideal. Consulte um profissional de saúde.',
            range: 'Abaixo de 18,5'
        };
    } else if (imc >= 18.5 && imc <= 24.9) {
        return {
            category: 'Peso normal',
            class: 'peso-normal',
            description: 'Parabéns! Você está dentro do peso ideal.',
            range: '18,5 - 24,9'
        };
    } else if (imc >= 25.0 && imc <= 29.9) {
        return {
            category: 'Sobrepeso',
            class: 'sobrepeso',
            description: 'Você está com sobrepeso. Considere uma alimentação mais equilibrada.',
            range: '25,0 - 29,9'
        };
    } else if (imc >= 30.0 && imc <= 34.9) {
        return {
            category: 'Obesidade grau 1',
            class: 'obesidade-1',
            description: 'Obesidade grau 1. Procure orientação médica.',
            range: '30,0 - 34,9'
        };
    } else if (imc >= 35.0 && imc <= 39.9) {
        return {
            category: 'Obesidade grau 2',
            class: 'obesidade-2',
            description: 'Obesidade grau 2. É importante buscar acompanhamento médico.',
            range: '35,0 - 39,9'
        };
    } else {
        return {
            category: 'Obesidade grau 3',
            class: 'obesidade-3',
            description: 'Obesidade grau 3. Procure acompanhamento médico especializado urgentemente.',
            range: 'Acima de 40'
        };
    }
}

function displayImcResult(result) {
    const resultCard = document.getElementById('result-card');
    const resultValue = document.getElementById('result-value');
    const imcClassification = document.getElementById('imc-classification');
    const imcDescription = document.getElementById('imc-description');
    
    if (!resultCard || !resultValue || !imcClassification || !imcDescription) {
        console.error('Elementos de resultado não encontrados');
        return;
    }
    
    // Preencher conteúdo
    resultValue.innerHTML = `
        <div style="font-size: 1.2rem; color: var(--cinza-texto); margin-bottom: 0.5rem;">
            Seu IMC é:
        </div>
        <div style="font-size: 2.5rem; color: var(--dourado); font-weight: 700;">
            ${result.imc}
        </div>
    `;
    
    imcClassification.textContent = result.classification.category;
    imcClassification.className = `imc-classification ${result.classification.class}`;
    
    imcDescription.textContent = result.classification.description;
    
    // Destacar a classificação na tabela
    highlightClassificationInTable(result.classification.class);
    
    // Mostrar resultado
    hideError();
    resultCard.classList.remove('hidden');
    
    // Animação de entrada
    setTimeout(() => {
        resultCard.style.animation = 'slideInUp 0.5s ease-out';
    }, 50);
}

function highlightClassificationInTable(classificationClass) {
    // Remover destaque anterior
    const allItems = document.querySelectorAll('.classification-item');
    allItems.forEach(item => {
        item.classList.remove('highlight');
    });
    
    // Adicionar destaque ao item correspondente
    const targetItem = document.querySelector(`.classification-item .${classificationClass}`);
    if (targetItem) {
        targetItem.closest('.classification-item').classList.add('highlight');
    }
}

function displayImcError(errorMessage) {
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

// ===== CONTADOR DE PALAVRAS ===== //
function setupWordCounter() {
    const counterForm = document.getElementById('counter-form');
    
    if (counterForm) {
        counterForm.addEventListener('submit', handleWordCount);
        
        // Setup text input validation
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.addEventListener('input', validateTextInput);
        }
    }
}

function handleWordCount(event) {
    event.preventDefault();
    
    const textInput = document.getElementById('text-input');
    const text = textInput.value;
    
    // Validação
    if (!validateCounterInputs(text)) {
        return;
    }
    
    // Contar palavras e caracteres
    try {
        const counts = countWordsAndCharacters(text);
        
        displayCounterResults(counts);
        
    } catch (error) {
        console.error('Erro na contagem:', error);
        displayCounterError(error.message);
    }
}

function validateCounterInputs(text) {
    // Verificar se há texto
    if (!text || text.trim().length === 0) {
        showFieldError('text-input', 'Digite ou cole algum texto para contar');
        return false;
    }
    
    return true;
}

function validateTextInput(event) {
    const value = event.target.value;
    
    if (!value || value.trim().length === 0) {
        // Não mostrar erro enquanto o usuário está digitando
        clearFieldError('text-input');
    } else {
        clearFieldError('text-input');
    }
}

function countWordsAndCharacters(text) {
    // Contar palavras (separadas por espaços)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Contar caracteres com espaços
    const charCountWithSpaces = text.length;
    
    // Contar caracteres sem espaços
    const charCountWithoutSpaces = text.replace(/\s/g, '').length;
    
    return {
        words: wordCount,
        charactersWithSpaces: charCountWithSpaces,
        charactersWithoutSpaces: charCountWithoutSpaces,
        originalText: text
    };
}

function displayCounterResults(counts) {
    const resultCard = document.getElementById('result-card');
    const wordCountElement = document.getElementById('word-count');
    const charCountWithSpacesElement = document.getElementById('char-count-with-spaces');
    const charCountWithoutSpacesElement = document.getElementById('char-count-without-spaces');
    
    if (!resultCard || !wordCountElement || !charCountWithSpacesElement || !charCountWithoutSpacesElement) {
        console.error('Elementos de resultado não encontrados');
        return;
    }
    
    // Preencher valores
    wordCountElement.textContent = counts.words.toLocaleString('pt-BR');
    charCountWithSpacesElement.textContent = counts.charactersWithSpaces.toLocaleString('pt-BR');
    charCountWithoutSpacesElement.textContent = counts.charactersWithoutSpaces.toLocaleString('pt-BR');
    
    // Mostrar resultado
    hideError();
    resultCard.classList.remove('hidden');
    
    // Animação de entrada
    setTimeout(() => {
        resultCard.style.animation = 'slideInUp 0.5s ease-out';
    }, 50);
}

function displayCounterError(errorMessage) {
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

// ===== SIMULADOR DE SORTEIOS ===== //
let currentLotteryItems = []; // Armazenar itens atuais para repetir sorteio

function setupLottery() {
    const lotteryForm = document.getElementById('lottery-form');
    
    if (lotteryForm) {
        lotteryForm.addEventListener('submit', handleLottery);
        
        // Setup items input validation
        const itemsInput = document.getElementById('items-input');
        if (itemsInput) {
            itemsInput.addEventListener('input', validateItemsInput);
        }
    }
}

function handleLottery(event) {
    event.preventDefault();
    
    const itemsInput = document.getElementById('items-input');
    const itemsText = itemsInput.value;
    
    // Processar e validar itens
    const items = parseItems(itemsText);
    
    if (!validateLotteryInputs(items)) {
        return;
    }
    
    // Armazenar itens para repetir sorteio
    currentLotteryItems = items;
    
    // Realizar sorteio
    try {
        const winner = performLottery(items);
        
        displayLotteryResult({
            winner: winner,
            totalItems: items.length,
            items: items
        });
        
    } catch (error) {
        console.error('Erro no sorteio:', error);
        displayLotteryError(error.message);
    }
}

function parseItems(itemsText) {
    if (!itemsText || itemsText.trim().length === 0) {
        return [];
    }
    
    let items = [];
    
    // Verificar se contém vírgulas (separação por vírgula)
    if (itemsText.includes(',')) {
        items = itemsText.split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
    } else {
        // Separação por linha
        items = itemsText.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }
    
    // Remover duplicatas mantendo apenas a primeira ocorrência
    const uniqueItems = [];
    const seen = new Set();
    
    for (const item of items) {
        const lowerItem = item.toLowerCase();
        if (!seen.has(lowerItem)) {
            seen.add(lowerItem);
            uniqueItems.push(item);
        }
    }
    
    return uniqueItems;
}

function validateLotteryInputs(items) {
    // Verificar se há pelo menos 2 itens
    if (items.length < 2) {
        showFieldError('items-input', 'Digite pelo menos 2 itens para realizar o sorteio');
        return false;
    }
    
    // Verificar limite máximo (opcional, para performance)
    if (items.length > 1000) {
        showFieldError('items-input', 'Máximo de 1000 itens permitidos');
        return false;
    }
    
    return true;
}

function validateItemsInput(event) {
    const value = event.target.value;
    const items = parseItems(value);
    
    if (value && items.length < 2) {
        // Não mostrar erro enquanto o usuário está digitando
        clearFieldError('items-input');
    } else {
        clearFieldError('items-input');
    }
}

function performLottery(items) {
    if (items.length === 0) {
        throw new Error('Nenhum item disponível para sorteio');
    }
    
    // Gerar índice aleatório
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function displayLotteryResult(result) {
    const resultCard = document.getElementById('result-card');
    const winnerDisplay = document.getElementById('winner-display');
    const participantsInfo = document.getElementById('participants-info');
    
    if (!resultCard || !winnerDisplay || !participantsInfo) {
        console.error('Elementos de resultado não encontrados');
        return;
    }
    
    // Exibir vencedor
    winnerDisplay.textContent = result.winner;
    
    // Mostrar informações dos participantes
    participantsInfo.innerHTML = `
        <i class="fas fa-users"></i>
        <strong>${result.totalItems}</strong> ${result.totalItems === 1 ? 'item participou' : 'itens participaram'} do sorteio
    `;
    
    // Mostrar resultado
    hideError();
    resultCard.classList.remove('hidden');
    
    // Resetar animação
    winnerDisplay.style.animation = 'none';
    setTimeout(() => {
        winnerDisplay.style.animation = 'winnerReveal 0.8s ease-out';
    }, 50);
}

function repeatLottery() {
    if (currentLotteryItems.length === 0) {
        displayLotteryError('Nenhum sorteio anterior encontrado. Digite os itens primeiro.');
        return;
    }
    
    try {
        const winner = performLottery(currentLotteryItems);
        
        displayLotteryResult({
            winner: winner,
            totalItems: currentLotteryItems.length,
            items: currentLotteryItems
        });
        
    } catch (error) {
        console.error('Erro ao repetir sorteio:', error);
        displayLotteryError(error.message);
    }
}

function displayLotteryError(errorMessage) {
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

// ===== CALCULADORA DE INSS ===== //
function setupInssCalculator() {
    const inssForm = document.getElementById('inss-form');
    const salaryInput = document.getElementById('salary-input');
    
    if (inssForm) {
        inssForm.addEventListener('submit', handleInssCalculation);
        
        // Setup salary input formatting
        if (salaryInput) {
            salaryInput.addEventListener('input', formatSalaryInput);
            salaryInput.addEventListener('blur', validateSalaryInput);
        }
    }
}

function formatSalaryInput(event) {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = formatCurrency(value);
    event.target.value = formattedValue;
}

function validateSalaryInput(event) {
    const value = event.target.value.replace(/\D/g, '');
    
    if (!value || parseFloat(value) <= 0) {
        showFieldError('salary-input', 'Digite um salário válido');
    } else {
        clearFieldError('salary-input');
    }
}

function handleInssCalculation(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const age = parseInt(document.getElementById('age-input').value);
    const contributionYears = parseFloat(document.getElementById('contribution-input').value);
    const salaryText = document.getElementById('salary-input').value.replace(/\D/g, '');
    const salary = parseFloat(salaryText) / 100; // Converter centavos para reais
    
    // Validar entradas
    if (!validateInssInputs(gender, age, contributionYears, salary)) {
        return;
    }
    
    try {
        // Calcular aposentadoria
        const calculation = calculateRetirement({
            gender,
            age,
            contributionYears,
            salary
        });
        
        displayInssResults(calculation);
        
    } catch (error) {
        console.error('Erro no cálculo de INSS:', error);
        displayInssError(error.message);
    }
}

function validateInssInputs(gender, age, contributionYears, salary) {
    let hasError = false;
    
    // Validar gênero
    if (!gender) {
        // Scroll para o topo do formulário onde estão os radio buttons
        document.querySelector('.gender-options').scrollIntoView({ behavior: 'smooth' });
        displayInssError('Selecione o sexo para calcular o tempo de contribuição necessário');
        return false;
    }
    
    // Validar idade
    if (!age || age < 16 || age > 100) {
        showFieldError('age-input', 'Digite uma idade válida entre 16 e 100 anos');
        hasError = true;
    }
    
    // Validar tempo de contribuição
    if (contributionYears < 0 || contributionYears > 60) {
        showFieldError('contribution-input', 'Digite um tempo de contribuição válido (0-60 anos)');
        hasError = true;
    }
    
    // Validar se tempo de contribuição não é maior que a idade possível
    if (contributionYears > (age - 14)) {
        showFieldError('contribution-input', 'Tempo de contribuição não pode ser maior que ' + (age - 14) + ' anos');
        hasError = true;
    }
    
    // Validar salário
    if (!salary || salary <= 0) {
        showFieldError('salary-input', 'Digite um salário válido');
        hasError = true;
    }
    
    return !hasError;
}

function calculateRetirement(data) {
    const { gender, age, contributionYears, salary } = data;
    
    // Determinar tempo necessário para aposentadoria por sexo
    const requiredYears = gender === 'male' ? 35 : 30;
    const timeRemaining = Math.max(0, requiredYears - contributionYears);
    
    // Calcular percentual do benefício
    // 60% base + 2% por cada ano adicional acima de 20 anos
    const basePercentage = 60;
    const additionalYears = Math.max(0, contributionYears - 20);
    const additionalPercentage = additionalYears * 2;
    const totalPercentage = Math.min(100, basePercentage + additionalPercentage);
    
    // Calcular valor do benefício
    const benefitValue = (salary * totalPercentage) / 100;
    
    // Determinar status da aposentadoria
    const canRetire = contributionYears >= requiredYears;
    const ageWhenEligible = canRetire ? age : age + timeRemaining;
    
    return {
        canRetire,
        timeRemaining,
        requiredYears,
        contributionYears,
        benefitValue,
        totalPercentage,
        salary,
        gender,
        age,
        ageWhenEligible,
        additionalYears: Math.max(0, additionalYears)
    };
}

function displayInssResults(calculation) {
    const resultCard = document.getElementById('result-card');
    const statusResult = document.getElementById('status-result');
    const timeRemaining = document.getElementById('time-remaining');
    const benefitValue = document.getElementById('benefit-value');
    const benefitPercentage = document.getElementById('benefit-percentage');
    const calculationDetails = document.getElementById('calculation-details');
    
    if (!resultCard || !statusResult || !timeRemaining || !benefitValue || !benefitPercentage || !calculationDetails) {
        console.error('Elementos de resultado não encontrados');
        return;
    }
    
    // Exibir status
    if (calculation.canRetire) {
        statusResult.innerHTML = `
            <div class="status-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="status-title">Parabéns!</div>
            <div class="status-message">Você já pode se aposentar por tempo de contribuição!</div>
        `;
        timeRemaining.textContent = 'Já pode se aposentar';
    } else {
        const years = Math.floor(calculation.timeRemaining);
        const months = Math.round((calculation.timeRemaining - years) * 12);
        let timeText = '';
        
        if (years > 0) {
            timeText += `${years} ${years === 1 ? 'ano' : 'anos'}`;
        }
        if (months > 0) {
            if (years > 0) timeText += ' e ';
            timeText += `${months} ${months === 1 ? 'mês' : 'meses'}`;
        }
        
        statusResult.innerHTML = `
            <div class="status-icon">
                <i class="fas fa-hourglass-half"></i>
            </div>
            <div class="status-title">Faltam ${timeText}</div>
            <div class="status-message">Continue contribuindo para garantir sua aposentadoria aos ${calculation.ageWhenEligible} anos</div>
        `;
        timeRemaining.textContent = timeText;
    }
    
    // Exibir valores
    benefitValue.textContent = formatCurrency((calculation.benefitValue * 100).toString());
    benefitPercentage.textContent = `${calculation.totalPercentage.toFixed(1)}%`;
    
    // Exibir detalhes do cálculo
    calculationDetails.innerHTML = `
        <h4><i class="fas fa-calculator"></i> Detalhes do Cálculo</h4>
        <div class="detail-item">
            <span class="detail-label">Sexo:</span>
            <span class="detail-value">${calculation.gender === 'male' ? 'Masculino' : 'Feminino'}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Tempo necessário:</span>
            <span class="detail-value">${calculation.requiredYears} anos</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Tempo atual de contribuição:</span>
            <span class="detail-value">${calculation.contributionYears} anos</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Percentual base (60%):</span>
            <span class="detail-value">R$ ${formatCurrency(((calculation.salary * 60) / 100 * 100).toString())}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Anos adicionais acima de 20:</span>
            <span class="detail-value">${calculation.additionalYears} anos</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Percentual adicional (${calculation.additionalYears * 2}%):</span>
            <span class="detail-value">R$ ${formatCurrency(((calculation.salary * calculation.additionalYears * 2) / 100 * 100).toString())}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Total do benefício:</span>
            <span class="detail-value">R$ ${formatCurrency((calculation.benefitValue * 100).toString())}</span>
        </div>
    `;
    
    // Mostrar resultado
    hideError();
    resultCard.classList.remove('hidden');
}

function displayInssError(errorMessage) {
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

// ===== CALCULADORA DE IRPF ===== //
function setupIrpfCalculator() {
    const irpfForm = document.getElementById('irpf-form');
    const salaryInput = document.getElementById('salary-input');
    const deductionsInput = document.getElementById('deductions-input');
    
    if (irpfForm) {
        irpfForm.addEventListener('submit', handleIrpfCalculation);
        
        // Setup input formatting
        if (salaryInput) {
            salaryInput.addEventListener('input', formatSalaryInput);
            salaryInput.addEventListener('blur', validateSalaryInput);
        }
        
        if (deductionsInput) {
            deductionsInput.addEventListener('input', formatSalaryInput);
            deductionsInput.addEventListener('blur', validateDeductionsInput);
        }
    }
}

function validateDeductionsInput(event) {
    const value = event.target.value.replace(/\D/g, '');
    
    if (value && parseFloat(value) < 0) {
        showFieldError('deductions-input', 'Valor de deduções não pode ser negativo');
    } else {
        clearFieldError('deductions-input');
    }
}

function handleIrpfCalculation(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const salaryText = document.getElementById('salary-input').value.replace(/\D/g, '');
    const salary = parseFloat(salaryText) / 100; // Converter centavos para reais
    const dependents = parseInt(document.getElementById('dependents-input').value) || 0;
    const deductionsText = document.getElementById('deductions-input').value.replace(/\D/g, '');
    const deductions = parseFloat(deductionsText) / 100; // Converter centavos para reais
    
    // Validar entradas
    if (!validateIrpfInputs(salary, dependents, deductions)) {
        return;
    }
    
    try {
        // Calcular IRPF
        const calculation = calculateIrpf({
            salary,
            dependents,
            deductions
        });
        
        displayIrpfResults(calculation);
        
    } catch (error) {
        console.error('Erro no cálculo de IRPF:', error);
        displayIrpfError(error.message);
    }
}

function validateIrpfInputs(salary, dependents, deductions) {
    let hasError = false;
    
    // Validar salário
    if (!salary || salary <= 0) {
        showFieldError('salary-input', 'Digite um salário válido');
        hasError = true;
    }
    
    // Validar dependentes
    if (dependents < 0 || dependents > 20) {
        showFieldError('dependents-input', 'Número de dependentes deve estar entre 0 e 20');
        hasError = true;
    }
    
    // Validar deduções
    if (deductions < 0) {
        showFieldError('deductions-input', 'Valor de deduções não pode ser negativo');
        hasError = true;
    }
    
    return !hasError;
}

function calculateIrpf(data) {
    const { salary, dependents, deductions } = data;
    
    // Constantes
    const MONTHLY_DEPENDENT_DEDUCTION = 189.59;
    const ANNUAL_DEPENDENT_DEDUCTION = MONTHLY_DEPENDENT_DEDUCTION * 12;
    
    // Tabela progressiva do IRPF (valores mensais)
    const TAX_BRACKETS = [
        { min: 0, max: 2112.00, rate: 0, deduction: 0 },
        { min: 2112.01, max: 2826.65, rate: 0.075, deduction: 158.40 },
        { min: 2826.66, max: 3751.05, rate: 0.15, deduction: 370.40 },
        { min: 3751.06, max: 4664.68, rate: 0.225, deduction: 651.73 },
        { min: 4664.69, max: Infinity, rate: 0.275, deduction: 884.96 }
    ];
    
    // Cálculos anuais
    const annualGrossIncome = salary * 12;
    const annualDependentDeduction = dependents * ANNUAL_DEPENDENT_DEDUCTION;
    const totalDeductions = deductions + annualDependentDeduction;
    const taxableIncome = Math.max(0, annualGrossIncome - totalDeductions);
    
    // Renda mensal para determinar faixa de tributação
    const monthlyTaxableIncome = taxableIncome / 12;
    
    // Encontrar faixa de tributação
    const bracket = TAX_BRACKETS.find(b => 
        monthlyTaxableIncome >= b.min && monthlyTaxableIncome <= b.max
    ) || TAX_BRACKETS[TAX_BRACKETS.length - 1];
    
    // Calcular imposto anual
    let annualTax = 0;
    if (bracket.rate > 0) {
        // Usar a fórmula: (Base de cálculo mensal × alíquota) - parcela a deduzir
        const monthlyTax = Math.max(0, (monthlyTaxableIncome * bracket.rate) - bracket.deduction);
        annualTax = monthlyTax * 12;
    }
    
    // Determinar status
    let status = '';
    let statusIcon = '';
    let statusMessage = '';
    
    if (bracket.rate === 0) {
        status = 'Isento';
        statusIcon = 'fas fa-check-circle';
        statusMessage = 'Você está na faixa de isenção do Imposto de Renda';
    } else if (annualTax > 0) {
        status = 'Tributável';
        statusIcon = 'fas fa-file-invoice-dollar';
        statusMessage = `Você deve pagar imposto de renda na alíquota de ${(bracket.rate * 100).toFixed(1)}%`;
    } else {
        status = 'Isento';
        statusIcon = 'fas fa-check-circle';
        statusMessage = 'Após as deduções, você está isento do Imposto de Renda';
    }
    
    return {
        salary,
        dependents,
        deductions,
        annualGrossIncome,
        totalDeductions,
        taxableIncome,
        monthlyTaxableIncome,
        bracket,
        annualTax,
        status,
        statusIcon,
        statusMessage,
        annualDependentDeduction
    };
}

function displayIrpfResults(calculation) {
    const resultCard = document.getElementById('result-card');
    const statusResult = document.getElementById('status-result');
    const annualGross = document.getElementById('annual-gross');
    const taxBase = document.getElementById('tax-base');
    const taxBracket = document.getElementById('tax-bracket');
    const taxAmount = document.getElementById('tax-amount');
    const calculationDetails = document.getElementById('calculation-details');
    
    if (!resultCard || !statusResult || !annualGross || !taxBase || !taxBracket || !taxAmount || !calculationDetails) {
        console.error('Elementos de resultado não encontrados');
        return;
    }
    
    // Função auxiliar para formatar moeda brasileira
    const formatBRL = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };
    
    // Exibir status
    statusResult.innerHTML = `
        <div class="status-icon">
            <i class="${calculation.statusIcon}"></i>
        </div>
        <div class="status-title">${calculation.status}</div>
        <div class="status-message">${calculation.statusMessage}</div>
    `;
    
    // Exibir valores
    annualGross.textContent = formatBRL(calculation.annualGrossIncome);
    taxBase.textContent = formatBRL(calculation.taxableIncome);
    
    // Faixa de tributação
    if (calculation.bracket.rate === 0) {
        taxBracket.textContent = 'Isento';
    } else {
        taxBracket.textContent = `${(calculation.bracket.rate * 100).toFixed(1)}%`;
    }
    
    // Valor do imposto
    taxAmount.textContent = calculation.annualTax > 0 ? 
        formatBRL(calculation.annualTax) : 
        'R$ 0,00';
    
    // Exibir detalhes do cálculo
    calculationDetails.innerHTML = `
        <h4><i class="fas fa-calculator"></i> Detalhes do Cálculo</h4>
        <div class="detail-item">
            <span class="detail-label">Salário bruto mensal:</span>
            <span class="detail-value">${formatBRL(calculation.salary)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Renda anual bruta:</span>
            <span class="detail-value">${formatBRL(calculation.annualGrossIncome)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Dependentes (${calculation.dependents}):</span>
            <span class="detail-value">${formatBRL(calculation.annualDependentDeduction)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Outras deduções:</span>
            <span class="detail-value">${formatBRL(calculation.deductions)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Total de deduções:</span>
            <span class="detail-value">${formatBRL(calculation.totalDeductions)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Base de cálculo anual:</span>
            <span class="detail-value">${formatBRL(calculation.taxableIncome)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Base de cálculo mensal:</span>
            <span class="detail-value">${formatBRL(calculation.monthlyTaxableIncome)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Imposto anual estimado:</span>
            <span class="detail-value">${formatBRL(calculation.annualTax)}</span>
        </div>
    `;
    
    // Mostrar resultado
    hideError();
    resultCard.classList.remove('hidden');
}

function displayIrpfError(errorMessage) {
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

// ===== NAVEGAÇÃO MOBILE ===== //
function setupMobileNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora dele
        document.addEventListener('click', function(event) {
            if (!mobileToggle.contains(event.target) && !navMenu.contains(event.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ===== CALCULADORA DE REGRA DE TRÊS ===== //
function setupRuleOfThree() {
    const form = document.getElementById('rule-form');
    const valueAInput = document.getElementById('value-a');
    const valueBInput = document.getElementById('value-b');
    const valueCInput = document.getElementById('value-c');
    
    if (!form || !valueAInput || !valueBInput || !valueCInput) {
        console.log('Calculadora de regra de três não encontrada nesta página');
        return;
    }
    
    console.log('Configurando manipuladores da calculadora de regra de três...');
    
    // Event listener para submissão do formulário
    form.addEventListener('submit', handleRuleCalculation);
    
    // Event listeners para validação em tempo real
    [valueAInput, valueBInput, valueCInput].forEach(input => {
        input.addEventListener('input', validateRuleInputs);
        input.addEventListener('focus', clearRuleError);
    });
}

function handleRuleCalculation(event) {
    event.preventDefault();
    
    const valueA = parseFloat(document.getElementById('value-a').value);
    const valueB = parseFloat(document.getElementById('value-b').value);
    const valueC = parseFloat(document.getElementById('value-c').value);
    
    // Validação
    if (!validateRuleValues(valueA, valueB, valueC)) {
        return;
    }
    
    // Calcular X = (B × C) ÷ A
    const result = calculateRuleOfThree(valueA, valueB, valueC);
    
    // Mostrar resultado
    displayRuleResult(result, valueA, valueB, valueC);
}

function validateRuleValues(valueA, valueB, valueC) {
    if (isNaN(valueA) || isNaN(valueB) || isNaN(valueC)) {
        displayRuleError('Por favor, preencha todos os campos com valores numéricos válidos.');
        return false;
    }
    
    if (valueA === 0) {
        displayRuleError('O Valor A não pode ser zero, pois causaria divisão por zero.');
        return false;
    }
    
    return true;
}

function calculateRuleOfThree(valueA, valueB, valueC) {
    return (valueB * valueC) / valueA;
}

function displayRuleResult(result, valueA, valueB, valueC) {
    const resultCard = document.getElementById('result-card');
    const resultValue = document.getElementById('result-value');
    const calculationExplanation = document.getElementById('calculation-explanation');
    
    if (!resultCard || !resultValue || !calculationExplanation) {
        console.error('Elementos de resultado não encontrados');
        return;
    }
    
    // Ocultar erro se existir
    hideRuleError();
    
    // Formatar resultado
    const formattedResult = formatNumber(result);
    
    // Atualizar valor do resultado
    resultValue.innerHTML = `
        <div class="result-number">X = ${formattedResult}</div>
    `;
    
    // Atualizar explicação do cálculo
    calculationExplanation.innerHTML = `
        <div class="calculation-steps">
            <h4><i class="fas fa-calculator"></i> Como chegamos neste resultado:</h4>
            <div class="calculation-formula">
                <p><strong>Fórmula aplicada:</strong> X = (B × C) ÷ A</p>
                <p><strong>Substituindo os valores:</strong></p>
                <p>X = (${formatNumber(valueB)} × ${formatNumber(valueC)}) ÷ ${formatNumber(valueA)}</p>
                <p>X = ${formatNumber(valueB * valueC)} ÷ ${formatNumber(valueA)}</p>
                <p><strong>X = ${formattedResult}</strong></p>
            </div>
            <div class="proportion-explanation">
                <p><i class="fas fa-info-circle"></i> <strong>Interpretação:</strong></p>
                <p>Se ${formatNumber(valueA)} está para ${formatNumber(valueB)}, então ${formatNumber(valueC)} está para ${formattedResult}</p>
            </div>
        </div>
    `;
    
    // Mostrar resultado
    resultCard.classList.remove('hidden');
}

function displayRuleError(errorMessage) {
    const errorCard = document.getElementById('error-card');
    const errorMessageElement = document.getElementById('error-message');
    
    if (!errorCard || !errorMessageElement) {
        console.error('Elementos de erro não encontrados');
        return;
    }
    
    errorMessageElement.textContent = errorMessage;
    
    // Mostrar erro
    hideRuleResults();
    errorCard.classList.remove('hidden');
}

function hideRuleResults() {
    const resultCard = document.getElementById('result-card');
    if (resultCard) {
        resultCard.classList.add('hidden');
    }
}

function hideRuleError() {
    const errorCard = document.getElementById('error-card');
    if (errorCard) {
        errorCard.classList.add('hidden');
    }
}

function clearRuleError() {
    hideRuleError();
}

function validateRuleInputs() {
    // Remove mensagens de erro ao digitar
    clearRuleError();
}

function formatNumber(number) {
    if (Number.isInteger(number)) {
        return number.toLocaleString('pt-BR');
    } else {
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        });
    }
}

// ===== FUNÇÕES GLOBAIS AUXILIARES ===== //
window.clearError = clearError;
window.clearPasswordError = clearPasswordError;
window.copyPassword = copyPassword;
window.setPasswordLength = setPasswordLength;
window.repeatLottery = repeatLottery;
window.clearRuleError = clearRuleError;

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