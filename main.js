function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

/**
 * Dibujar rectángulo
 * @param {Object} data 
 * @param {CanvasRenderingContext2D} CTX 
 */
function rectangulo(data, CTX) {
    CTX.beginPath()
    CTX.rect(data.x0, data.y0, data.x1, data.y1);
    CTX.fillStyle = "green";
    CTX.fill();
}

/**
 * Función para dibujar todos los círculos
 * @param {Object} data 
 * @param {CanvasRenderingContext2D} ctx 
 */
function circulo(data, ctx) {
    ctx.beginPath()
    ctx.strokeStyle = data.color;
    ctx.fillStyle = data.color;
    ctx.lineWidth = 2;
    ctx.arc(data.x0, data.y0, data.radio, 0, data.fin);
    ctx.fill();
    ctx.stroke();
}

/**
 * Función para dibujar todas las líneas
 * @param {Object} data 
 * @param {CanvasRenderingContext2D} ctx 
 */
function linea(data, ctx) {
    ctx.beginPath()
    ctx.lineWidth = 5;
    ctx.strokeStyle = "brown";
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.stroke()
}

/**
 * Función para dibujar el tanque entero
 * @param {Object} data 
 * @param {CanvasRenderingContext2D} CTX 
 */
function dibujaTanque(data, CTX) {
    CTX.clearRect(0, 0, 1200, 800)
    rectangulo(data.oruga1, CTX);
    rectangulo(data.oruga2, CTX);
    rectangulo(data.cuerpo, CTX);
    circulo(data.torre, CTX);
    linea(data.canon, CTX)
}
/**
 * Función para dibujar el tanque entero
 * @param {Object} data 
 * @param {CanvasRenderingContext2D} CTX 
 */
function dibujaDiana(data, CTX) {

    for (data.radio; data.radio >= 0; data.radio -= 5) {
        if (data.radio % 10 == 0) {
            data.color = "red"
        } else {
            data.color = "black"
        }
        circulo(data, CTX);
    }
    data.radio = data.auxRadio;
}

/**
 * Calculo la trayectoria 
 * @param {number} angulo 
 * @param {Object} data 
 * @returns {Object}
 */
function trayectoria(angulo, data) {
    var sen = Math.sin(angulo) * data.hip;
    var cos = Math.cos(angulo) * data.hip;
    if (data.x1 && data.y1) {
        data.x1 = data.x0 + cos;
        data.y1 = data.y0 + sen;
    } else {
        data.x0 = data.auxX0 + cos;
        data.y0 = data.auxY0 + sen;
    }

    return data
}

/**
 * Función temporizada
 * @param {number} ang 
 * @param {object} data 
 * @param {CanvasRenderingContext2D} CTX 
 */
function disparo(ang, dataTanque, dataDiana, CTX, interv) {
    dataTanque.bala.hip += 2;
    dataTanque.bala = trayectoria(ang, dataTanque.bala);
    dibujaTanque(dataTanque, CTX)
    dibujaDiana(dataDiana, CTX)
    circulo(dataTanque.bala, CTX)
    if (dataTanque.bala.x0 <= 0) {
        clearInterval(interv)
    }
}

/**
 * Eventos tel teclado
 * @param {Object} data 
 * @param {CanvasRenderingContext2D} CTX 
 */
function eventos(dataTanque, dataDiana, CTX) {

    var angulo = 0;
    var pulsado = false;
    var interv = null;

    //Pulsar una tecla
    document.addEventListener('keydown', evt => {

        //Pulsar flecha derecha
        if (evt.key == "ArrowRight") {
            angulo += 0.05;
            dataTanque.canon = trayectoria(angulo, dataTanque.canon, 55)
            dibujaTanque(dataTanque, CTX)
            dibujaDiana(dataDiana, CTX)

        }

        //Pulsar flecha izquierda
        if (evt.key == "ArrowLeft") {
            angulo -= 0.05;
            dataTanque.canon = trayectoria(angulo, dataTanque.canon, 55)
            dibujaTanque(dataTanque, CTX)
            dibujaDiana(dataDiana, CTX)
        }

        //Pulsar espacio
        if (evt.key == " ") {
            if (pulsado == false) {
                pulsado = true
                interv = setInterval(disparo, 10, angulo, dataTanque, dataDiana, CTX, interv)
            }
        }
    })

    /**
     * Función temporizada
     * @param {number} ang 
     * @param {object} data 
     * @param {CanvasRenderingContext2D} CTX 
     */
    function disparo(ang, dataTanque, dataDiana, CTX) {
        dataTanque.bala.hip += 2;
        dataTanque.bala = trayectoria(ang, dataTanque.bala);
        dibujaTanque(dataTanque, CTX)
        dibujaDiana(dataDiana, CTX)
        circulo(dataTanque.bala, CTX)
        if (dataTanque.bala.x0 <= 0 || dataTanque.bala.y0 <= 0 || dataTanque.bala.x0 >= 1200 || dataTanque.bala.y0 >= 800) {
            clearInterval(interv)
            pulsado = false
            dibujaTanque(dataTanque, CTX)
            dibujaDiana(dataDiana, CTX)
            dataTanque.bala.x0 = dataTanque.bala.auxX0
            dataTanque.bala.y0 = dataTanque.bala.auxY0
            dataTanque.bala.hip = 55;
        }
    }

}

function main() {
    /**
     * canvas principal
     * @type {HTMLCanvasElement}
     */
    const CANVAS = document.getElementById("canvas");
    /**
     * @type {CanvasRenderingContext2D}
     */
    const CTX = CANVAS.getContext("2d");

    var tanque = {
        oruga1: {
            x0: 10,
            y0: (CANVAS.height / 2) - 30,
            x1: 100,
            y1: 10,
        },
        oruga2: {
            x0: 10,
            y0: (CANVAS.height / 2) + 30,
            x1: 100,
            y1: -10,
        },
        cuerpo: {
            x0: 30,
            y0: (CANVAS.height / 2) - 20,
            x1: 60,
            y1: 40,
        },
        torre: {
            x0: 65,
            y0: (CANVAS.height / 2),
            radio: 15,
            fin: 2 * Math.PI,
            color: "brown"
        },
        canon: {
            x0: 65,
            y0: (CANVAS.height / 2),
            x1: 120,
            y1: (CANVAS.height / 2),
            hip: 55,
        },
        bala: {
            x0: 65,
            auxX0: 65,
            y0: (CANVAS.height / 2),
            auxY0: (CANVAS.height / 2),
            radio: 2.5,
            fin: 2 * Math.PI,
            color: "black",
            hip: 55,
        },

    }

    var diana = {
        x0: 0,
        y0: 0,
        radio: 30,
        auxRadio: 30,
        fin: 2 * Math.PI,
        color: "red"
    }

    diana.x0 = Math.floor(Math.random() * (1200 - 0) + 0)
    diana.x0 = Math.floor(Math.random() * (800 - 0) + 0)

    dibujaTanque(tanque, CTX, CANVAS);
    diana.x0 = aleatorio(200, 1200);
    diana.y0 = aleatorio(0, 800)
    dibujaDiana(diana, CTX, CANVAS);

    eventos(tanque, diana, CTX);

}

main();