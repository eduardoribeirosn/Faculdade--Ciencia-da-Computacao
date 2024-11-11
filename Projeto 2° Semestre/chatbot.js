let chatOpen = false;  // Para controlar se o chat está aberto ou minimizado
// Variáveis para capturar informações do orçamento
let currentContext = '';
let budgetDetails = {
    name: '',
    email: '',
    value: '',
    additionalInfo: ''
};

// Lista de serviços e seus preços
const services = [
    { name: "Pintura de carro", price: "R$ 300,00" },
    { name: "Alinhamento e balanceamento", price: "R$ 150,00" },
    { name: "Reparo de funilaria", price: "R$ 400,00" },
    { name: "Troca de peças", price: "R$ 250,00" }
];

// Função para abrir/fechar o chatbot
function toggleChat() {
    const chat = document.getElementById('chatbot');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    if (chatOpen) {
        chat.style.display = 'none';  // Fecha o chat
        chatToggleBtn.style.display = 'block';  // Mostra o botão de abrir
        chatOpen = false;
    } else {
        chat.style.display = 'flex';  // Abre o chat
        chatToggleBtn.style.display = 'none';  // Esconde o botão de abrir
        chatOpen = true;

        // Envia a mensagem inicial com as opções
        sendInitialMessage();
    }
}

// Função para minimizar o chat
function minimizeChat() {
    const chat = document.getElementById('chatbot');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    chat.style.display = 'none';  // Minimiza o chat
    chatToggleBtn.style.display = 'block';  // Mostra o botão de abrir
    chatOpen = false;
}

// Função para enviar a mensagem inicial com as opções
function sendInitialMessage() {
    const chatMessages = document.getElementById('chat-messages');
    const botMessage = document.createElement('div');
    botMessage.style.color = 'gold';
    botMessage.innerHTML = `Chatbot: Olá, seja bem-vindo à Funilaria do Acácio! É um prazer ter você aqui em nosso site :D<br><br>
    O que você deseja?<br>
    1 - Fazer orçamento<br>
    2 - Solicitar um serviço<br>
    3 - Entrar em contato`;
    chatMessages.appendChild(botMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para enviar a mensagem do usuário e lidar com a resposta do chatbot
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value;
    if (message.trim() !== '') {
        // Adiciona a mensagem do usuário ao chat
        const chatMessages = document.getElementById('chat-messages');
        const userMessage = document.createElement('div');
        userMessage.textContent = `Você: ${message}`;
        chatMessages.appendChild(userMessage);
        userInput.value = '';  // Limpa o campo de entrada

        // Resposta do chatbot com base na opção escolhida
        const botMessage = document.createElement('div');
        botMessage.style.color = 'gold';

        // Verifica se o chat deve reiniciar, limpa o contexto e dados
        if (message.toLowerCase() === 'reiniciar') {
            currentContext = ''; // Reseta o contexto
            budgetDetails = { name: '', email: '', value: '', additionalInfo: '' }; // Limpa os dados do orçamento
            botMessage.innerHTML = 'Chatbot: O chat foi reiniciado. Por favor, escolha uma das opções novamente.';
        } else if (currentContext === '') {
            if (message === '1') {
                currentContext = 'orçamento';
                botMessage.innerHTML = 'Chatbot: Por favor, qual é o seu nome?';
            } else if (message === '2') {
                currentContext = 'servicos';
                let servicesList = 'Chatbot: Aqui estão nossos serviços:<br>';
                services.forEach(service => {
                    servicesList += `- ${service.name}: ${service.price}<br>`;
                });
                servicesList += 'Digite "voltar" para voltar ao menu principal.';
                botMessage.innerHTML = servicesList;
            } else if (message === '3') {
                currentContext = 'contato';
                botMessage.innerHTML = `Chatbot: Para entrar em contato, escolha uma das opções abaixo:<br>
                1 - Falar pelo WhatsApp<br>
                2 - Preencher o formulário de contato`;
            } else {
                botMessage.innerHTML = 'Chatbot: Desculpe, não entendi sua solicitação. Por favor, escolha uma das opções disponíveis.';
            }
        } else if (currentContext === 'orçamento') {
            if (!budgetDetails.name) {
                budgetDetails.name = message;
                botMessage.innerHTML = 'Chatbot: Agora, por favor, digite o seu e-mail:';
            } else if (!budgetDetails.email) {
                budgetDetails.email = message;
                botMessage.innerHTML = 'Chatbot: Qual é o valor que você deseja investir?';
            } else if (!budgetDetails.value) {
                // Verifica se o valor digitado é um número decimal válido
                const valueRegex = /^[0-9]+(\.[0-9]{1,2})?$/;  // Regex para número decimal
                if (valueRegex.test(message)) {
                    budgetDetails.value = message;
                    botMessage.innerHTML = 'Chatbot: Por favor, forneça mais informações sobre onde deseja aplicar o serviço, incluindo o tamanho e outros detalhes:';
                } else {
                    botMessage.innerHTML = 'Chatbot: Por favor, digite um valor numérico válido (ex: 150,00 ou 150).';
                }
            } else if (!budgetDetails.additionalInfo) {
                budgetDetails.additionalInfo = message;

                // Preenche o formulário com as informações coletadas
                const formulario = document.getElementById('for');
                if (formulario) {
                    formulario.querySelector('input[name="nome"]').value = budgetDetails.name;
                    formulario.querySelector('input[name="email"]').value = budgetDetails.email;
                    formulario.querySelector('textarea[name="mensagem"]').value =
                        `Orçamento para serviço:\n\nNome: ${budgetDetails.name}\nE-mail: ${budgetDetails.email}\nValor desejado: ${budgetDetails.value}\nDetalhes: ${budgetDetails.additionalInfo}`;

                    botMessage.innerHTML = 'Chatbot: Suas informações foram preenchidas no formulário. Por favor, revise e envie.';
                    formulario.scrollIntoView({ behavior: 'smooth' });
                    formulario.focus();
                } else {
                    botMessage.innerHTML = 'Chatbot: Formulário não encontrado na página.';
                }

                // Limpa o contexto e os dados para um novo ciclo de interação
                currentContext = '';
                budgetDetails = { name: '', email: '', value: '', additionalInfo: '' };
            }
        } else if (currentContext === 'contato') {
            if (message === '1') {
                window.location.href = 'contato.html';  // Redireciona para a página de contato
            } else if (message === '2') {
                const formulario = document.getElementById('for');
                if (formulario) {
                    formulario.scrollIntoView({ behavior: 'smooth' });
                    formulario.focus();
                    botMessage.innerHTML = 'Chatbot: Focando no formulário de contato.';
                } else {
                    botMessage.innerHTML = 'Chatbot: Formulário não encontrado na página.';
                }
            } else {
                botMessage.innerHTML = 'Chatbot: Desculpe, não entendi sua solicitação. Por favor, escolha uma das opções disponíveis para contato.';
            }
        } else if (message.toLowerCase() === 'voltar' && currentContext === 'servicos') {
            currentContext = ''; // Volta ao menu principal
            botMessage.innerHTML = 'Chatbot: Você voltou ao menu principal. Escolha uma das opções abaixo:<br>1 - Orçamento<br>2 - Ver Serviços<br>3 - Contato';
        } else {
            botMessage.innerHTML = 'Chatbot: Desculpe, não entendi sua solicitação. Por favor, reinicie o chat ou selecione uma opção válida.';
        }

        chatMessages.appendChild(botMessage);

        // Rolagem automática com delay
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;  // Rola até a última mensagem
        }, 100); // Atraso de 100ms para garantir que a mensagem foi renderizada
    }
}




// Captura a tecla Enter para enviar a mensagem
document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
