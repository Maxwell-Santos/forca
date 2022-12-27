const forca = document.querySelector("#word")

const containerLetrasTestadas = document.querySelector("#letrasTestadas")
const input = document.querySelector("#lala")

const geradorbtn = document.querySelector("#gerador")
const chutePalavra = document.querySelector('#chutePalavra')

const containerPalavrasChutadas = document.querySelector("#containerPalavrasChutadas div")
const btnChutar = document.querySelector('.btnChutar')

const containerChances = document.querySelector('#numChances')

const containerAcertos = document.querySelector('#acertos')

const palavras = ['casa', 'cama', 'roupa', 'cobertor', 'travesseiro', 'cadeira', 'mesa', 'pia', 'ventilador']

let chances = 2
let palavrasAcertadas = []

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
  // alert("Você só tem duas chances de chute da palavra, tenha certeza do seu chute")
})

function gerarPalavra() {
  const min = Math.ceil(0)
  const max = Math.floor(9)

  //número aletório entre 0 e 8
  numAleatorio = Math.floor(Math.random() * (max - min) + min)
  palavraEscolhida = palavras[numAleatorio]

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
  const letrasNoHTML = document.querySelectorAll('#word #letra')
  let letrasNoHTMLEmArray = Array.from(letrasNoHTML)

  if (!palavraEscolhida) {
    alert("gere uma palavra primeiro")
    return //para sair da função
  }

  console.log(palavraEscolhida)


  // checa se a letra corresponde a alguma letra da palavra escolhida - true ou false
  let existe = arrayDaPalavra.includes(letraDeFora.toLowerCase())

  if (existe) {
    arrayDaPalavra.map((letra, indexDeFora) => {
      if (letra == letraDeFora.toLowerCase()) {
        //esse 'arrayDaPalavra' é o array de spans com o conteúdo de tracinhos, o tracionho na posição que foi encontrada uma letra parecida com a que foi requisitada, será substituido pela letra requisitada recebida como parâmetro no html
        letrasNoHTMLEmArray[indexDeFora].textContent = letraDeFora
      }
    })

    // jaFoi(letraDeFora, true)
    letrasTestadas.push(letraDeFora)
  } else {

    // jaFoi(letraDeFora, false)
    letrasTestadas.push(input.value)
    //mesmo que a letra requisitada não exista na palavra, ela será mostrada na lista de letras testadas
  }

  containerLetrasTestadas.innerHTML = letrasTestadas //lista das letras testadas
  input.value = '' //limpa o input após clicar em 'Tem?'
  input.focus()
}

function resetar(mensagem) {
  const talvez = mensagem ? confirm(mensagem) : confirm("Ao resetar, PERDERÁ todos os ACERTOS, tem certeza disso?")

  if(!mensagem){ // só vai ter mensagem se o usuário ainda tiver chances
    chances = 2
    containerChances.innerHTML = chances
  }

  if (talvez) {
    geradorbtn.disabled = false
    chutePalavra.disabled = true
    forca.innerHTML = ''
    palavraEscolhida = ''
    letrasTestadas = []
    containerLetrasTestadas.textContent = ''
    input.value = ''
    chutePalavra.value = ''
    containerPalavrasChutadas.textContent = ''
  }
}

function chutarPalavra(chuteDaPalavraEscolhida) {
  const span = document.createElement('span')

  if (chuteDaPalavraEscolhida.toLowerCase() == palavraEscolhida) {
    forca.textContent = palavraEscolhida

    setTimeout(() => {
      alert(`Parabéns! ${chuteDaPalavraEscolhida.toUpperCase()} é a palavra correta.`)

      palavrasAcertadas.push(palavraEscolhida)
      containerAcertos.innerHTML = `<span class="palavrasCertas">${palavrasAcertadas}</span>`

      resetar('Tenta outra palavra?')
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
}

function ativarBtnChute() {
  chutePalavra.value != '' ? btnChutar.disabled = false : btnChutar.disabled = true
}