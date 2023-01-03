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

const containerVidasLetras = document.querySelector('#vidasLetras')
const containerVidasPalavras = document.querySelector('#vidasPalavras')

const palavras = ['cama', 'cobertor', 'travesseiro', 'cadeira', 'mesa', 'pia', 'ventilador',
  'laje', 'janela', 'banheiro', 'box', 'privada', 'chuveiro', 'torneira', 'gaveta', 'porta']

let chancesPalavrasErradas = 4
let chancesLetrasErradas = 6
let arrayDeVidasPalavras = []
let arrayDeVidasLetras = []

let palavrasAcertadas = []

let contadorPalavrasParaJogar = 16
let numAleatorio = 0
let palavraEscolhida = ''
let arrayDaPalavra = []
let palavraTrocadaPorTraco = []
let palavraMudando = []
let letrasTestadas = []
let palavrasChutadas = []

const audioErro = new Audio('../efeitos/wrong.wav')

window.addEventListener('load', () => {
  listarVidas('palavra', chancesPalavrasErradas, true)
  listarVidas('letra', chancesLetrasErradas, true)

  geradorbtn.focus()
  containerPalavrasChutadas.innerHTML = palavrasChutadas
})

gerador.addEventListener('click', () => {
  gerarPalavra()
})

//se max tiver nada: 16
//se array tiver nada: o array principal 'palavras'
function gerarPalavra(max = contadorPalavrasParaJogar, array = palavras) {
  const MINIMO = Math.ceil(0)
  const MAXIMO = Math.floor(max)

  //número aleatório entre 0 e 23
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

function mostrarDica(elementoBotaoDica) {
  if(!palavraEscolhida){
    alert('gere uma palavra primeiro')
    geradorbtn.focus()
    return
  }

  const confirmar = confirm("Você só tem uma dica")

  if (confirmar) {
    document.querySelector("#dica").classList.add('active')
    elementoBotaoDica.disabled = true
    elementoBotaoDica.textContent = 'A dica é:'
  }
}

function listarVidas(tipoVida, quantidade, ignorarPrimeiroLoad) {


  if (tipoVida == 'letra') {
    if (quantidade == 6 && !ignorarPrimeiroLoad) { //máximo de vida possível
      return
    }

    for (let index = 0; index < quantidade; index++) {
      arrayDeVidasLetras.push('<img src="assets/heart.svg" alt="vidas palavras">')

    }
    containerVidasLetras.innerHTML = arrayDeVidasLetras.map(img => img).join('')
  }

  if (tipoVida == 'palavra') {
    if (quantidade == 4 && !ignorarPrimeiroLoad) { //máximo de vida possível
      return
    }
    for (let index = 0; index < quantidade; index++) {
      arrayDeVidasPalavras.push('<img src="assets/lightning.png" alt="vidas palavras">')
    }
    containerVidasPalavras.innerHTML = arrayDeVidasPalavras.map(img => img).join('')
  }
}

function existeLetra(letraDeFora) {
  const letrasNoHTML = document.querySelectorAll('#forca #letra')
  let letrasNoHTMLEmArray = Array.from(letrasNoHTML)
  
  letraDeFora.trim()

  if (!palavraEscolhida) {
    audioErro.play()
    return alert("gere uma palavra primeiro")

  }
  if (!letraDeFora || letraDeFora == ' ') {
    audioErro.play()
    input.focus()
    return alert("Chute uma letra!")
  }

  // checa se a letra corresponde a alguma letra da palavra escolhida - true ou false
  let existe = arrayDaPalavra.includes(letraDeFora.toLowerCase())

  if (existe) {
    arrayDaPalavra.map((letra, indexDeFora) => {
      if (letra == letraDeFora.toLowerCase()) {
        //esse 'arrayDaPalavra' é o array de spans com o conteúdo de tracinhos, o tracinho na posição que foi encontrada uma letra parecida com a que foi requisitada, será substituído pela letra requisitada recebida como parâmetro no html
        letrasNoHTMLEmArray[indexDeFora].textContent = letraDeFora
      }
    })

    //estou usando o setTimeout para arrumar um delay de aparecer o alert antes de completar a ultima letra da forca
    setTimeout(() => seraQueAcertouALetra(), 500)

  } else {

    letrasTestadas.push(input.value)
    //letra requisitada que não existe na palavra, ela será mostrada na lista de letras testadas

    perderVida() //perder vida de letra

    if (chancesPalavrasErradas == 0) {
      alert("Acabaram suas chances de chute da palavra")

    } else if (chancesLetrasErradas == 0) {

      alert("Você perdeu em meu caro")
      restaurar()
    }
  }

  containerLetrasTestadas.innerHTML = letrasTestadas //lista das letras testadas
  input.value = '' //limpa o input após clicar em 'Tem?'
  input.focus()
}

function chutarPalavra(chuteDaPalavraEscolhida) {
  const span = document.createElement('span')

  const estaVazio = chuteDaPalavraEscolhida === '' ? true : false

  if (!estaVazio) {
    chuteDaPalavraEscolhida.trim()
    if (chuteDaPalavraEscolhida.toLowerCase() == palavraEscolhida) {
      forca.textContent = palavraEscolhida

      setTimeout(() => {

        if (chancesPalavrasErradas < 4) { //a vida máxima é 4 então só vai acrescentar um ponto caso acerte a palavra e for menor que 4
          //adiciona mais uma vida ao jogador no chute de palavras
          listarVidas('palavra', 1)
          ganhouUmaVidaDePalavra()
        }

        mensagemDeSucesso()

      }, 500)

    } else {
      palavrasChutadas.unshift(chuteDaPalavraEscolhida)
      alert(`${chuteDaPalavraEscolhida.toUpperCase()} não é a palavra certa`)

      perderVida("chutou palavra e errou")
      chutePalavra.value = ''
      chutePalavra.focus()

      if (chancesPalavrasErradas == 0) {
        alert("Você usou todas as suas chances de chute da palavra, boa sorte")
        btnChutar.disabled = true
        chutePalavra.disabled = true
        chutePalavra.value = ''
      }
    }

    span.textContent = chuteDaPalavraEscolhida.toUpperCase() + ', '
    containerPalavrasChutadas.appendChild(span)

  } else {
    audioErro.play()
    alert('Você não chutou nenhuma palavra!')
    chutePalavra.focus()
  }
}

// Essa função é chamada para saber se o jogador acertou a palavra chutando letra por letra
function seraQueAcertouALetra() {
  const s = forca.querySelectorAll('#letra')
  const ars = Array.from(s)

  const teste = ars.every(elemento => elemento.textContent != "_")

  if (teste) {
    listarVidas('letra', 1)
    mensagemDeSucesso()
  }
}

function removerPalavraDoArrayPrincipal() {
  palavras.map((palavra, index) => {
    if (palavra == palavraEscolhida) {
      palavras.splice(index, 1)
    }
  })

  if (contadorPalavrasParaJogar == 0) alert("Parabéns, você zerou as palavras da forca!")

  palavraEscolhida = ''
  return palavras
}

function mensagemDeSucesso() {
  alert(`Parabéns! ${palavraEscolhida.toUpperCase()} é a palavra correta.`)
  palavrasAcertadas.push(palavraEscolhida)

  containerAcertos.innerHTML = `<span class="palavrasCertas">${palavrasAcertadas}</span>`

  const confirmarSeVaiJogarDenovo = confirm('Aperte em ok para gerar uma nova palavra')

  if (confirmarSeVaiJogarDenovo) {
    ganhouUmaVidaDeLetra()
    palavrasChutadas = []
    containerPalavrasChutadas.innerHTML = ''

    letrasTestadas = []
    containerLetrasTestadas.textContent = ''
    chutePalavra.value = ''
    restaurar('continuar')
    contadorPalavrasParaJogar--
    gerarPalavra(contadorPalavrasParaJogar, removerPalavraDoArrayPrincipal())

  } else {
    alert("Que pena que você desistiu...")
  }
}

function perderVida(chutouPalavra) {

  if (chutouPalavra) {
    perdeuUmaVidaDePalavra()

    chancesPalavrasErradas--
    arrayDeVidasPalavras = []

    listarVidas('palavra', chancesPalavrasErradas)
    containerVidasPalavras.innerHTML = arrayDeVidasPalavras.map(img => img).join('')

  } else {
    perdeuUmaVidaDeLetra()

    chancesLetrasErradas--
    arrayDeVidasLetras = []
    listarVidas('letra', chancesLetrasErradas)
    containerVidasLetras.innerHTML = arrayDeVidasLetras.map(img => img).join(' ')
  }
}

//não terá mensagem quando a função for chamada direto do botão de resetar
function restaurar(mensagem) {
  const continuarNoJogo = !mensagem && confirm("Ao reiniciar, PERDERÁ todos os ACERTOS, tem certeza disso?")

  console.log(continuarNoJogo)

  if (continuarNoJogo) {
    chutePalavra.disabled = true
    forca.innerHTML = ''
    letrasTestadas = []
    containerLetrasTestadas.textContent = ''
    input.value = ''
    chutePalavra.value = ''
    containerPalavrasChutadas.textContent = ''

    if (!mensagem) {
      geradorbtn.disabled = false
      palavrasAcertadas = []

      location.reload()
    }
  }
}

const audioGanharVida = new Audio('../efeitos/win.wav')
const audioPerderVida = new Audio('../efeitos/lose.wav')

// animações
const animacao = document.querySelector('#animacao')

const perdeuUmaVidaDePalavra = () => {
  animacao.classList.remove('positivo')

  animacao.classList.add('active')
  audioPerderVida.play()
  animacao.innerHTML = '<span>-1</span> <img src="assets/lightning.png" alt="vidas palavras">'

  setTimeout(() => {
    animacao.classList.remove('active')
  }, 1100) // tempo da animação
}

const ganhouUmaVidaDePalavra = () => {
  animacao.classList.add('positivo')
  animacao.classList.add('active')
  audioGanharVida.play()
  animacao.innerHTML = '<span>+1</span> <img src="assets/lightning.png" alt="vidas palavras">'

  setTimeout(() => {
    animacao.classList.remove('active')
  }, 1100) // tempo da animação
}


const perdeuUmaVidaDeLetra = () => {
  animacao.classList.remove('positivo')

  animacao.classList.add('active')
  audioPerderVida.play()
  animacao.innerHTML = '<span>-1</span> <img src="assets/heart.svg" alt="vidas palavras">'
  
  setTimeout(() => {
    animacao.classList.remove('active')
  }, 1100) // tempo da animação
}

const ganhouUmaVidaDeLetra = () => {
  animacao.classList.add('positivo')
  animacao.classList.add('active')
  audioGanharVida.play()
  animacao.innerHTML = '<span>+1</span> <img src="assets/heart.svg" alt="vidas palavras">'
  
  setTimeout(() => {
    animacao.classList.remove('active')
  }, 1100) // tempo da animação
}