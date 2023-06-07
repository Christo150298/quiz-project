
const select_id = (id) => {
    return document.getElementById(id);
  };
  
const style = (id) => {
    return select_id(id).style;
};
  
let respuestasAcertadas = 0;
let fallos = 0;
let preguntasRespondidas = 0;
let intentosRestantes = 5; // Nuevo contador de intentos
let interprete_bp;
let pregunta;
let posibles_respuestas;
let botones = [
    select_id("btn1"),
    select_id("btn2"),
    select_id("btn3"),
    select_id("btn4")
];
  
const readJSON = async (ruta_local) => {
    try {
      const response = await fetch(ruta_local);
      if (!response.ok) {
        throw new Error("Error al cargar el archivo JSON");
      }
      const texto = await response.text();
      return texto;
    } catch (error) {
      throw new Error("Error al cargar el archivo JSON");
    }
};
  
const preguntaAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * interprete_bp.length);
    pregunta = interprete_bp[indiceAleatorio];
  
    select_id("categoria").innerHTML = pregunta.categoria;
    select_id("pregunta").innerHTML = pregunta.pregunta;
    select_id("imagen").setAttribute("src", pregunta.imagen);
    select_id("imagen").objectFit = pregunta.objectFit;
    select_id("btn1").innerHTML = pregunta.respuesta;
    select_id("btn2").innerHTML = pregunta.incorrecta1;
    select_id("btn3").innerHTML = pregunta.incorrecta2;
    select_id("btn4").innerHTML = pregunta.incorrecta3;
  
    if (pregunta.imagen) {
      style("imagen").height = "400px";
      style("imagen").width = "100%";
    } else {
      style("imagen").height = "0px";
      style("imagen").width = "0px";
    }
  
    desordenarRespuestas(pregunta);
};
  
const desordenarRespuestas = (pregunta) => {
    posibles_respuestas = [
      pregunta.respuesta,
      pregunta.incorrecta1,
      pregunta.incorrecta2,
      pregunta.incorrecta3,
    ];
    posibles_respuestas.sort(() => Math.random() - 0.5);
  
    select_id("btn1").innerHTML = posibles_respuestas[0];
    select_id("btn2").innerHTML = posibles_respuestas[1];
    select_id("btn3").innerHTML = posibles_respuestas[2];
    select_id("btn4").innerHTML = posibles_respuestas[3];
};
  
const pulsarBoton = (i) => {
    if (preguntasRespondidas === 10 || intentosRestantes === 0) {
      return; // No permitir más intentos después de 10 preguntas respondidas o si no hay más intentos
    }
  
    preguntasRespondidas++;
    if (posibles_respuestas[i] === pregunta.respuesta) {
      botones[i].style.background = "lightgreen";
      respuestasAcertadas++;
    } else {
      botones[i].style.background = "pink";
      fallos++;
      intentosRestantes--; // Disminuir los intentos restantes
  
      if (intentosRestantes === 0) {
        Swal.fire({
          title: "Juego terminado",
          text: `Puntaje: ${respuestasAcertadas} / ${fallos + respuestasAcertadas}`,
          icon: "error",
          confirmButtonText: "Reiniciar"
        }).then((result) => {
          if (result.isConfirmed) {
            reiniciarJuego();
          }
        });
  
        // Deshabilitar los botones para evitar que se siga jugando
        botones.forEach((btn) => {
            btn.disabled = true; // Deshabilitar todos los botones de respuesta
        });
  
        return; // Finalizar la función
      }
  
      // Muestra la respuesta correcta en verde
      for (let j = 0; j < botones.length; j++) {
        if (posibles_respuestas[j] == pregunta.respuesta) {
          botones[j].style.background = "lightgreen";
          break;
        }
      }
    }
  
    setTimeout(() => {
      reiniciar();
    }, 1500);
};
  
const reiniciar = () => {
    botones.forEach((btn) => {
        btn.style.background = "white";
        btn.disabled = false; // Habilitar todos los botones de respuesta
    });
  
    const intentosElement = select_id("intentos");
    intentosElement.innerHTML = `Intentos restantes: ${intentosRestantes}`; // Actualizar el contador de intentos
  
    preguntaAleatoria();
    actualizarPuntaje();
};
  
const reiniciarJuego = () => {
    respuestasAcertadas = 0;
    fallos = 0;
    preguntasRespondidas = 0;
    intentosRestantes = 5; // Reiniciar el contador de intentos
  
    // Habilitar los botones
    botones.forEach((btn) => {
        btn.disabled = false; // Habilitar todos los botones de respuesta
    });
    
    reiniciar();
};
  
const actualizarPuntaje = () => {
    const puntajeElement = select_id("puntaje");
    puntajeElement.innerHTML = `Número de aciertos: ${respuestasAcertadas} / ${preguntasRespondidas}`;
};
  
const escogerPregunta = () => {
    readJSON("base-preguntas.json")
      .then((texto) => {
        base_preguntas = texto;
        interprete_bp = JSON.parse(base_preguntas);
  
        preguntaAleatoria();
      })
      .catch((error) => {
        console.error(error);
      });
};
  
escogerPregunta();
  
// Actualizar el contador de intentos inicial
const intentosElement = select_id("intentos");
intentosElement.innerHTML = `Intentos restantes: ${intentosRestantes}`;
  
botones.forEach((btn, i) => {
    btn.addEventListener("click", () => pulsarBoton(i));
});