# Espacios

## Planteamiento del problema
En computación, la interacción 3D es una forma de interacción hombre-máquina en la que los usuarios pueden moverse y realizar interacciones en el espacio 3D. Tanto el ser humano como la máquina procesan información en la que la posición física de los elementos en el espacio 3D es relevante.
El espacio 3D utilizado para la interacción puede ser el espacio físico real, una representación del espacio virtual simulado en el ordenador o una combinación de ambos. Cuando se utiliza el espacio físico real para la entrada de datos, el humano interactúa con la máquina realizando acciones mediante un dispositivo de entrada que detecta la posición 3D de la interacción humana, entre otras cosas. Cuando se utiliza para la salida de datos, la escena virtual 3D simulada se proyecta en el entorno real a través de un dispositivo de salida. Los principios de la interacción 3D se aplican en diversos ámbitos como el turismo, el arte, los juegos, la simulación, la educación, la visualización de información o la visualización científica.

Instrucciones para el manejo:
- Para empezar y detener la grabación del dibujo presione la letra "r".
- Para borrar el dibujo presione la letra "c".
- Para agrandar el tamaño de la brocha presione la letra "a".
- Para disminuir el tamaño de la brocha presione la letra "m".

{{< p5-global-iframe id="spaces" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" lib3="/showcase/sketches/pressure.js" width="1020" height="520" >}}
// Brush controls
'use strict';

/*
*/

let fbo1, fbo2;
let cam1, cam2;
let length = 1000;
let fovy;
let sel;
let easycam; 
let state; 
let drawState;
let escorzo; 
let points; 
let record;
let size = 1;
const SPEED = 5;
var pressure = -2; 

function setup() {
  canvas = createCanvas(length, length / 2);
  // frame buffer object instances (FBOs)
  fbo1 = createGraphics(width / 2, height, WEBGL);
  //fbo1.id("uiCanvas")
  fbo2 = createGraphics(width / 2, height, WEBGL);
  // FBOs cams
  cam1 = new Dw.EasyCam(fbo1._renderer, { distance: 200 });
  let state1 = cam1.getState();
  cam1.attachMouseListeners(this._renderer);
  cam1.state_reset = state1;   // state to use on reset (double-click/tap)
  cam1.setViewport([0, 0, width / 2, height]);
  escorzo = true;
  fbo1.perspective();
  cam2 = new Dw.EasyCam(fbo2._renderer, { rotation: [0.94, 0.33, 0, 0] });
  cam2.attachMouseListeners(this._renderer);
  let state2 = cam2.getState();
  cam2.state_reset = state2;   // state to use on reset (double-click/tap)
  cam2.setViewport([width / 2, 0, width / 2, height]);
  document.oncontextmenu = function () { return false; }
  // scene
  sel = createRadio(); sel.option('1', 'Esfera'); sel.option('2', 'Cubo'); sel.option('3', 'Cono'); sel.option('4', 'Toroide'); sel.option('5', 'Cilindro');
  sel.position( (width / 3) +60, (height/5) -20); 
  sel.selected('1'); sel.style('width', '85px');
  fovy = createSlider(PI / 12, PI * (11 / 12), PI / 3, PI / 48);
  fovy.position((width/2), 10);
  fovy.style('width', '80px');
  //brush
  points = [];
  color = createColorPicker('#ed225d');
  color.position(width/2 - 70, 40);
  // select initial brush
  fbo1.brush = Brush;
  //fbo1.initPressure();
}

function draw() {
  fbo1.background(200, 125, 115);
  fbo1.reset();
  fbo1.perspective(fovy.value());
  fbo1.axes();
  fbo1.grid();
  scene1();
  beginHUD();
  image(fbo1, 0, 0);
  endHUD();
  fbo2.background(130);
  fbo2.reset();
  fbo2.axes();
  fbo2.grid();
  scene2();
  fbo2.push();
  fbo2.fill(255, 0, 255, 100);
  fbo2.viewFrustum({ fbo: fbo1, bits: Tree.BODY });
  fbo2.pop();
  beginHUD();
  image(fbo2, width / 2, 0);
  endHUD();
}

function scene1() {
  //----------------
  fbo1.push();
  fbo1.strokeWeight(0.8);
  fbo1.stroke('magenta');
  fbo1.grid({ dotted: false });
  fbo1.pop();
  fbo1.axes();
  for (const point of points) {
    fbo1.push();
    fbo1.translate(point.worldPosition);
    fbo1.brush(point);
    fbo1.pop();
  }
}

function scene2() {
  for (const point of points) {
    fbo2.push();
    fbo2.translate(point.worldPosition);
    fbo2.pop();
  }
}


function keyPressed() { 
  if (key === 'r') { 
    record = !record;
    if(record){ 
      fbo1.easycam.removeMouseListeners();     
      fbo1.easycam.attachListener(easycam.renderer.elt , 'touchend' , easycam.mouse.touchend , { passive:false });
      fbo1.easycam.attachListener(easycam.renderer.elt , 'touchstart' , easycam.mouse.touchstart , { passive:false }); 
    } else{ 
      easycam.attachMouseListeners(); 
    } if (key === 'p') { 
      escorzo = !escorzo; escorzo ? perspective() : ortho();
    } if (key == 'c') { 
      points = []; 
    } if (key == 'a') {
      size++; 
    } if (key == 'm') { size--; }
    if(key =='g'){cam2.state_reset = state2;} 
  }}

function Brush(point) {
  fbo1.push(); 
  fbo1.noStroke(); 
  fbo1.fill(point.color); 
  if(point.shape=="1"){ 
    fbo1.sphere(point.size); 
  }else if(point.shape=="2"){ 
    fbo1.box(point.size); 
  }else if(point.shape=="3"){ 
    fbo1.cone(point.size,point.size); 
  }else if(point.shape=="4"){ 
    fbo1.torus(point.size+1,point.size); 
  }else{ fbo1.cylinder(point.size,point.size); }
  fbo1.pop();
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

