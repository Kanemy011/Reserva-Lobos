// Obtener elementos del DOM
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalSpan = document.querySelector(".close");



//CODI// ----------------------------------------------------------------------------------
//VARIABLES GLOBALS// .....................................................................
var gandalf = []; // Per emmagatzemmar les imatges en forma de gandalf que fan de marc
var nazgulR = []; // Per guardar els fotogrames dels nazgûl en moviment (a la dreta).
var nazgulL = []; // Per guardar els fotogrames dels nazgûl en moviment (a l'esquerra).
var clouds = []; // Array d'imatges de núvols
var cloudX = []; // Array de posicions X dels núvols
var cloudY = []; // Array de posicions Y dels núvols
var cloudVel = []; // Array de velocitats dels núvols
var bmountains; // Imatge de les muntanyes posteriors.
var fmountains; // Imatge de les muntanyes de davant (incloent la torre de Barad-dûr)
var fellowship; // Imatge de la Companyia de l'Anell
var lemon; // Imatge de l'ull (més aviat llimó) sense la pupil·la.
var ring; // Imatge de les lletres de l'anell
var gradient; // Imatge del cel del fons.
var font; // Font "ringbearer" per les lletres del títol
var eyeSize = 40; // Tamany de l'ull (més ben dit, l'àrea imaginària on es pot moure la pupil·la)
var pupilSize = 25; // Tamany de la pupil·la.
var maxDist = eyeSize / 4; // Desplaçament màxim de la pupil·la des del centre de l'ull.
var pupilX; // Posició X pupil·la.
var pupilY; // Posició Y pupil·la.
var r = 0; // Rotació de l'anell.
var citas = [ //Array estàtic de frases (cites) que surten al fer clic al títol.
  "My preciousss",
  "Not all those who wander are lost",
  "Even the smallest person can change the course of the future",
  "There is some good in this world, and it's worth fighting for",
  "One ring to rule them all"
];
var currentIndex = 0; // Índex de la cita actual
var textToShow = citas[currentIndex]; // Cita actual
var opacities = []; // Array dinàmic de les opacitats de les lletres de la cita.
var maxOpacity = 255; // Opacitat màxima de les lletres.
var opacityIncrement = 8; // Increment de la opacitat a cada frame. 
var textSizeValue = 20; // Tamany del text de la cita.
var yPosition = 1230; // Posició y de la cita.
var delay = 5; // Retràs de l'aparició de l'animació de cada lletra de la cita. Quan menor sigui menys temps tardaran les lletres en aparèixer (si es 0 surtiran totes les lletres de cop).
var showCita = false; // Booleana que determina si la cita es mostra o no.
var gIndex = 0; //Index per a l'array del gandalf.
var frameDelay = 6; //Variable per ajustar la velocitat a la que va l'animació del gandalf.
var RnIndex = 0; //Index per a l'array nazgul (dret).
var LnIndex = 0; //Index per a l'array nazgul (esquerre).
var nazgulRX = 0; //Posició nazgûl (dret)
var nazgulLX = 720; //Posició nazgûl (esquerre)
var nazgulD = "RIGHT" //Direcció del nazgul que es mostra en pantalla.

//FUNCIONS PREDEFINIDES// ------------------------------------------------------------------
function preload (){ //Aquí carreguem les imatges i la font. Les igualem amb les seves respectives variables per fer-les servir més endavant, o les fiquem dins dels seu array si escau.
    //Ja que les imatges del gandalf estan numerades del 0 al 16 (3gandalf0, 3gandalf1, 3gandalf2...) he fet servir un bucle for per carregarles de cop i no escriure 17 línies de codi.
    for (var g = 0; g < 16; g++) { 
    gandalf[g] = loadImage('p5js/assets/3gandalf'+g+'.png'); //Fiquem cada una dins de l'array 'gandalf'.
  }
  for (var i = 0; i < 8; i++) { //Aquí més del mateix però amb els núvols. Com comencen per 1, li sumem 1 a la i
    clouds[i] = loadImage('p5js/assets/2cloud'+(i+1)+'.png'); //Fiquem cada una dins de l'array 'clouds'.
  }
  for (var n = 0; n < 12; n++) { //Igual per als nazgûl.
    nazgulR[n] = loadImage('p5js/assets/nazgul'+(n+1)+'a.png'); //Fiquem cada una dins de l'array 'nazgulR'.
  }
    for (var n2 = 0; n2 < 12; n2++) { //Igual per als nazgûl.
    nazgulL[n2] = loadImage('p5js/assets/nazgul'+(n2+1)+'b.png'); //Fiquem cada una dins de l'array 'nazgulL'.
  }
  gradient = loadImage ('p5js/assets/gradient.png')
  bmountains = loadImage ('p5js/assets/backmountains.png')
  fmountains = loadImage ('p5js/assets/frontmountains.png')
  fellowship = loadImage ('p5js/assets/fellowship.png')
  ring = loadImage ('p5js/assets/ring2.png')
  lemon = loadImage ('p5js/assets/lemon.png')
  font = loadFont ('p5js/RINGM___.TTF') //Font "ringbearer", importada per al títol.
}

function setup() {
  let myCanvas = createCanvas(720, 1280); // Dimensiones iniciales
  myCanvas.parent("canvas-container"); // Asignación del canvas al contenedor
  imageMode (CENTER) // rectMode (CENTER) però per a imatges
  textAlign (CENTER) // Volem que el text es dibuixi centrat.
  angleMode (DEGREES) // No he fet servir radiants en cap dels exercicis que he fet. Aquest no serà diferent.
  for (let i = 0; i < textToShow.length; i++) { // Inicialitzem l'array de les opacitats segons la llargària del primer text mostrat, ficant 0 a cada una. 
    opacities.push(0);
  }
  initialClouds() //Creem les posicions i velocitats dels núvols.
}

function draw() {
eyeX = width / 2-2; // Posició X de l'ull
eyeY = height / 3 +50; // Posició Y de l'ull
  background(220); // Background que no serveix per a res.
  layers() //Aquí van les imatges i altres elements visuals que hem creat, a capes.
  title() //El títol i el seu comportament
  cita() //El display de la cita que apareix.
}

//FUNCIONS PERSONALITZADES// -----------------------------------------------------------
function layers (){// Totes les imatges o dibuixos (per a draw)
  image (gradient,width/2,height/2)
  movingClouds()
  image (bmountains,width/2, height/2)
  if (nazgulD == "LEFT"){ //Si la direcció es "LEFT" es mostrarà el nazgûl esquerre.
    nazgulLeft()
  }
  spiningRing()
  image (fmountains,width/2, height/2)
  eyeGlow()
  image (lemon,width/2,height/2)
  image (fellowship,width/2, height/2)
  theEye()
  if (nazgulD == "RIGHT"){ //Si la direcció es "RIGHT" es mostrarà el nazgûl dret.
    nazgulRight()
  }
   if (frameCount % frameDelay == 0) { //Fem servir mòduls framecount per a que s'incrementi l'index més a poc a poc.
    gIndex = (gIndex + 1) % gandalf.length; //Limitem amb %gandalf.lenght per no passarnos de la longitud màxima.
  }
  image (gandalf[gIndex % gandalf.length],width/2, height/2) //Dibuixem la imatge (que anirà cambiant a cada iteració)
}

function nazgulRight(){//Repetim el procès que hem fet amb el gandalf però amb els nazgûl. (per a draw/layers)
  
  if (frameCount % frameDelay == 0) {
    RnIndex = (RnIndex + 1) % nazgulR.length;
  }
  nazgulRX = nazgulRX +2 //Incrementem la posició x per aconseguir un desplaçament horitzontal.
  image (nazgulR[RnIndex % nazgulR.length], nazgulRX, height/2, 250, 250)
  
  if (nazgulRX > width){ //Quan el nazgûl arriba al final, la direcció es canvia a "LEFT" (per tant aquest deixa de mostrar-se) i la seva posició es reinicia. 
    nazgulD = "LEFT"
    nazgulRX = 0
  }
}

function nazgulLeft(){ //(per a draw/layers)
    if (frameCount % frameDelay == 0) {
    LnIndex = (LnIndex + 1) % nazgulL.length;
  }
  nazgulLX = nazgulLX -1.2
push();
  translate(nazgulLX + 250, height / 2); // Fem servir un translate, ya que les coordenades s'invertiràn.
  scale(-1, 1); // Fem servir el scale negatiu per invertir horitzontalment.
  image(nazgulL[LnIndex % nazgulL.length], 0, -125, 200, 200); // Nazgûl invertit.
  pop();
  if (nazgulLX < -250){ //Fem igual que abans però al passar de -250 (perque el scale ho ha alterat), i reiniciem la posició igualant-la amb width.
    nazgulD = "RIGHT"
    nazgulLX = width
  }
}

function initialClouds() { //Posicions i velocitats dels núvols (per a setup)
  for (var i = 0; i < 8; i++) { //Generem 8 posicions x aleatories per a cada núvol, entre 0 i l'amplada.
    cloudX[i] = random (0,width)
  }
  cloudVel = [ // Velocitats fixes
    0.07,
    0.05,
    0.06,
    0.08,
    0.07,
    0.1,
    0.09,
    0.05, 
  ]
    cloudY = [ // Posicions y fixes
    650,
    570,
    470,
    430,
    400,
    370,
    320,
    240, 
  ]
}
function movingClouds() { //Animacions i display dels núvols (per a draw/layers)
  for (var c = 0; c < clouds.length; c++) { //Recorrem tot el array dels núvols.
  cloudX[c] = cloudX[c]+cloudVel[c] //Animació de cada núvol en específic. Simplement sumem la velocitat a la posició x per aconseguir un desplaçament en horitzontal.
    if (cloudX[c] > width-50) { // Si el núvol es pasa de llarg, la posició x torna a iniciarse al principi de tot. Així sembla que hi han núvols infinits (tot i que son sempre els mateixos)
      cloudX[c] = 30
    }
    image(clouds[c], cloudX[c], cloudY[c]); //Generem la imatge del núvol.
  }
}

function title (){ //El títol "The Lord of the Rings" (per a draw)
  push()
  if (mouseX > 200 && mouseX < 600 && mouseY > 1080 && mouseY < 1200){ // Si el cursor està dins d'una àrea clicable, ho manifestem augmentant el tamany de tot el text i afegint una brillantor (shadowBlur).
    scale (1.1) // Augment de tamany
    translate (-30,-100) // Corregim el desplaçament que s'ha produït amb scale.
    cursor (HAND) // Cambiem el cursor a una mà per a que el usuari vegi que es pot clicar.
    drawingContext.shadowBlur = 18 // Extensió de la brillantor (més gran = més extens)
    drawingContext.shadowColor = color (255) // Color de la brillantor (en blanc)
  }
  else {
    cursor (ARROW) // Si no està a l'àrea, el cursor es una fletxa normal.
  }
  translate (-15,15) // Això ho he posat per modificar la posició original i no tenir que cambiar totes les coordenades dels cinc textos creats.
  textSize (50) // Tamany de la font.
  textFont (font) // Fem servir la font que hem descarregat.
  fill (255)
  text ("Lord   RingS", width/2,1135)
  textSize (20)
  text ("the", width/2-90, 1095)
  text ("of", width/2+6,1120)
  text ("the", width/2+6,1135)
  textSize (17)
  text ("the fellowship of the ring", width/2+10,1160)
  pop ()
}
function cita (){ //Cita que apareix quan es clica al títol (per a draw)
  textFont ("monospace") // La font de sistema que he escollit es "monospace". És una font molt especial, ja que té la mateixa separació entre caràcters, al contrari que la majoria de fonts convencionals. Si fessim servir qualsevol altra les lletres es solaparien, o les separacions quedarien una mica rares. Gràcies a ella ens ahorrem tot el calvari de crear espais diferents per a cada lletra.
  textSize (textSizeValue) //Tamany variable segons el tipus de cita.
  
  if (showCita == true){ // Comença a pujar la opacitat de la cita només si la booleana és true.
  for (var i = 0; i < opacities.length; i++) { //Recorrem tot el array d'opacitats.
    
    if (frameCount > i * delay) { // Si el frameCount (recompte de frames que han passat) és més gran que el delay de cada lletra (aconseguit multiplicant per la variabe i, de forma que a la primera lletra és 0, a la segona és 5, a la tercera 10, etc.) la opacitat comença a incrementar-se.
      
      if (opacities[i] < maxOpacity) { // Mentre no s'arriba al màxim va pujant
        opacities[i] += opacityIncrement;}
      else if (opacities[i] > maxOpacity) { //Quan s'arriba al màxim s'iguala i es surt del bucle
          opacities[i] = maxOpacity;
        }
    }
  }
  var x = width / 2 - (textWidth(textToShow) / 2); //Posició x en el centre del canvas. Li restem l'amplada del text entre dos (textWidth(textToShow) / 2) perquè del contrari ens escriuria el text com un textAlign (LEFT). Així queda centrat.
    
// Vale, ara ve la part més rara. Recordem que la variable textToShow és un string, perque a les variables globals hem dit que textToShow = citas[currentIndex]. A javascript es pot comprobar la longitud d'un string de la mateixa manera que ho fariem amb un array, de forma que cada caràcter es va contant començant per 0. Amb un bucle recorrem tots els càracters de la cita segons la longitud d'aquesta (i < textToShow.length). Mentre anem recorrent cada una de les posicions, guardem la lletra d'aquella posició en específic en una variable (var letter = textToShow.charAt(i);). El .charAt(i) el fem servir per indicar que volem el caràcter en la posició "i" de l'string textToShow. Després fem servir un fill blanc amb la alpha d'opacitites[], la qual anirà augmentant (com li hem dit abans). Dibuixem la lletra amb text() i finalment incrementem la variable x definida previament, sumant-li un valor que dependrà de la longitud (textWidth) de la lletra actual, així la pròxima lletra es dibuixarà al costat.
  for (let i = 0; i < textToShow.length; i++) {
    var letter = textToShow.charAt(i);
    fill(255, opacities[i]); 
    text(letter, x, yPosition);
    x += textWidth(letter);
  }
  }
  //          ____ __
  //         { --.\  |          .)%%%)%%
  //          '-._\\ | (\___   %)%%(%%(%%%
  //              `\\|{/ ^ _)-%(%%%%)%%;%%%
  //          .'^^^^^^^  /`    %%)%%%%)%%%'
  //         //\   ) ,  /       '%%%%(%%'
  //   ,  _.'/  `\<-- \<
  //    `^^^`     ^^   ^^
}

function theEye(){ //L'ull que segueix el ratolí (per a draw/layers)

//  ellipse(eyeX, eyeY, eyeSize, eyeSize); // Elipse imaginària on es mou l'ull.

if (mouseX > 5 && mouseX < width && mouseY > 5 && mouseY < height){ //Només volem que l'ull es mogui si el ratolí està dins del canvas (excepte un petit marc de 5 píxels que he ficat per detectar millor quan surt)
  
//Mapegem les posicions xy de la pupil·la en base a les coordenades del ratolí per aconseguir una animació fluida. Segons el valor mouseX/Y, essent que aquest està entre 0 i width/height, la pupil·la es mourà en un rang entre el centre de l'ull (eyeX/Y) menys la distància màxima (eyeSize/4) i aquest centre més la distància màxima. 
  pupilX = map(mouseX, 0, width, eyeX - maxDist, eyeX + maxDist);
  pupilY = map(mouseY, 0, height, eyeY - maxDist, eyeY + maxDist);
  
}
else { // Al sortir el ratolí del canvas, l'ull torna al centre.
  pupilX = eyeX
  pupilY = eyeY
}
  // Dibuix de l'ull
  noStroke()
  fill(255,0,0);
  ellipse(pupilX, pupilY, pupilSize, pupilSize); // Cercle (iris) vermell del fons.
  push()
  translate (pupilX,pupilY) //Translate per rotar.
  fill(255,255,0)
  rotate (90)
  arc (0, 0, pupilSize+3, pupilSize/4+3,180,0) //Arc gran groc de la pupil·la.
  rotate (180)
  arc (0, 0, pupilSize+3, pupilSize/4+3,180,0) // L'altre però al revès.
  pop()
  
  //Fem dos arcs més iguals que els grocs però més petits (i negres)
  push()
  translate (pupilX,pupilY)
  fill(0)
  rotate (90)
  arc (0, 0, pupilSize, pupilSize/4,180,0) 
  rotate (180)
  arc (0, 0, pupilSize, pupilSize/4,180,0)
  pop()
}

function eyeGlow (){ // Brillantor de l'ull groga del fons (per a draw/layers)
var step = 0; //Variable que anirem augmentant +1 a cada iteració (per al tamany del cercles)
var radius = 100; // Radi de la llum
var alp = 255; // Alpha (opacitat) inicial
  
//Fem un degradat circular amb un bucle while. Mentre el valor de step no arribi al del radi de la llum, el bucle anirà dibuixant cercles sense fill, cada cop més grans i transparents.
  while (step < radius) {
    alp = map(step, 0, radius, 200, 0); // Mapeja la opacitat (de 200 a 0) segons el tamany dels cercles (de 0 a radius).
    var c = color(255, 150, 0, alp); // Color taronja amb opacitat variable
    noFill();
    stroke(c);
    ellipse(eyeX, eyeY, step * 2, step * 2);
    step++; // Incrementem la distancia del cercle al centre +1.
  }
}
function spiningRing(){ //Anell que va girant (per a draw/layers)
  push()
  translate(width/2,height/2+120) //Translate per rotar
  rotate(r)
  drawingContext.shadowBlur = 15 //Fem que les lletres brillin una mica de color taronja.
  drawingContext.shadowColor = color (255,150,0)
  image (ring,0,0)
  pop()
  r = r +0.1 //Augmentem el valor r molt poquet en cada iteració, per girar molt a poc a poc.
}

//F. MOUSEPRESSED// -------------------------------------------------------------------------
function mousePressed() {
  if (mouseX > 200 && mouseX < 600 && mouseY > 1080 && mouseY < 1200){ //Si es fa clic a dins del títol...
  showCita = true; //Es cambia la booleana a true (i per tant es dibuixa la cita)
  frameCount = 0; //Resetegem el framecount.
  currentIndex = (currentIndex + 1) % citas.length; //Avancem a la cita següent (el % citas.length evita que es passi de la llargària)
    
switch (currentIndex) {// Fem servir un switch case per canviar el tamany de la lletra de cada cita. Cada case és l'índex de l'array, començant per 0. 
  case 0:
    textSizeValue = 23; // "My preciousss"
    break;
  case 1:
    textSizeValue = 20; // "Not all those who wander are lost"
    break;
  case 2:
    textSizeValue = 18; // "Even the smallest person..."
    break;
  case 3:
    textSizeValue = 17; // "There is some good in this world..."
    break;
  default:
    textSizeValue = 20; // "One ring to rule them all"
}

//Actualitzem i reiniciem tot el que té a veure amb la cita, ja que cambia el text a mostrar i la quantitat d'opacitats per caràcter necessàries.
  textToShow = citas[currentIndex]; // La cita a mostrar serà diferent
  opacities = []; //Buidem el array d'opacitats
  for (let i = 0; i < textToShow.length; i++) { //El tornem a plenar
    opacities.push(0);
   }
   }
}

//TUTORIALS QUE M'HE VIST PER FER AIXÒ:// -----------------------------------------------
//https://www.youtube.com/watch?v=iIWH3IUYHzM&list=LL&index=9