# Normal mapping

## Planteamiento del problema
En los gráficos por ordenador en 3D, el mapeo normal, o mapeo de baches Dot3, es una técnica de mapeo de texturas que se utiliza para fingir la iluminación de baches y abolladuras, una implementación del mapeo de baches. Se utiliza para añadir detalles sin utilizar más polígonos. Un uso común de esta técnica es mejorar en gran medida la apariencia y los detalles de un modelo de pocos polígonos generando un mapa de normales a partir de un modelo de muchos polígonos o un mapa de altura.

Los mapas de normales suelen almacenarse como imágenes RGB regulares en las que los componentes RGB corresponden a las coordenadas X, Y y Z, respectivamente, de la normal de la superficie.

![Normal mapping](/showcase/sketches/normalMapping.jpg 'Normal mapping')


## Antecedentes
En 1978 Jim Blinn describió cómo las normales de una superficie podían ser perturbadas para hacer que las caras geométricamente planas tuvieran una apariencia detallada La idea de tomar detalles geométricos de un modelo de alta poligonización fue introducida en "Fitting Smooth Surfaces to Dense Polygon Meshes" por Krishnamurthy y Levoy, Proc. SIGGRAPH 1996, donde este enfoque fue utilizado para crear mapas de desplazamiento sobre nurbs. En 1998, se presentaron dos artículos con ideas clave para transferir detalles con mapas normales de mallas de alta a baja poligonación: "Appearance Preserving Simplification", de Cohen et al. SIGGRAPH 1998, y "A general method for preserving attribute values on simplified meshes", de Cignoni et al. IEEE Visualization '98. El primero introdujo la idea de almacenar las normales de la superficie directamente en una textura, en lugar de los desplazamientos, aunque requería que el modelo de bajo detalle fuera generado por un algoritmo particular de simplificación restringida. Este último presentó un enfoque más sencillo que desacopla la malla poligonal alta y baja y permite la recreación de cualquier atributo del modelo de alto detalle (color, coordenadas de textura, desplazamientos, etc.) de una manera que no depende de cómo se creó el modelo de bajo detalle. La combinación de almacenar las normales en una textura, con el proceso de creación más general, sigue siendo utilizada por la mayoría de las herramientas disponibles actualmente.

## Código (solución) y resultados

Instrucciones de uso:
En el seleccionador se puede intercambiar entre las 5 texturas predeterminadas que se tienen.

{{< details title="Código vertex shader" open=false >}}
```js
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;

uniform mat4 uModelViewMatrix;

uniform sampler2D uNoiseTexture;

varying vec2 vTexCoord;
varying vec3 vNoise;


void main() {

  vec4 noise = texture2D(uNoiseTexture, aTexCoord);
  vNoise = noise.rgb;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  float amplitude = 1.0;

  positionVec4.xyz += (noise.rgb)/5.0 * aNormal * amplitude;

  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;

  vTexCoord = aTexCoord;
}
```
{{< /details >}}

{{< p5-global-iframe id="pyramid" width="525" height="525" >}}
let Shader; 
let noise;
let detailY;

function preload() { 
  Shader = loadShader('/showcase/sketches/mapping.vert', '/showcase/sketches/mapping.frag'); 
  tex0 = loadImage('/showcase/sketches/text0.jpeg'); 
  tex1 = loadImage('/showcase/sketches/text1.jpg'); 
  tex2 = loadImage('/showcase/sketches/text2.jpeg'); 
  tex3 = loadImage('/showcase/sketches/text3.jpg'); 
  tex4 = loadImage('/showcase/sketches/text4.jpeg');
  tex5 = loadImage('/showcase/sketches/wood.jpg');
  option = createSelect(); 
  option.position(15, 15); 
  option.option('Textura 1'); 
  option.option('Textura 2'); 
  option.option('Textura 3'); 
  option.option('Textura 4'); 
  option.option('Textura 5'); 
  option.option('Textura 6'); 
  option.selected('Textura 1'); 
}

function setup() { 
  createCanvas(500, 500, WEBGL); 
  noStroke();
  detailY = createSlider(2, 24, 6);
  detailY.position(20, 40);
  detailY.style('width', '80px'); }

function draw() { 
  background(250,150,150); 
  shader(Shader); 
  if(option.value()=="Textura 1"){ 
    Shader.setUniform("uNoiseTexture", tex0); 
  } else if(option.value()=="Textura 2"){ 
    Shader.setUniform("uNoiseTexture", tex1); 
  } else if(option.value()=="Textura 3"){ 
    Shader.setUniform("uNoiseTexture", tex2); 
  } else if(option.value()=="Textura 4"){ 
    Shader.setUniform("uNoiseTexture", tex3); 
  } else if(option.value()=="Textura 5"){ 
    Shader.setUniform("uNoiseTexture", tex4); 
  } else if(option.value()=="Textura 6"){ 
    Shader.setUniform("uNoiseTexture", tex5); 
  }
  orbitControl();
  rotateY(millis() / 4000);
  ellipsoid(100, 200, 200, 12, detailY.value());
  //ellipsoid(100, 200, 200);
  //sphere(100,200,200);
}
{{< /p5-global-iframe >}}

<br>

<img src="/showcase/sketches/tex0.jpg" alt="drawing" width="200"/>
<img src="/showcase/sketches/wood.jpg" alt="drawing" width="200"/>
<img src="/showcase/sketches/wood2.jpg" alt="drawing" width="200"/>
<img src="/showcase/sketches/xd.jpg" alt="drawing" width="200"/>
<img src="/showcase/sketches/prueba.jpg" alt="drawing" width="200"/>

En esta implementación se codifica las normales en el espacio del objeto, de modo que los componentes rojo, verde y azul (rgb) se corresponden directamente con las coordenadas X, Y y Z. 

## Conclusiones y trabajo futuro

El trabajo realizado sobre el estudio tanto del bump mapping como del normal mapping permitió comprender los usos que una imagen sin aparente profundidad y solo con colores en ella puede tener si se usan adecuadamente los valores que dichos colores pueden representar, de tal manera que se altere la figura a la cual se le aplique dicha imagen, generando efectos visuales de texturas que imitan de mejor manera la realidad observada. También se encontró que dicha actividad puede ser realizada basados en modelos de iluminación, o con el uso de un geometry shader, pero debido a p5 no fue posible debido a que dentro de este no se encuentra la posibilidad de hacer uso de uno.
