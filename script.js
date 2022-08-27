//Nome do usuário
function sumirTela (inputEntrar) {
    const gif = document.querySelector(".gif")
    const h1Carregamento = document.querySelector(".tela-entrada h1")
    const inputNome = document.querySelector(".nome")

    if (inputNome.value !== '') {
        inputNome.classList.add("esconder")
        inputEntrar.classList.add("esconder")
        gif.classList.remove("esconder")
        h1Carregamento.classList.remove("esconder")
    }

    let nomeDoUsuario = {
        name: inputNome.value
        }

    enviarNome(nomeDoUsuario)

    setTimeout (() => {
    const telaEntrada = document.querySelector(".back-tela-entrar")
    telaEntrada.classList.add("esconder")
}, 4000)

    setTimeout(() => {
        alert("Para melhor experiência, primeiro escreva a mensagem no campo de texto, para  depois selecionar o Destinatário e a Visibilidade")
    }, 5000);
}

//Entrar na sala
function enviarNome (nomeDoUsuario) {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeDoUsuario)
    promise.then(manterConexao)
    promise.catch(deuErro)

    document.addEventListener("keypress", function(e){
        if (e.key === "Enter") {
            adicionarMensagem()
        }
    }) 
}

//Manter a conexão com a sala
function manterConexao () {
    const inputNome = document.querySelector(".nome")
    let nomeDoUsuario = {
        name: inputNome.value
        }

    setInterval (() => {
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeDoUsuario)
        promise.catch(deuErroConexao)
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
        ulUsuarios.innerHTML = ` <div class="usuarios selecionado" onclick="escolherUsuariosTodos(this)" data-identifier="participant">
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
         divUsuario.addEventListener("click", escolherUsuario);
 
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

    let ultimaMensagem = batepapo.lastChild.scrollIntoView({behavior:"smooth"});
}

//Adicionar o que eu escrevo nas mensagens que estão no servidor
function adicionarMensagem () {
    let data = new Date();
    let horas = data.getHours();
    let minutos = data.getMinutes();
    let segundos = data.getSeconds();

    const opcaoEscolhidaTexto = document.querySelector('.visibilidade .selecionado span').innerHTML
    const opcaoEscolhidaUsuario = document.querySelector('.participantes .selecionado span').innerHTML
    const inputNome = document.querySelector(".nome")

    let nomeDoUsuario = {
        name: inputNome.value
        }
    let horario = horas + ":" + minutos + ":" + segundos
    const conteudo = document.querySelector('.chat').value
    const remetente = nomeDoUsuario.name
    const destinatario = opcaoEscolhidaUsuario
    let tipo = ''

    if (opcaoEscolhidaTexto === "Público") {
        tipo = "message"
    } else {
        tipo = "private_message"
    }

    let mensagem = {
        from: remetente,
        to: destinatario,
        text: conteudo,
        type: tipo,
        time: horario
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem)
    promise.catch(deuErroMensagem)

    document.querySelector('.chat').value = ''
}   

//Respostas para possíveis erros
function deuErro(erro) {
    console.log(erro)

    if (erro.response.status === 400){
        alert(`Nome de usuário inválido!
Por favor, tente novamente \uD83D\uDE0A

Essa mensagem pode ter aparecido por 2 motivos:
· Você não digitou o seu nome
· Alguém já está registrado com esse nome`)

        location.reload()
    }
}

function deuErroConexao(erro) {
        location.reload()
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

setInterval(pegarMensagem, 3000)
setInterval(buscarParticipantes, 10000)

//<============================================>

//Funções do Bônus
function sumir() {
    const backgroundsidebar = document.querySelector('.background-sidebar')
    backgroundsidebar.classList.add("esconder")

    const partepreta = document.querySelector('.parte-preta')
    partepreta.classList.add("esconder")
}

function aparecer() {
    const backgroundsidebar = document.querySelector('.background-sidebar')
    backgroundsidebar.classList.remove("esconder")

    const partepreta = document.querySelector('.parte-preta')
    partepreta.classList.remove("esconder")
}

document.querySelector('.parte-preta').addEventListener("click", sumir);

function escolherUsuario ({target}) {
    const opcaoEscolhida = document.querySelector('.participantes .selecionado')

    if (opcaoEscolhida !== null){
        opcaoEscolhida.classList.remove('selecionado')
    }

    target.classList.add("selecionado")

    textoInput()
}

function escolherUsuarioTodos (todos) {
    const opcaoEscolhida = document.querySelector('.participantes .selecionado')

    if (opcaoEscolhida !== null){
        opcaoEscolhida.classList.remove('selecionado')
    }

    todos.classList.add("selecionado")

    const opcaoEscolhidaUsuario = document.querySelector('.participantes .selecionado span').innerHTML
}

function escolherVisibilidade (opcaoVisibilidade) {
    const opcaoEscolhida = document.querySelector('.visibilidade .selecionado')

    if (opcaoEscolhida !== null){
        opcaoEscolhida.classList.remove('selecionado')
    }

    opcaoVisibilidade.classList.add("selecionado")

    textoInput()
}

function textoInput () {
    const opcaoEscolhidaUsuario = document.querySelector('.participantes .selecionado span').innerHTML
    const opcaoEscolhidaTexto = document.querySelector('.visibilidade .selecionado span').innerHTML

    const textoInput = document.querySelector(".enviando")
    textoInput.innerHTML = `Enviando mensagem para ${opcaoEscolhidaUsuario} (${opcaoEscolhidaTexto})`
}