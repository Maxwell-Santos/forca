const forca = document.querySelector("#forca")
const gerador = document.querySelector("#gerador")

const containerLetrasTestadas = document.querySelector("#letrasTestadas")
const input = document.querySelector("#letraChutada")

const geradorbtn = document.querySelector("#gerador")
const chutePalavra = document.querySelector('#chutePalavra')

const containerPalavrasChutadas = document.querySelector("#containerPalavrasChutadas div")
const btnChutar = document.querySelector('.btnChutar')

const containerChances = document.querySelector('#numChances')

const containerAcertos = document.querySelector('#acertos')

const palavras = ['casa', 'cama', 'roupa', 'cobertor', 'travesseiro', 'cadeira', 'mesa', 'pia', 'ventilador',
  'laje', 'janela', 'banheiro', 'box', 'privada', 'chuveiro', 'cabeceira', 'torneira', 'escorredor', 'gaveta',
  'prato', 'garfo', 'copo', 'colher', 'faca']

let chances = 14
let palavrasAcertadas = []

let contadorPalavrasParaJogar = 24
let numAleatorio = 0
let palavraEscolhida = ''
let arrayDaPalavra = []
let palavraTrocadaPorTraco = []
let palavraMudando = []
let letrasTestadas = []
let palavrasChutadas = []

window.addEventListener('load', () => {
  geradorbtn.focus()
  containerChances.innerHTML = chances
  // btnChutar.disabled = true

  // alert(`Você tem ${chances} chances de chute da palavra correta, use bem`)
})

gerador.addEventListener('click', () => {
  gerarPalavra()
  // removerPalavraDoArrayPrincipal()
})

function mostrarDica(elementoBotaoDica){
  const confirmar = confirm("Você só tem uma dica")

  if(confirmar) {
    document.querySelector("#dica").classList.add('active')
    elementoBotaoDica.disabled = true
    elementoBotaoDica.textContent = 'A dica é:'
  }
  
}

//se min tiver nada: 0
//se max tiver nada: 9
//se array tiver nada: o array principal 'palavras'
function gerarPalavra(max = contadorPalavrasParaJogar, array = palavras) {
  const MINIMO = Math.ceil(0)
  const MAXIMO = Math.floor(max)

  //número aletório entre 0 e 8
  numAleatorio = Math.floor(Math.random() * (MAXIMO - MINIMO) + MINIMO)
  palavraEscolhida = array[numAleatorio]

  arrayDaPalavra = palavraEscolhida.split('') //cria um array da palavra

  palavraTrocadaPorTraco = arrayDaPalavra.map(letra => {
    return `<span id="letra">_</span>`
  })

  forca.innerHTML = palavraTrocadaPorTraco.join(' ') //faz com que dentro de forca mostre vários spans
  input.focus()
  geradorbtn.disabled = true
  chutePalavra.disabled = false
}

function existeLetra(letraDeFora) {
  const letrasNoHTML = document.querySelectorAll('#forca #letra')
  let letrasNoHTMLEmArray = Array.from(letrasNoHTML)

  if (!palavraEscolhida) {
    alert("gere uma palavra primeiro")
    return //para sair da função
  }


  // checa se a letra corresponde a alguma letra da palavra escolhida - true ou false
  let existe = arrayDaPalavra.includes(letraDeFora.toLowerCase())

  if (existe) {
    arrayDaPalavra.map((letra, indexDeFora) => {
      if (letra == letraDeFora.toLowerCase()) {
        //esse 'arrayDaPalavra' é o array de spans com o conteúdo de tracinhos, o tracionho na posição que foi encontrada uma letra parecida com a que foi requisitada, será substituido pela letra requisitada recebida como parâmetro no html
        letrasNoHTMLEmArray[indexDeFora].textContent = letraDeFora
      }
    })

    letrasTestadas.push(letraDeFora)

    //estou usando o setTimeout para arrumar um bugzinho de aparecer o alert antes de completar a ultima letra da forca
    setTimeout(() => seraQueAcertou(), 500)

  } else {

    letrasTestadas.push(input.value)
    //mesmo que a letra requisitada não exista na palavra, ela será mostrada na lista de letras testadas
  }

  containerLetrasTestadas.innerHTML = letrasTestadas //lista das letras testadas
  input.value = '' //limpa o input após clicar em 'Tem?'
  input.focus()
}

function resetar(mensagem) {
  const continuarNoJogo = !mensagem && confirm("Ao resetar, PERDERÁ todos os ACERTOS, tem certeza disso?")

  if (!mensagem) { // só vai ter mensagem se o usuário ainda tiver chances
    chances = 14
    containerChances.innerHTML = chances
  }

  if (continuarNoJogo) {
    chutePalavra.disabled = true
    forca.innerHTML = ''
    letrasTestadas = []
    containerLetrasTestadas.textContent = ''
    input.value = ''
    chutePalavra.value = ''
    containerPalavrasChutadas.textContent = ''
    
    if(!mensagem) {
      geradorbtn.disabled = false
      palavrasAcertadas = []
    }
  }
}

function chutarPalavra(chuteDaPalavraEscolhida) {
  const span = document.createElement('span')

  const estaVazio = chuteDaPalavraEscolhida === '' ? true : false

  if(!estaVazio) {
    if (chuteDaPalavraEscolhida.toLowerCase() == palavraEscolhida) {
      forca.textContent = palavraEscolhida
  
      setTimeout(() => {
        mensagemDeSucesso()
      }, 500)
  
    } else {
      palavrasChutadas.unshift(chuteDaPalavraEscolhida)
      alert(`${chuteDaPalavraEscolhida.toUpperCase()} não é a palavra certa`)
  
      chances--
  
      containerChances.innerHTML = chances
  
      if (chances == 0) {
        alert("Você usou todas as suas chances de chute da palavra, boa sorte")
        btnChutar.disabled = true
        chutePalavra.disabled = true
        chutePalavra.value = ''
      }
    }

    span.textContent = chuteDaPalavraEscolhida.toUpperCase() + ', '
    containerPalavrasChutadas.appendChild(span)
  } else {
    alert('Você não chutou nenhuma palavra!')
    chutePalavra.focus()
  }
}

function ativarBtnChute() {
  chutePalavra.value != '' ? btnChutar.disabled = false : btnChutar.disabled = true
}

function seraQueAcertou() {
  const s = forca.querySelectorAll('#letra')
  const ars = Array.from(s)

  const teste = ars.every(elemento => elemento.textContent != "_")

  if (teste) mensagemDeSucesso()
}

function removerPalavraDoArrayPrincipal() {
  palavras.map((palavra, index) => {
    if (palavra == palavraEscolhida) {
      palavras.splice(index, 1)
    }
  })

  if(contadorPalavrasParaJogar == 0) alert("Parabéns, você zerou as palavras da forca!")

  palavraEscolhida = ''

  return palavras
}

function mensagemDeSucesso() {
  alert(`Parabéns! ${palavraEscolhida.toUpperCase()} é a palavra correta.`)
  palavrasAcertadas.push(palavraEscolhida)

  containerAcertos.innerHTML = `<span class="palavrasCertas">${palavrasAcertadas}</span>`

  const confirmarSeVaiJogarDenovo = confirm('Aperte em ok para gerar uma nova palavra')

  if(confirmarSeVaiJogarDenovo){
    resetar('continuar')
    contadorPalavrasParaJogar--
    gerarPalavra(contadorPalavrasParaJogar, removerPalavraDoArrayPrincipal())
    
  } else {
    alert("Que pena que você desistiu...")
  }
}
