function novoElemento(tagName, className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

//Construtora para barreira
function Barreira(reversa = false){
    this.elemento = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

//Construtora para par de barreiras
function ParDeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div', 'par-de-barreiras')
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)
    
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    //Função para sortear a posição das barreiras no eixo y
    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    
    this.setX = valor => this.elemento.style.left = `${valor}px`
    
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

//Função para geração de barreiras seguidas
function Barreiras(altura, largura, abertura, espacoEntreBarreiras, notificarPonto){
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espacoEntreBarreiras),
        new ParDeBarreiras(altura, abertura, largura + espacoEntreBarreiras * 2),
        new ParDeBarreiras(altura, abertura, largura + espacoEntreBarreiras * 3)
    ]

    //Quantidade de pixels no deslocamento das barreiras
    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //Quando a barreira sair da tela do jogo
            if(par.getX() < -par.getLargura()){
                console.log('Entrou aqui')
                par.setX(par.getX() + espacoEntreBarreiras * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio 
                && par.getX() < meio
            if(cruzouOMeio){
                notificarPonto()
            }
        })
    }
}

const barreiras = new Barreiras(500, 1200, 200, 400)
const areaDoJogo = document.querySelector('[wm-flappy]')
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval(() => {
    barreiras.animar()
}, 20)
