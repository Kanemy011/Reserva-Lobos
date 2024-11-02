//BARRA QUE CAMBIA DE COLOR CON SCROLL: ----------------------------------------------------------

//Ponemos todos los elementos a cambiar en variables
let barra = document.getElementsByClassName("navbar")[0];
let logoN = document.getElementById("logo_negro");
let logoB = document.getElementById("logo_blanco");
const parallaxWrapper = document.querySelector('.parallax_wrapper');

// Función para manejar los cambios de estilo en la barra cuando se cambia el tamaño.
function updateNavbarStyle() {
    if (window.innerWidth < 992) {
        barra.classList.add('scrolled'); // Agrega scrolled cuando la pantalla es pequeña, ya que queremos ese estilo.
        logoN.style.display= "none"; //No queremos ningun logo cuando la barra está plegada.
        logoB.style.display="none";
        
        // Elimina el evento de scroll si estaba agregado
        parallaxWrapper.removeEventListener('scroll', handleScroll);
    } else {
        logoB.style.display="block";
        barra.classList.remove('scrolled'); // Elimina la clase cuando está por encima del umbral
        // Agrega el evento de scroll de nuevo
        parallaxWrapper.addEventListener('scroll', handleScroll);
    }
}

// Función para manejar el scroll en el contenedor parallax
function handleScroll() {
    let scrollPos = parallaxWrapper.scrollTop; //Hemos de manejar el cambio de estilo con scoll-top, porque toda la página está metida dentro de un wrapper. ScrollPosition no funcionaría ya que la página no tiene altura.
    let scrollTrigger = 400; //El evento ocurrirá a partir de este punto de scroll.

    if (scrollPos > scrollTrigger) {
        barra.classList.add('scrolled'); // Agrega la clase que cambia el fondo
        logoN.style.display= "block"; //Se muestra el logo negro
        logoB.style.display="none"; //Se oculta el blanco.
    } else {
        barra.classList.remove('scrolled'); // Elimina la clase cuando está por encima del umbral
        logoN.style.display= "none";
        logoB.style.display="block";//Vuelve el logo blanco.
    }
}

// Inicializar estilos y eventos
function init() {
    // Actualizar el estilo de la barra al cargar
    updateNavbarStyle();
    
    // Escuchar el evento de resize
    window.addEventListener('resize', updateNavbarStyle);

    // Agregar el evento de scroll solo si es grande
    if (window.innerWidth >= 992) {
        parallaxWrapper.addEventListener('scroll', handleScroll);
    }
}
// Ejecutamos la función de inicialización
init();


//QUIZ ---------------------------------------------------------------------------

// Array con los nombres de los archivos HTML de las preguntas y otros pasos del quiz
const paginasQuiz = [
    'quiz/quiz.html',  // Página inicial del quiz
    'quiz/q1.html',    // Pregunta 1
    'quiz/q2.html',    // Pregunta 2
    'quiz/q3.html',    // Pregunta 3
    'quiz/q4.html',    // Pregunta 4
    'quiz/q5.html',    // Pregunta 5
    'quiz/q6.html',    // Pregunta 6
    'quiz/results.html', // Página de resultados
    'quiz/no.html',     // Página de resultado "Omega"
    'quiz/maybe.html',  // Página de resultado "Beta"
    'quiz/yes.html'     // Página de resultado "Alpha"
];

let paginaActual = 0; // Índice de la página actual
const quizContainer = document.getElementById('quiz-container'); // Contenedor del quiz

// Función para cargar dinámicamente una página HTML en el contenedor
function cargarPagina(index) {
    if (index >= 0 && index < paginasQuiz.length) {
        fetch(paginasQuiz[index]) // Hacemos la petición fetch para cargar el archivo HTML correspondiente
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar la página: ' + response.statusText);
                }
                return response.text(); // Convertimos la respuesta a texto (HTML)
            })
            .then(data => {
                quizContainer.innerHTML = data; // Insertamos el contenido HTML dentro del contenedor
                
                // Asignar event listeners después de cargar cada página
                const siguienteBtn = document.getElementById('siguiente');
                if (siguienteBtn) {
                    siguienteBtn.addEventListener('click', avanzar); // Conectamos el botón a la función avanzar
                }

                const retrocederBtn = document.getElementById('retroceder');
                if (retrocederBtn) {
                    retrocederBtn.addEventListener('click', retroceder); // Conectamos el botón a la función retroceder
                }

                // Asignar event listener para el botón de inicio
                const startBtn = document.getElementById('start');
                if (startBtn) {
                    startBtn.addEventListener('click', () => {
                        paginaActual = 1; // Establecer a la primera pregunta
                        cargarPagina(paginaActual); // Cargar la primera pregunta
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar la página:', error);
            });
    }
}

// Función para avanzar a la siguiente página del quiz
function avanzar() {
    if (paginaActual < paginasQuiz.length - 1) {
        paginaActual++;
        cargarPagina(paginaActual); // Cargar la siguiente página dentro del contenedor
    }
}

// Función para retroceder a la página anterior
function retroceder() {
    if (paginaActual > 0) {
        paginaActual--;
        cargarPagina(paginaActual); // Cargar la página anterior dentro del contenedor
    }
}

function showResults() {
    let count = Number(sessionStorage.getItem("count")); // Obtener el puntaje actual
    if (!count || count <= 2) {
        paginaActual = paginasQuiz.length - 3; // Índice de 'no.html'
    } else if (count > 2 && count <= 4) {
        paginaActual = paginasQuiz.length - 2; // Índice de 'maybe.html'
    } else {
        paginaActual = paginasQuiz.length - 1; // Índice de 'yes.html'
    }
    cargarPagina(paginaActual); // Cargar la página de resultados
}

function resetQuiz() {
    sessionStorage.clear(); // Limpiar el sessionStorage
    paginaActual = 0; // Restablecer a la página inicial
    cargarPagina(paginaActual); // Cargar la página inicial del quiz
}

// Inicializamos cargando la página de inicio del quiz
cargarPagina(paginaActual);

console.log("JavaScript enlazado correctamente.");

//BOTÓN GALERÍA ----------------------------------------------------------------------
const verMasBtn = document.querySelector('.ver-mas-btn');
const imagenesOcultas = document.querySelectorAll('.galeria ul li.hidden-img');

// Agregar evento de click al botón para mostrar las imágenes ocultas
verMasBtn.addEventListener('click', () => {
  imagenesOcultas.forEach(imagen => {
    imagen.style.display = 'block'; // Mostrar cada imagen oculta
    imagen.classList.remove('hidden-img'); // Eliminar la clase de oculto
  });

  // Ocultar el botón después de mostrar las imágenes
  verMasBtn.style.display = 'none';
  
});

//Función para quitar el botón cuando la pantalla es grande
document.addEventListener("DOMContentLoaded", function(){
    function mostrarBoton() {
        if (window.innerWidth > 768){
            verMasBtn.style.display = "none";
        } else {
            verMasBtn.style.display = "block";
        }
    }
    mostrarBoton();
    window.addEventListener("resize", mostrarBoton);
});


//MAPA ------------------------------------------------------------------

    const images = document.querySelectorAll('#group-4 .wolfs-images li img');
    const mainImage = document.querySelector('#group-4 .wolfs-map img'); // Imagen de la derecha

    images.forEach(img => {
        img.addEventListener('click', () => {
            mainImage.src = img.src;
        });
    });

//MODAL -------------------------------------------------------------

// Obtener elementos del DOM
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalSpan = document.querySelector(".close");


// Abrir el modal al hacer clic en el botón
openModalBtn.onclick = function() {
    modal.style.display = "flex";
}

// Cerrar el modal al hacer clic en la 'x'
closeModalSpan.onclick = function() {
    modal.style.display = "none";
}

// Cerrar el modal si el usuario hace clic fuera del contenido del modal
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

console.log ("Puedo llegar hasta el final");