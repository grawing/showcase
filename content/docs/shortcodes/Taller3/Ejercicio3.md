# Texturing

## Planteamiento del problema
LUMA: El luma representa el brillo de una imagen (la parte "en blanco y negro" o acromática de la imagen). El luma suele ir emparejado con la crominancia. El luma representa la imagen acromática, mientras que los componentes del croma representan la información del color. Es un término comúnmente utilizado en el procesamiento digital de imágenes para caracterizar a cada píxel.
En los formatos digitales que siguen el estándar CCIR_601, la luma Y de un píxel se calcula con la fórmula Y = 0,299R + 0,587G + 0,114B.

Inverso del color. Una forma de pensar en la inversión del color es utilizar un modelo de color RGB. Se puede decir que todos los colores pueden representarse como una combinación de niveles de tres colores primarios diferentes: rojo, azul y verde. Por ejemplo, el azul puro sería 0% rojo, 0% verde y 100% azul. Si se resta cada uno de ellos de 100 para invertir sus valores, se obtiene un 100% de rojo, un 100% de verde y un 0% de azul. El rojo + el verde resultantes dan el amarillo, que es el color complementario del azul. El negro es 0% rojo, 0% verde y 0% azul, por lo que el inverso sería 100% rojo, 100% verde y 100% azul, que es el blanco. El gris podría representarse como un 50% de rojo, un 50% de verde y un 50% de azul (o algo parecido), por lo que el inverso del gris sería el gris. Por lo que basados en el modelo RGB obtenemos que el inverso del color es su color complementario, que puede ser encontrado al restar en una escala de 0 a 100, 100 a cada uno de sus valores correspondientes, rojo, verde y azul.

Teñido. En este caso lo que se busca es teñir o tinturar una textura a partir de un color, para esto lo que se hace es multiplicar cada una de las componentes rgb del pixel de la textura con su correspondiente componente rgb del color de teñido, se realiza una multiplicación pues experimentalmente se halló que esta da un mejor realce al color de teñido, y permite que los valores se mantengan dentro del rango requerido, debido a que la multiplicación no supera los límites.

Eliminación. Dentro de la eliminación de un color, la idea fundamental es sustraer de la imagen y de cada pixel un porcentaje del color a eliminar, así por ejemplo, si lo que se desea es sustraer de una imagen las tonalidades azul, basándonos en un modelo de color RGB, lo adecuado es sustraerle a cada punto de color 0 en el espectro del rojo, 0 en el del verde y finalmente 100 en el azul, de tal manera que se elimina cualquier tonalidad de azul presente en la pintura y la imagen quedará ilustrada en términos de los colores restantes, rojo y verde.

Teñido con interpolado. En este caso lo que se hizo fue generar una textura base con la cual se iba a teñir la textura objetivo, esta textura base se creó por medio de un cuadrado en el cual cada una de sus puntas tenía un color diferente y se generaba un degradado entre cada uno de los colores para llegar a los otros, luego de la misma manera que en el caso del primer teñido se multiplicó los componentes rgb del teñido objetivo por su correspondiente componente rgb pero esta vez no de un solo color de teñido sino del rgb del píxel correspondiente en la textura base.

Foco de luz. El efecto de foco de luz se realizó mediante una técnica simillar a la de teñido con interpolado y a la de región de interés, por lo que se hace un teñido con tonos blancos, que es más fuerte conforme más cerca estén los pixeles del sitio donde se encuentren del mouse, y conforme esta distancia va aumentando estos tonos se van oscureciendo en una escala de grises hasta llegar al negro.

## Código (solución) y resultados
Instrucciones de uso:
- Se tiene un selector donde se puede escoger cual es la textura que se desea aplicar.
- El botón de chequeo de “Cámara” permite activar la cámara para que sea eso lo que se pasa al shader.
- El seleccionador de archivos permite subir una imágen o video para su procesamiento.
- El seleccionador de color permite enviar al shader el color para ciertas texturas, como teñido y eliminación.
- El botón “Randomize” permite generar valores aleatorios para las cuatro esquinas cuando se está en la textura teñida 2.


{{< details title="Código fragment shader" open=false >}}
```js
precision mediump float;

varying vec4 color4;
varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform sampler2D vid0;

uniform bool inv;
uniform bool baw;
uniform bool cam;
uniform bool ten;
uniform bool elm;
uniform bool luz;
uniform bool hsl;
uniform vec2 mousePos;
uniform vec3 colT;
uniform float opc;

float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}



vec3 hslCol(vec3 texel){
  float Cmin =  min(min(texel.r,texel.g),texel.b);
  float Cmax =  max(max(texel.r,texel.g),texel.b);
  float delta = Cmax - Cmin;
  float H = 0.0 ,S = 0.0 ,L = 0.0 ;
  
  if(delta == 0.0){
    H = 0.0;
    S = 0.0;
  }else if(texel.r == Cmax){
    H = 60.0 * (mod(((texel.g-texel.b)/delta), 6.0));
  }else if(texel.g==Cmax){
    H = 60.0 * (((texel.b-texel.r)/delta) + 2.0);
  }else{
    H = 60.0 * (((texel.r-texel.g)/delta) + 4.0);
  }
  L = (Cmax + Cmin)/2.0;
  
  if(delta!=0.0){
    S = delta/(1.0-(2.0*L - 1.0 > 0.0 ? 2.0*L-1.0 : -(2.0*L-1.0)));
  }

  return vec3(H,S,L);
}

void main() {
  
  vec2 uv = vTexCoord;
  uv = vec2(uv.x,1.0-uv.y);
  vec4 tex;
  if(!cam){
      tex = texture2D(tex0, uv);
  }else{
      tex = texture2D(vid0, uv);
  }
  
  float pct = 0.0;
  pct = distance(vTexCoord,vec2(mousePos.x,1.0-mousePos.y));

  if(baw){
    tex = vec4((vec3(luma(tex.rgb))), opc);
  }else if(inv){
    tex = vec4(vec3(1.0) - tex.rgb, opc);
  }else if(ten){
    tex = vec4((tex.rgb*colT.rgb), opc);
  }else if(elm){
    tex = vec4(tex.rgb-colT.rgb, opc);
  }else if(hsl){
    tex = vec4(tex.rgb*color4.rgb, opc);
  }else if(luz){
    tex = vec4((tex.rgb+(0.5-vec3(pct))), 1.0);
  }else{
    tex = vec4(tex.rgb, opc);
  }
  gl_FragColor = tex;
}
```
{{< /details >}}

{{< p5-global-iframe id="pyramid" width="750" height="555" >}}

let Shader; 
let tex; 
let Binv = false, Bbaw = false, Bcam = false, Bten = false, Belm = false, Bhsl = false, Bluz = false; 
let c1, c2, c3, c4;

function preload(){ 
  Shader = loadShader('/showcase/sketches/texturing.vert', '/showcase/sketches/texturing.frag'); 
  tex = loadImage('/showcase/sketches/Turner.jpg'); }

function setup() { 
  createCanvas(740, 550, WEBGL);
  inputImg = createFileInput(handleFile); 
  inputImg.position(255, 5); 
  inputImg.size(240);
  option = createSelect(); 
  option.position(15, 5); 
  option.option('Original'); 
  option.option('Blanco y negro'); 
  option.option('Invertir');
  option.option('Teñido'); 
  option.option('Eliminación'); 
  option.option('Teñido 2'); 
  option.option('Luz'); 
  option.selected('Original'); 
  option.changed(optionEvent);
  media = createCheckbox('Cámara', false); 
  media.position(150, 5); 
  media.changed(myCheckedEvent);
  vid = createCapture(VIDEO); 
  vid.size(740, 550); 
  vid.hide();
  colorPicker = createColorPicker('#ed225d'); 
  colorPicker.position(15, 30);
  colorR = createButton('Randomize'); 
  colorR.position(80, 30); 
  colorR.mousePressed(randomizeColor);
  randomizeColor();
 }

function draw(){ 
  shader(Shader); 
  Shader.setUniform('tex0', tex); 
  Shader.setUniform('vid0', vid); 
  Shader.setUniform('inv', Binv); 
  Shader.setUniform('baw', Bbaw); 
  Shader.setUniform('ten', Bten); 
  Shader.setUniform('cam', Bcam); 
  Shader.setUniform('elm', Belm); 
  Shader.setUniform('luz', Bluz); 
  Shader.setUniform('hsl', Bhsl); 
  Shader.setUniform('mousePos', [mouseX/740,mouseY/550]); 
  Shader.setUniform('colT', colorPicker.color()._array); 
  Shader.setUniform('opc', 1);
  if(Bhsl){ 
    beginShape(); 
    fill(c1); 
    vertex(0, 0); 
    fill(c2); 
    vertex(0, 1); 
    fill(c3); 
    vertex(1, 1); 
    fill(c4); 
    vertex(1, 0); 
    endShape(); 
  } rect(0,0,width, height); 
}

function handleFile(file) { 
  if (file.type === 'image') { 
    tex = createImg(file.data, ''); 
    tex.hide(); 
  } else { 
    tex = createVideo(file.data, vidLoad); 
    tex.hide(); } 
}

function optionEvent() { 
  let opt = option.value(); 
  if(opt=="Original"){ 
    Bbaw = false; 
    Binv = false; 
    Bten = false; 
    Belm = false; 
    Bhsl = false; 
    Bluz = false; 
  }else if(opt=="Blanco y negro"){ 
    Bbaw = true; 
    Binv = false; 
    Bten = false; 
    Belm = false; 
    Bhsl = false; 
    Bluz = false; 
  }else if(opt=="Invertir"){ 
    Bbaw = false; 
    Binv = true; 
    Bten = false; 
    Belm = false; 
    Bhsl = false; 
    Bluz = false; 
  }else if(opt=="Teñido"){ 
    Bbaw = false; 
    Binv = false; 
    Bten = true; 
    Belm = false; 
    Bhsl = false; 
    Bluz = false; 
  }else if(opt=="Eliminación"){ 
    Bbaw = false; 
    Binv = false; 
    Bten = false; 
    Belm = true; 
    Bhsl = false; 
    Bluz = false; 
  }else if(opt=="Teñido 2"){ 
    Bbaw = false; 
    Binv = false; 
    Bten = false; 
    Belm = false; 
    Bhsl = true; 
    Bluz = false; 
  }else if(opt=="Luz"){ 
    Bbaw = false; 
    Binv = false; 
    Bten = false; 
    Belm = false; 
    Bhsl = false; 
    Bluz = true; 
  }
 }

function vidLoad() { 
  tex.loop(); 
}

function myCheckedEvent() { 
  if (media.checked()) { 
    Bcam = true; 
  } else { Bcam = false; 
  } 
}

function randomizeColor() { 
  c1 = [random(0,255),random(0,255),random(0,255)]; 
  c2 = [random(0,255),random(0,255),random(0,255)]; 
  c3 = [random(0,255),random(0,255),random(0,255)]; 
  c4 = [random(0,255),random(0,255),random(0,255)]; 
}{{< /p5-global-iframe >}}

## Conclusiones y trabajo futuro
Durante el desarrollo del ejercicio se estudiaron distintas manipulaciones de los colores de la imagen, pudiendo observar interesantes resultados que creemos son de utilidad para la industria de las artes gráficas y audiovisuales, dichos efectos explorados pueden ser usados para la evocación de sensaciones en los espectadores, adicionalmente de la capacidad que tiene para transformar la imagen percibida. Como trabajo futuro recomendamos estudiar nuevas formas o combinaciones de colores, esperando que tal vez combinaciones más complejas tanto en el campo de la iluminación como en el de los colores puedan ofrecer nuevas alternativas a las modificaciones que se pueden lograr. Así mismo durante el desarrollo pudimos evidenciar que para la técnica de teñido la multiplicación de los valores genera un resultado más natural para el ojo humano que una suma promedio entre los dos valores.

Adicionalmente, se motiva al desarrollo de una interfaz que permita una manipulación por áreas de la imagen, procurando permitir que el usuario delimite qué espacios de quieren que se vean afectados por el efecto otorgando así mayor libertad a la hora de usar el software.
