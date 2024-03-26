let algarismos = 4, tentativas = 0, numero_random = 0
let mostrar_posicaoErrada = false, jogoAcabado = false, cor
let array_usuario = [], array_gerada = [], array_resultados = [], array_secundaria = []
const mainMenu = document.getElementById('menuPrincipal')
const jogoDisplay = document.getElementById('jogoDisplay')
const input_usuario = document.getElementById('usuarioInput')
const tentativas_anteriores = document.getElementById('tentativasAnteriores')

function alterarAlgarismos() {
    algarismos = document.getElementById('inputNumeros').value
    document.getElementById('labelNumeros').innerText = "Numeros: " + algarismos
}

function iniciar() {
    mostrar_posicaoErrada = document.getElementById('checkBox_posicaoErrada').checked
    mainMenu.style.display = 'none'
    jogoDisplay.style.display = 'block'
    tentativas = 0
    document.getElementById('tentativas').innerText = "Guesses: " + tentativas
    jogoAcabado = false

    while (input_usuario.lastChild) {
        input_usuario.removeChild(input_usuario.lastChild)
    }

    while (tentativas_anteriores.lastChild) {
        tentativas_anteriores.removeChild(tentativas_anteriores.lastChild)
    }

    array_usuario = []
    array_gerada = []
    
    // criar div para cada numero
    for (i = 0; i < algarismos; i++) {
        var div_letra = document.createElement('input')
        div_letra.setAttribute('type', 'text')
        div_letra.setAttribute('class', 'inputNumeroUsuario')
        div_letra.setAttribute('autocomplete', 'off')
        div_letra.setAttribute('id', 'input_usuario_' + i)
        div_letra.setAttribute('data-empty-element', 'true')
        div_letra.setAttribute('maxlength', '1')
        div_letra.setAttribute('onkeyup', "separarNumeros(this, event)")
        input_usuario.appendChild(div_letra)

        numero_random = Math.floor(Math.random() * 10);
        array_gerada.push(numero_random)
    }

    document.getElementById('input_usuario_0').focus()
}

function separarNumeros(input, event) {
    const wasInitiallyEmpty = input.getAttribute('data-empty-element') === 'true';

    if (input.value.length > 0) {
        if (input.nextElementSibling) {
            input.nextElementSibling.focus();
        }
    } else if (event.key === "Backspace") {
        if (wasInitiallyEmpty) {
            if (input.previousElementSibling) {
                input.previousElementSibling.focus();
                input.previousElementSibling.value = '';
                input.previousElementSibling.setAttribute('data-empty-element', 'true');
            }
        }
    }
    
    if (event.key === "Enter") {
        verificarNumeros()
    }

    if (input.value.length === 0) {
        input.setAttribute('data-empty-element', 'true');
    } else {
        input.removeAttribute('data-empty-element');
    }
}

function verificarNumeros() {
    array_usuario = [];
    array_resultados = [];
    array_secundaria = array_gerada.slice();
    for (let i = 0; i < algarismos; i++) {
        const inpt_user = document.getElementById('input_usuario_' + i).value;
        if (inpt_user.length === 0) {
            return;
        }
        array_usuario.push(inpt_user);
    }

    const tentativas_anteriores = document.getElementById('tentativasAnteriores');

    if (tentativas_anteriores.children.length >= 4) {
        tentativas_anteriores.removeChild(tentativas_anteriores.firstChild);
    }

    for (c = 0; c < algarismos; c++) {
        if (array_usuario[c] == array_secundaria[c]) {
            array_resultados[c] = "certo"
            array_secundaria[c] = null
        } else {
            array_resultados[c] = null
        }
    }

    for (e = 0; e < algarismos; e++) {
        if (array_resultados[e] == null) {
            if(array_secundaria.includes(parseInt(array_usuario[e]))) {
                array_resultados[e] = "existe";
                array_secundaria[array_secundaria.findIndex(element => element === parseInt(array_usuario[e]))] = null
            } else {
                array_resultados[e] = "errado";
            }
        }
    }

    const novaFilaTentativas = document.createElement('div');
    novaFilaTentativas.setAttribute('class', 'linhaTentativas');

    for (let i = 0; i < algarismos; i++) {
        let cor;

        switch (array_resultados[i]) {
            case "certo":
                cor = "rgba(59, 147, 35, 0.6)"
                break
            case "errado":
                cor = "rgba(147, 35, 35, 0.6)"
                break
            case "existe":
                cor = "rgba(255, 255, 0, 0.6)"
                break
            default:
                break
        }

        const novoDiv = document.createElement('div');
        novoDiv.setAttribute('class', 'tentativaUser');
        novoDiv.style.backgroundColor = cor;
        novoDiv.innerText = array_usuario[i];

        novaFilaTentativas.appendChild(novoDiv);
                document.getElementById('input_usuario_' + i).value = ''
    }

    tentativas_anteriores.appendChild(novaFilaTentativas);
    document.getElementById('input_usuario_0').focus();
    tentativas++
    document.getElementById('tentativas').innerText = "Guesses: " + tentativas

    const allCorrect = array_resultados.every(result => result === "certo");

    if (allCorrect) {
        jogoAcabado = true;
    }

    atualizarEstado()
}

function atualizarEstado() {
    if(jogoAcabado) {
        menuPrincipal()
    }
}

function menuPrincipal() {
    mainMenu.style.display = 'block'
    jogoDisplay.style.display = 'none'
}

function debug() {
    console.clear()
    console.log(`--- DEBUG MODE ---\n\nGenerated Array: ${array_gerada}\nSecundary array: ${array_secundaria}\nUser Array: ${array_usuario}\nResults Array: ${array_resultados}\n\nNumbers: ${algarismos}\nWrong Positions: ${document.getElementById('checkBox_posicaoErrada').checked}`)
}

// DEBUG  -  CTRL + ALT + D

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.altKey && event.key === 'd') {
        debug();
    }
});
