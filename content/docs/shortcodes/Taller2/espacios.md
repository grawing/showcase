# Espacios

## Planteamiento del problema
En computación, la interacción 3D es una forma de interacción hombre-máquina en la que los usuarios pueden moverse y realizar interacciones en el espacio 3D. Tanto el ser humano como la máquina procesan información en la que la posición física de los elementos en el espacio 3D es relevante.
El espacio 3D utilizado para la interacción puede ser el espacio físico real, una representación del espacio virtual simulado en el ordenador o una combinación de ambos. Cuando se utiliza el espacio físico real para la entrada de datos, el humano interactúa con la máquina realizando acciones mediante un dispositivo de entrada que detecta la posición 3D de la interacción humana, entre otras cosas. Cuando se utiliza para la salida de datos, la escena virtual 3D simulada se proyecta en el entorno real a través de un dispositivo de salida. Los principios de la interacción 3D se aplican en diversos ámbitos como el turismo, el arte, los juegos, la simulación, la educación, la visualización de información o la visualización científica.

Instrucciones para el manejo:
- Para empezar y detener la grabación del dibujo presione la letra "r".
- Para borrar el dibujo presione la letra "c".
- Para agrandar el tamaño de la brocha presione la letra "a".
- Para disminuir el tamaño de la brocha presione la letra "m".

{{< p5-global-iframe id="spaces" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" lib3="/showcase/sketches/pressure.js" width="625" height="475" >}}
// Brush controls
let color;
let brush;

let easycam;
let state;
let drawState;

let escorzo;
let points;
let record;

var pressure = -2;
let size = 1;

function setup() {
  canvas = createCanvas(600, 450, WEBGL);
  canvas.id("uiCanvas");
  // easycam stuff
  let state = {
    distance: 250,           // scalar
    center: [0, 0, 0],       // vector
    rotation: [0, 0, 0, 1],  // quaternion
  };
  easycam = createEasyCam();
  easycam.state_reset = state;   // state to use on reset (double-click/tap)
  easycam.setState(state, 1000); // now animate to that state
  escorzo = true;
  perspective();

  // brush stuff
  points = [];
  color = createColorPicker('#ed225d');
  color.position(width - 70, 40);
  
  sel = createRadio();
  sel.option('1', 'Esfera');
  sel.option('2', 'Cubo');
  sel.option('3', 'Cono');
  sel.option('4', 'Toroide');
  sel.option('5', 'Cilindro');
  sel.position(width - 80, 100);
  sel.selected('1');
  sel.style('width', '75px');
  // select initial brush
  brush = Brush;
  
  initPressure();
}

function draw() {
  lights();
  update();
  background(120);
  push();
  strokeWeight(0.8);
  stroke('magenta');
  grid({ dotted: false });
  pop();
  axes();
  for (const point of points) {
    push();
    translate(point.worldPosition);
    brush(point);
    pop();
  }
  console.log(pressure);
}

function update() {
  let dx = abs(mouseX - pmouseX);
  let dy = abs(mouseY - pmouseY);
  speed = constrain((dx + dy) / (2 * (width - height)), 0, 1);
  if (record) {
    points.push({
      worldPosition: treeLocation([mouseX, mouseY,pressure], { from: 'SCREEN', to: 'WORLD' }),
      color: color.color(),
      speed: speed,
      size: size,
      shape: sel.value()
    });
  }
}

function Brush(point) {
  push();
  noStroke();
  fill(point.color);
  if(point.shape=="1"){
    sphere(point.size);
  }else if(point.shape=="2"){
    box(point.size);
  }else if(point.shape=="3"){
    cone(point.size,point.size);
  }else if(point.shape=="4"){
    torus(point.size+1,point.size);
  }else{
    cylinder(point.size,point.size);
  }  
  pop();
}


function keyPressed() {
  if (key === 'r') {
    record = !record;
    if(record){
      easycam.removeMouseListeners();
      easycam.attachListener(easycam.renderer.elt    , 'touchend'  , easycam.mouse.touchend  , { passive:false });
      easycam.attachListener(easycam.renderer.elt    , 'touchstart'  , easycam.mouse.touchstart  , { passive:false });
    }else{
      easycam.attachMouseListeners();
    }
  }
  if (key === 'p') {
    escorzo = !escorzo;
    escorzo ? perspective() : ortho();
  }
  if (key == 'c') {
    points = [];
  }
  if (key == 'a') {
    size++;
  } 
  if (key == 'm') {
    size--;
  } 
}

function mouseWheel(event) {
  //comment to enable page scrolling
  return false;
}

function initPressure() {  
  Pressure.set('#uiCanvas', {      
    end: function(){
      pressure = 0;
      },
    change: function(force, event) {
      pressure = force;
    }
  });

  Pressure.config({
    polyfill: true, 
    polyfillSpeedUp: 1000, 
    polyfillSpeedDown: 300,
    preventSelect: true,
    only: null
       });
}
{{< /p5-global-iframe >}}

Para la realización del ejercicio se tomó como base la librería pressure.js de Javascript, con la cual fue posible realizar una medición de la presión ejercida y de esa manera evaluar este parámetro como la profundidad dentro del lienzo, así mismo se realizó la implementación de nuevas brochas añadidas desde las figuras 3D base que ofrece p5.

