
const select_id = (id) => {
    return document.getElementById(id);
};
  
const style = (id) => {
    return select_id(id).style;
};
  
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
    if (posibles_respuestas[i] === pregunta.respuesta) {
      botones[i].style.background = "lightgreen";
    } else {
      botones[i].style.background = "pink";
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
    }, 2000);
};
  
const reiniciar = () => {
    for (const btn of botones) {
      btn.style.background = "white";
    }
  
    preguntaAleatoria();
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

for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", () => pulsarBoton(i));
}

