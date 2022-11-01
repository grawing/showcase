# Espacios

## Planteamiento del problema
En computación, la interacción 3D es una forma de interacción hombre-máquina en la que los usuarios pueden moverse y realizar interacciones en el espacio 3D. Tanto el ser humano como la máquina procesan información en la que la posición física de los elementos en el espacio 3D es relevante.
El espacio 3D utilizado para la interacción puede ser el espacio físico real, una representación del espacio virtual simulado en el ordenador o una combinación de ambos. Cuando se utiliza el espacio físico real para la entrada de datos, el humano interactúa con la máquina realizando acciones mediante un dispositivo de entrada que detecta la posición 3D de la interacción humana, entre otras cosas. Cuando se utiliza para la salida de datos, la escena virtual 3D simulada se proyecta en el entorno real a través de un dispositivo de salida. Los principios de la interacción 3D se aplican en diversos ámbitos como el turismo, el arte, los juegos, la simulación, la educación, la visualización de información o la visualización científica.

## Antecedentes

### ¿Qué es el diseño 3D y qué tipo de software se utiliza para crear modelos 3D?

El diseño 3D consiste en utilizar software para crear una representación matemática de un objeto o una forma tridimensionales. El objeto creado se denomina modelo 3D; estos modelos tridimensionales se usan para el diseño generado por computadora. El diseño 3D se usa en una variedad de industrias para ayudar a los artistas a desarrollar, comunicar, documentar, analizar y compartir sus ideas.

### Ejemplos de softwares

#### Architecture, Engineering & Construction Collection
Herramientas BIM y CAD para diseñadores, ingenieros y contratistas, que incluyen Revit, AutoCAD, Civil 3D, entre otras cosas. La AEC Collection ofrece a diseñadores, ingenieros y contratistas un conjunto de herramientas BIM y CAD respaldadas por un entorno de datos común basado en la nube que facilita la entrega de proyectos desde el diseño inicial hasta la construcción.

#### Autocad
Software de diseño CAD en 2D y 3D. La suscripción incluye aplicaciones y conjuntos de herramientas especializadas de AutoCAD.

#### Revit
Planifica, diseña, construye y administra edificios con poderosas herramientas para Modelado de información para la construcción.

### Funcion pressure


{{< details title="Código en p5.js" open=false >}}
```js
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
```
{{< /details >}}

## Desarrollo

Para la realización del ejercicio se tomó como base la librería pressure.js de Javascript, con la cual fue posible realizar una medición de la presión ejercida y de esa manera evaluar este parámetro como la profundidad dentro del lienzo, así mismo se realizó la implementación de nuevas brochas añadidas desde las figuras 3D base que ofrece p5.

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
let color;
let cam1, cam2;
let length = 1000;
let fovy;
let sel;
let easycam; 
let state, state2; 
let drawState;
let escorzo; 
let points; 
let record = false;
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
  state2 = cam2.getState();
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

function update() {
  let dx = abs(mouseX - pmouseX);
  let dy = abs(mouseY - pmouseY);
  let speed1 = constrain((dx + dy) / (2 * (width - height)), 0, 1);
  if (record) {
    points.push({
      worldPosition: fbo1.treeLocation([mouseX, mouseY,pressure], { from: 'SCREEN', to: 'WORLD' }),
      color: color.color(),
      speed: speed1,
      size: size,
      shape: sel.value()
    });
  }
}

function draw() {
  update();
  fbo1.background(140);
  fbo1.reset();
  fbo1.perspective(fovy.value());
  fbo1.axes();
  fbo1.grid();
  scene1();
  beginHUD();
  image(fbo1, 0, 0);
  endHUD();
  fbo2.background(90);
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
    //fbo2.brush(point);
    fbo2.pop();
  }
}


function keyPressed() { 
  if (key === 'r') { 
    record = !record;
    if(record){ 
      cam1.removeMouseListeners();     
      cam1.attachListener(cam1.renderer.elt , 'touchend' , cam1.mouse.touchend , { passive:false });
      cam1.attachListener(cam1.renderer.elt , 'touchstart' , cam1.mouse.touchstart , { passive:false }); 
    }else{ 
      console.log(points.length);
      cam1.attachMouseListeners(this._renderer); 
    }
  }
  if (key === 'p') { 
      escorzo = !escorzo; escorzo ? perspective() : ortho();
  } if (key == 'c') { 
    points = []; 
  } if (key == 'a') {
    size++; 
  } if (key == 'm') {
    size--; 
  } if(key =='g'){
    cam2.state_reset = state2;
  } 
}

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


## Conclusiones
Basados en el desarrollo del taller, encontramos interés en el desarrollo de modelos 3D y software especializado que permita trabajar con un mayor grado de libertad. Consideramos que esta es una aproximación a lo que puede ser nuevas herramientas y áreas de trabajo en las cuales se permita manipular entornos inmersivos para la construcción de prototipos y modelos de la realidad que permitan avanzar en áreas tanto científicas como del entretenimiento, ya sean en animación de series, videojuegos, entre otros. Dado que este tipo de herramientas ofrecen la capacidad al usuario de crear mundos virtuales que puedan usarse con múltiples fines. Para trabajos futuros creemos que es importante evaluar la comodidad con la cual se manejan los controles, realizar estudios sobre su “ergonomía” e intuición para el usuario y experimentar si dicha percepción aumenta o disminuye con el uso continuo de la herramienta. Adicionalmente se promueve la idea de añadir más capacidades al entorno, como podría ser agregar la capacidad de añadir puntos de luces adicionales, permitir subir modelos ya prefabricados, guardar modelos hechos en la herramienta o que exista la posibilidad de crear su propia brocha.

### Algunos dibujos
<br>
![arbol](/showcase/sketches/arbol_ex.png 'arbol') <br>
![barco](/showcase/sketches/barco_ex.png 'barco') <br>
