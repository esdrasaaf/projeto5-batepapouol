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

//Pega todos os usuários ativos no bate-papo
function buscarParticipantes () {
    const promise = axios.get ("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(criarListaDeUsuarios)
    promise.catch(deuErro)
}

//Coloca a lista de usuarios do meu HTML
function criarListaDeUsuarios (listaUsuarios){
    const ulUsuarios = document.querySelector(".participantes")
    let nomeDosUsuarios = listaUsuarios.data
 
     if ((ulUsuarios.childElementCount + nomeDosUsuarios.length) > nomeDosUsuarios.length) {
         ulUsuarios.innerHTML = ` <div class="usuarios" data-identifier="participant">
         <ion-icon name="people-sharp"></ion-icon>
         <span class="usuario" data-identifier="participant" >Todos</span>

         <div class="check">
             <ion-icon name="checkmark-sharp"></ion-icon>
         </div>
     </div>`
     }
 
     for (let i = 0; i < nomeDosUsuarios.length; i++) {
         const usuario = nomeDosUsuarios[i]
         const nomeDoUsuario = usuario.name
 
         const divUsuario = document.createElement ('div');
         divUsuario.classList.add("usuarios")
 
         divUsuario.innerHTML = `
         <ion-icon name="people-sharp"></ion-icon>
         <span class="usuario" data-identifier="participant">${nomeDoUsuario}</span>
 
         <div class="check">
             <ion-icon name="checkmark-sharp"></ion-icon>
         </div>`
 
         ulUsuarios.appendChild(divUsuario);
     }
}

//Renderiza as mensagens do servidor, atualizando de 3s em 3s
function renderizarMensagem (response){
    const arrayMensagens = response.data
    const batepapo = document.querySelector('.bate-papo')

    if (batepapo.childElementCount === 100) {
        batepapo.innerHTML = ''
    }

    for (let i = 0; i < arrayMensagens.length; i++) {
        let mensagem = arrayMensagens[i] 
        
        const divMensagem = document.createElement ('div');
        
        divMensagem.classList.add(mensagem.type)

        divMensagem.innerHTML = `<span class="horario">(${mensagem.time})</span> 
        <span class="remetente">${mensagem.from}</span> para 
        <span class="destinatario">${mensagem.to}</span> : ${mensagem.text}`

        batepapo.appendChild(divMensagem);
    }

    let ultimaMensagem = batepapo.lastChild.scrollIntoView();
}

//Adicionar o que eu escrevo nas mensagens que estão no servidor
function adicionarMensagem (inputChat){
    let data = new Date();
    let horas = data.getHours();
    let minutos = data.getMinutes();
    let segundos = data.getSeconds();

    let horario = horas + ":" + minutos + ":" + segundos
    const conteudo = document.querySelector('.chat').value
    const remetente = nomeDoUsuario.name
    const destinatario = 'Todos'  // pra colocar diferente é bonus

    let mensagem = {
        from: remetente,
        to: destinatario, //pra colocar diferente é bonus
        text: conteudo,
        type: "message", // pra colocar diferente é bonus
        time: horario
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem)
    promise.catch(deuErroMensagem)
}   

//Respostas para possíveis erros
function deuErro(erro){
    console.log(erro)

    if (erro.response.status === 400){
        alert(`Nome de usuário já está em uso! Escolha outro nickname ou certifique-se de que você não está logado.
(Lembre-se, você só pode usar o chat se tiver um nickname!)`)

        location.reload()
    }
}

function deuErroMensagem(erro) {
    if (erro.response.status === 400) {
        const conteudo = document.querySelector('.chat')
        conteudo.placeholder = 'Escreva algo antes de enviar'

        alert('Escreva algo antes de enviar')
    }
}
//Fim das respostas para possíveis erros

//<============================================>

enviarNome()
setInterval(pegarMensagem, 3000)
setInterval(buscarParticipantes, 10000)

//<============================================>

//Funções do Bônus
function sumir(sidebar) {
    sidebar.classList.add("esconder")

}

function aparecer() {
    const sidebar = document.querySelector('.background-sidebar')
    sidebar.classList.remove("esconder")
}

function escolher() {
    const divCheck = document.querySelector('.check')
    console.log (divCheck)
    divCheck.classList.add("aparecer")
}
