# Masking

La aplicación de máscaras de convolución desempeña un papel muy importante en el campo del procesamiento de imágenes. Se puede aplicar desenfoque, nitidez, relieve, detección de bordes, etc.


## Kernels

Un kernel, matriz de convolución o máscara es una pequeña matriz que se utiliza en el procesamiento de imágenes para desenfocar, enfocar, resaltar, detectar bordes, etc. Para ello se utiliza la convolución entre el núcleo y una imagen. 

Dado que es posible aplicar efectos como el desenfoque, la nitidez, el relieve, la detección de bordes, etc., mediante una operación de convolución entre el núcleo (matriz) y la imagen, el enmascaramiento es crucial en el ámbito del procesamiento de imágenes. En vista de ello, el objetivo de este estudio es evaluar el proceso de convolución de imágenes de forma que se haga un recorrido por cada una de las ideas que lo explican para obtener una perspectiva amplia.

### Bibliografia

Para obtener los resultados de esta practica se debe introducir la fórmula general de la operación de convolución primero veremos un ejemplo: {{< katex display >}} \begin{bmatrix} 164 & 188 & 164\ 178 & 201 & 197\ 174 & 168 & 181 \end{bmatrix} * \begin{bmatrix} 0 & 1 & 0\ 1 & 1 & 1\ 0 & 1 & 0 \end{bmatrix} {{< /katex >}}

De aquí se quiere determinar el valor del pixel del medio, es decir, el pixel que tiene el valor actual de 201. Para determinar el nuevo valor del píxel se realizan las siguientes operaciones:

Sea V el valor de salida del pixel, C[i, j] el valor del píxel en dicha posición de la matriz, K[i, j] el valor del kernel en esa posición y F la suma de de los coeficientes del kernel o 1 si la suma de los coeficientes es 0, entonces


{{< katex display >}} V = \frac{(168+197+201+178+188)}{5}=\frac{932}{5}=186.4 {{< /katex >}}

Otro concepto clave que será de utilidad para comprender el experimento realizado es el de histograma de una imagen. Tenemos que “un histograma de una imagen es un tipo de histograma que actúa como representación gráfica de la distribución tonal en una imagen digital”. El histograma de una imagen representa el número de píxeles de cada valor tonal donde el eje de abscisas (eje x) representa las variaciones tonales mientras que el eje de las ordenadas (eje y) representa el total de píxeles en ese tono específico. A modo de ejemplo observemos la siguiente imagen y su respectivo histograma

### Codigo

{{< details title="Código en p5.js" open=false >}}

```js
function convolution(x, y, matrix, matrixsize, img) {
    let rtotal = 0.0;
    let gtotal = 0.0;
    let btotal = 0.0;
    const offset = floor(matrixsize / 2);
    for (let i = 0; i < matrixsize; i++){
      for (let j = 0; j < matrixsize; j++){
        
        const xloc = (x + i - offset);
        const yloc = (y + j - offset);
        let loc = (xloc + img.width * yloc) * 4;
  
        loc = constrain(loc, 0 , img.pixels.length - 1);
  
        rtotal += (img.pixels[loc]) * matrix[i][j];
        gtotal += (img.pixels[loc + 1]) * matrix[i][j];
        btotal += (img.pixels[loc + 2]) * matrix[i][j];
      }
    }
    rtotal = constrain(rtotal, 0, 255);
    gtotal = constrain(gtotal, 0, 255);
    btotal = constrain(btotal, 0, 255);
    
    return color(rtotal, gtotal, btotal);
  };
```
{{< /details >}}

{{< p5-div sketch="/showcase/sketches/scintillating.js" >}}

### Discusión

El programa permite introducir los valores del núcleo y luego hacer clic en el botón Aplicar para aplicar la operación. Un ejercicio sencillo pero ilustrativo sería poner a cero todos los valores de la matriz, pero para aplicar un efecto de luminosidad variable, sería el del medio el que se podría variar, digamos, de 0 a 2 en pasos de 0 a 1, sólo el valor de Oscurece o agranda la imagen.


Así, podemos ver que la convolución es una operación matemática utilizada en diversos campos de investigación (como el de las señales y las comunicaciones), y en el procesamiento de imágenes juega un papel importante en diversas implementaciones de aplicaciones de filtros, reconocimiento de caras, etc. .
