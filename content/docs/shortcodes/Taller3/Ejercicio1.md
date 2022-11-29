# Masking

## Planteamiento del problema

En el procesamiento de imágenes, un kernel, matriz de convolución o máscara es una pequeña matriz que se utiliza para desenfocar, afinar, dar relieve, detectar bordes, etc. Esto se consigue haciendo una convolución entre el núcleo y una imagen.
La expresión general de una convolución es

![funcion](/showcase/sketches/funcion.png 'funcion')

Donde g(x,y) es la imagen filtrada, f(x,y) es la imagen original, w es el kernel del filtro. 
Dependiendo de los valores de los elementos, un kernel puede causar una amplia gama de efectos.

Identidad. En matemáticas, una función de identidad, también llamada relación de identidad, mapa de identidad o transformación de identidad, es una función que siempre devuelve el valor que se utilizó como argumento, sin cambios. Es decir, cuando f es la función identidad, la igualdad f(X) = X es verdadera para todos los valores de X a los que se puede aplicar f. En este caso el kernel usado es el siguiente: 

![identidad](/showcase/sketches/identidad.png 'identidad')

Como resultado se obtendrá nuevamente la imagen original, como la descripción matemática lo indica, ya que no se hace ninguna modificación a la matriz y se deja el elemento original sin modificación alguna en la misma posición.

Detección de crestas. En el procesamiento de imágenes, la detección de crestas es el intento de localizar crestas en una imagen, definidas como curvas cuyos puntos son máximos locales de la función, similares a las crestas geográficas.
En este caso el kernel usado es el siguiente:

![crestas](/showcase/sketches/crestas.png 'crestas')

Como resultado se obtiene una imagen cuyos bordes de los objetos se encuentran resaltados, permitiendo identificar claramente los cambios de color y las regiones donde están los distintos objetos.

Afilado. Se usa un concepto similar al usado con la detección de bordes, con la idea de obtener una imagen con sus bordes delimitados de manera más explícita.
En este caso el kernel usado es el siguiente:

![afilado](/showcase/sketches/afilado.png 'afilado')

Obteniendo una imagen dentro de la cual los bordes o límites de los objetos contenidos en ella parecen ser más delimitados y distinguibles que de la imagen original, otorgando una sensación de mayor contraste.

Caja borrosa. Es un filtro lineal de dominio espacial en el que cada píxel de la imagen resultante tiene un valor igual al valor medio de sus píxeles vecinos en la imagen de entrada. Es una forma de filtro de paso bajo ("borroso"). 
En este caso el kernel usado es el siguiente:

![caja](/showcase/sketches/caja.png 'caja')

Desenfoque Gaussiano. Es el resultado de desenfocar una imagen mediante una función gaussiana (llamada así por el matemático y científico Carl Friedrich Gauss), normalmente se utiliza para reducir el ruido de la imagen y reducir los detalles.
En este caso el kernel usado es el siguiente:

![desenfoque](/showcase/sketches/desenfoque.png 'desenfoque')

En otro sentido, también se hace consideración de dos herramientas que son útiles para el desarrollo del ejercicio y que permiten ampliar las posibilidades sobre el mismo. Como primero se analizó lo concebido como, una región de interés (a menudo abreviada ROI), que son muestras dentro de un conjunto de datos identificados para un propósito particular. Y luego, se incluyeron las ideas de una herramienta de magnificación/zoom, buscando imitar el efecto generado por las lupas. Para el zoom se utilizó la siguiente idea:

![zoom](/showcase/sketches/zoom.png 'zoom')

El punto rojo representa la posición del mouse, el círculo exterior representa el espacio sobre el cúal se va a mostrar el zoom y el círculo interior el espacio al cual se le va a hacer zoom. Lo que se plantea es cómo se ve en la imágen traer a cada uno de los puntos del círculo exterior el color correspondiente a la textura del círculo interior, esto se logra asumiendo que ambos círculos tienen una línea que conecta desde el centro de estos hasta sus respectivos bordes por lo que lo necesario para traer su correspondiente se logra mapeando el valor inicial que se encuentra en el rango [centro, radio círculo exterior] en el rango [centro, radio círculo interior], y con esto se consigue encontrar la textura correspondiente.

## Antecedentes

El concepto de ROI se ha utilizado habitualmente en muchos ámbitos de aplicación. Por ejemplo, en las imágenes médicas, los límites de un tumor pueden definirse en una imagen o en un volumen, con el fin de medir su tamaño. El límite endocárdico puede definirse en una imagen, quizás durante diferentes fases del ciclo cardíaco, por ejemplo, al final de la sístole y al final de la diástole, con el fin de evaluar la función cardíaca. En los sistemas de información geográfica (SIG), un ROI puede tomarse literalmente como una selección poligonal de un mapa 2D. En el reconocimiento óptico de caracteres, el ROI define los límites de un objeto considerado.
Algunos ejemplos de los usos más comunes son:
- Conjunto de datos 1D: un intervalo de tiempo o de frecuencia en una forma de onda,
- Conjunto de datos 2D: los límites de un objeto en una imagen,
- Conjunto de datos 3D: los contornos o superficies que delimitan un objeto (a veces conocido como Volumen de Interés (VOI)) en un volumen,
- Conjunto de datos 4D: el contorno de un objeto en o durante un intervalo de tiempo determinado en un volumen de tiempo.


## Código (solución) y resultados

Instrucciones de uso:
- Se tiene un selector donde se puede escoger cual es la máscara que se desea aplicar.
- El botón de chequeo de “Cámara” permite activar la cámara para que sea eso lo que se pasa al shader.
- El seleccionador de archivos permite subir una imágen o video para su procesamiento.
- El botón de chequeo “Región de interés” permite activar que la mascara solamente se aplique a la región circular que se quiera, la cual se determina por el mouse y el tamaño está ligado al slider que se encuentra debajo del selector de archivos.
- El botón de chequeo “Zoom” permite generar una región donde se magnifica la imágen, igualmente que la región de interés su posición se determina por el mouse y su tamaño por el slider.

{{< details title="Código fragment shader" open=false >}}
```js
precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform sampler2D vid0;

uniform vec2 texOffset;
uniform float mask[9];

uniform bool orig;
uniform bool bord;
uniform bool cam;
uniform bool roi;
uniform bool zoom;
uniform float posY;
uniform float posX;
uniform float roiSize;

float map2(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void main() {
  vec4 convolution;
  vec4 texel;
  
  vec2 tc0 = vTexCoord + vec2(-texOffset.s, -texOffset.t);
  vec2 tc1 = vTexCoord + vec2(         0.0, -texOffset.t);
  vec2 tc2 = vTexCoord + vec2(+texOffset.s, -texOffset.t);
  vec2 tc3 = vTexCoord + vec2(-texOffset.s,          0.0);
  vec2 tc4 = vTexCoord + vec2(         0.0,          0.0);
  vec2 tc5 = vTexCoord + vec2(+texOffset.s,          0.0);
  vec2 tc6 = vTexCoord + vec2(-texOffset.s, +texOffset.t);
  vec2 tc7 = vTexCoord + vec2(         0.0, +texOffset.t);
  vec2 tc8 = vTexCoord + vec2(+texOffset.s, +texOffset.t);

  vec4 rgba[9];
  if(!cam){
    rgba[0] = texture2D(tex0, vec2(tc0.x,1.0-tc0.y));
    rgba[1] = texture2D(tex0, vec2(tc1.x,1.0-tc1.y));
    rgba[2] = texture2D(tex0, vec2(tc2.x,1.0-tc2.y));
    rgba[3] = texture2D(tex0, vec2(tc3.x,1.0-tc3.y));
    rgba[4] = texture2D(tex0, vec2(tc4.x,1.0-tc4.y));
    rgba[5] = texture2D(tex0, vec2(tc5.x,1.0-tc5.y));
    rgba[6] = texture2D(tex0, vec2(tc6.x,1.0-tc6.y));
    rgba[7] = texture2D(tex0, vec2(tc7.x,1.0-tc7.y));
    rgba[8] = texture2D(tex0, vec2(tc8.x,1.0-tc8.y));
    texel =  texture2D(tex0, vec2(vTexCoord.x,1.0-vTexCoord.y));
  }else{
    rgba[0] = texture2D(vid0, vec2(tc0.x,1.0-tc0.y));
    rgba[1] = texture2D(vid0, vec2(tc1.x,1.0-tc1.y));
    rgba[2] = texture2D(vid0, vec2(tc2.x,1.0-tc2.y));
    rgba[3] = texture2D(vid0, vec2(tc3.x,1.0-tc3.y));
    rgba[4] = texture2D(vid0, vec2(tc4.x,1.0-tc4.y));
    rgba[5] = texture2D(vid0, vec2(tc5.x,1.0-tc5.y));
    rgba[6] = texture2D(vid0, vec2(tc6.x,1.0-tc6.y));
    rgba[7] = texture2D(vid0, vec2(tc7.x,1.0-tc7.y));
    rgba[8] = texture2D(vid0, vec2(tc8.x,1.0-tc8.y));
    texel =  texture2D(vid0, 1.0 - vec2(vTexCoord.x,1.0-vTexCoord.y));
  }
  for (int i = 0; i < 9; i++) {
    convolution += rgba[i]*mask[i];
  }
  
  float pct = 0.0;
  pct = distance(vTexCoord,vec2(posX,1.0-posY)); 
  
  if(roi){
    if(pct<roiSize){
      gl_FragColor = vec4(convolution.rgb, 1.0); 
    }else{
      gl_FragColor = vec4(texel.rgb, 1.0); 
    }
  }else if(zoom){
    if(pct<roiSize){
      //vec2 coords2 = (vec2(map2(vTexCoord.x-posX, -roiSize/2.0, roiSize/2.0, -roiSize, roiSize),map2(vTexCoord.y-(1.0-posY), -roiSize/2.0, roiSize/2.0, -roiSize, roiSize)));
      
      vec4 xd = texture2D(tex0, vec2(vTexCoord.x + ((vTexCoord.x - posX) / 3.0), 1.0 - vTexCoord.y + (vTexCoord.y - 1.0 + posY) / 3.0));

      gl_FragColor = vec4(xd.rgb ,1.0);
    }else{
      gl_FragColor = vec4(texel.rgb, 1.0); 
    }
  }else{
    gl_FragColor = vec4(convolution.rgb, 1.0); 
  }
}
```
{{< /details >}}

{{< p5-global-iframe id="pyramid" width="525" height="525" >}}

let Shader;
let tex;
let mask;

function preload(){
  Shader = loadShader('/showcase/sketches/masking.vert', '/showcase/sketches/masking.frag');
  tex = loadImage('/showcase/sketches/mandrill.png');
}

function setup() {
  createCanvas(500, 500, WEBGL);

  
  inputImg = createFileInput(handleFile);
  inputImg.position(255, 5);
  inputImg.size(240);
  
  option = createSelect();
  option.position(15, 5);
  option.option('Original');
  option.option('Detección de crestas');
  option.option('Afilado');
  option.option('Caja borrosa');
  option.option('Desenfoque gaussiano');
  option.selected('Original');
  option.changed(optionEvent);
  mask = option.value();
  
  media = createCheckbox('Cámara', false);
  media.position(175, 5);
  
  roi = createCheckbox('Región de interes', false);
  roi.position(15, 30);
  
  zoom = createCheckbox('Zoom', false);
  zoom.position(170, 30);
  
  roiSize = createSlider(0.05,0.5,0.1,0.05);
  roiSize.position(250, 30);
  
  vid = createCapture(VIDEO);
  vid.size(500, 500);
  vid.hide();
  
  
}

function draw() {  
  shader(Shader);
  Shader.setUniform('tex0', tex);
  Shader.setUniform('vid0', vid);
  Shader.setUniform('cam', media.checked());
  Shader.setUniform('roi', roi.checked());
  Shader.setUniform('zoom', zoom.checked());
  Shader.setUniform('roiSize', roiSize.value());
  Shader.setUniform('posX', mouseX/500);
  Shader.setUniform('posY', mouseY/500);
  Shader.setUniform('texOffset', [1/500,1/500]);
  if(mask=="Original"){
    Shader.setUniform('mask', [0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0]);
  }else if(mask=="Detección de crestas"){
    Shader.setUniform('mask', [-1.0,-1.0,-1.0,-1.0,8.0,-1.0,-1.0,-1.0,-1.0]);
  }else if(mask=="Afilado"){
    Shader.setUniform('mask', [0.0, -1.0, 0.0, -1.0, 5.0, -1.0, 0.0, -1.0, 0.0]);
  }else if(mask=="Caja borrosa"){
    Shader.setUniform('mask', [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
  }else if(mask=="Desenfoque gaussiano"){
    Shader.setUniform('mask', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]);
  }
  rect(0,0,width, height);
}

function optionEvent() {
  mask = option.value();
}

function vidLoad() {
  tex.loop();
}

function handleFile(file) {
  if (file.type === 'image') {
    tex = createImg(file.data, '');
    tex.hide();
  } else {
    tex = createVideo(file.data, vidLoad);
    tex.hide();
  }
}

{{< /p5-global-iframe >}}

# Pixelator

En el procesamiento de la señal digital, el muestreo descendente (downsampling), la compresión y la decimación son términos asociados al proceso de remuestreo en un sistema de procesamiento de la señal digital multitasa. Tanto el downsampling como la decimación pueden ser sinónimos de compresión, o pueden describir un proceso completo de reducción del ancho de banda (filtrado) y de reducción de la tasa de muestreo.Cuando el proceso se realiza sobre una secuencia de muestras de una señal o una función continua, produce una aproximación de la secuencia que se habría obtenido muestreando la señal a una tasa menor. 

Al permitir tomar una imagen y convertirla en arte de píxeles, puedes definir el tamaño del píxel y  crear una imagen de píxeles. Para usar la configuración rápida por defecto necesitas un elemento desde donde dibujar la imagen y un elemento canvas. 


 
{{< p5-global-iframe id="pyramid" width="525" height="525" >}}

let Shader;
let tex;
let Borig = false, Bpix = true, Bcam = false;

function preload(){
  Shader = loadShader('/showcase/sketches/effect.vert', '/showcase/sketches/effect.frag');
  tex = loadImage('/showcase/sketches/img.png');
}

function setup() {
  createCanvas(500, 500, WEBGL);

  tiles = createSlider(0, 150, 75);
  tiles.position(5, 5);
  tiles.style('width', '240px');
  
  inputImg = createFileInput(handleFile);
  inputImg.position(255, 5);
  inputImg.size(240);
  
  option = createSelect();
  option.position(15, 25);
  option.option('Original');
  option.option('Pixelado');
  option.selected('Pixelado');
  option.changed(optionEvent);
  
  media = createCheckbox('Cámara', false);
  media.position(100, 25);
  media.changed(myCheckedEvent);
  
  vid = createCapture(VIDEO);
  vid.size(500, 500);
  vid.hide();
}

function draw() {  
  shader(Shader);
  Shader.setUniform('tex0', tex);
  Shader.setUniform('vid0', vid);
  Shader.setUniform('tiles0', tiles.value());
  Shader.setUniform('orig', Borig);
  Shader.setUniform('pix', Bpix);
  Shader.setUniform('cam', Bcam);
  rect(0,0,width, height);
}

function handleFile(file) {
  if (file.type === 'image') {
    tex = createImg(file.data, '');
    tex.hide();
  } else {
    tex = createVideo(file.data, vidLoad);
    tex.hide();
  }
}

function optionEvent() {
  let opt = option.value();
  if(opt=="Original"){
    Borig = true;
    Bpix = false;
  }else if(opt=="Pixelado"){
    Borig = false;
    Bpix = true;
  }
}

function vidLoad() {
  tex.loop();
  tex.volume(0);
}

function myCheckedEvent() {
  if (media.checked()) {
    Bcam = true;
  } else {
    Bcam = false;
  }
}
{{< /p5-global-iframe >}}


## Conclusiones y trabajo futuro
Para el desarrollo de esta actividad se encontró gran utilidad en la combinación de las regiones de interés junto con las máscaras, pudimos observar cómo es que dicha combinación permite al usuario estrictamente observar las partes que son relevantes para él sin alterar la imagen totalmente, nuevamente y como se encontró en la investigación, sus usos en el análisis de tests médicos y resultados de laboratorio puede ser prometedor, facilitando la labor de identificación de anomalías, así como también creemos que sobre el análisis no sólo en materia de medicina si no en general de fotografías y/o videos que requieran identificación de anomalías puede tener una amplia aplicación desarrollando las máscaras requeridas para cada caso.

Para desarrollos futuros alentamos a desarrollar máscaras para casos específicos, como por ejemplo para la detección sobre imágenes satelitales de zonas deforestadas a través de los cambios en la vegetación y en su densidad. También pueden realizarse nuevas implementaciones sobre cómo se genera el zoom sobre la imágen como el conocido “efecto burbuja”, esto originado a partir de problemas que se observaron a la hora de intentar distintas implementaciones del efecto, generando distorsiones no deseadas en algunas áreas de la imagen proyectada, por lo que se sugiere estudiar el funcionamiento y las posibles causas.
