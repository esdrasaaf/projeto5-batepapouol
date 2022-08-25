//Nome do usuário (falta deixar bonito como no bonus)
let nomeDoUsuario = {
    name: prompt("Digite seu nome!")
}

//Entrar na sala
function enviarNome () {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeDoUsuario)
    promise.then(manterConexao)
    promise.catch(deuErro)
}
enviarNome()

//Manter a conexão com a sala
function manterConexao () {
    setInterval (() => {
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeDoUsuario)
    }, 5000)
    
    pegarMensagem()
}

//Pegar todas as 100 mensagens que estão rolando no bate-papo
function pegarMensagem () {
    const promise = axios.get ("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(renderizarMensagem)
    promise.catch(deuErro)
}

//Renderiza as mensagens do servidor (que foram enviadas até o momento da execução dessa função, arrumar dps!!) no HTML que eu criei
function renderizarMensagem(response){
    const arrayMensagens = response.data
    const batepapo = document.querySelector('.bate-papo')

    for (let i = 0; i < arrayMensagens.length; i++) {
        let mensagem = arrayMensagens[i] 
        
        const divMensagem = document.createElement ('div');
        divMensagem.classList.add(mensagem.type)

        divMensagem.innerHTML = `<span class="horario">(${mensagem.time})</span> 
        <span class="remetente">${mensagem.from}</span> para 
        <span class="destinatario">${mensagem.to}</span> : ${mensagem.text}`

        batepapo.appendChild(divMensagem)
    }
}

//Adicionar o que eu escrevo nas mensagens que estão no servidor
function adicionarMensagem (){
    let data = new Date();
    let horas = data.getHours();
    let minutos = data.getMinutes();
    let segundos = data.getSeconds();
    let horario = horas + ":" + minutos + ":" + segundos
    const conteudo = document.querySelector('.chat').value
    const remetente = nomeDoUsuario.name
    const destinatario = 'Todos'  // falta colocar direitinho

    let mensagem = {
        from: remetente,
        to: destinatario,
        text: conteudo,
        type: "message", //ainda vou colocar direitinho
        time: horario
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem)
    promise.then(renderizarMensagem)
}   

function deuErro(erro){
    console.log(erro)

    if (erro.response.status === 400){
        alert(`Nome de usuário já está em uso! Escolha outro nickname ou certifique-se de que você não está logado.
(Lembre-se, você só pode usar o chat se tiver um nickname!)`)

        location.reload()
    }
}

document.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const btn = document.querySelector("#send")
        btn.click()   
    }
})