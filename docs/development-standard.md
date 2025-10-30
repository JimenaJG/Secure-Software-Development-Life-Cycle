# Estándar de Desarrollo 


Esta guía es para que todos programemos de manera similar.
---

### Antes de todo e iniciar, instalar las dependencias 
- comando: npm i


## Usando ChatGPT, Copilot o cualquier IA

### 1. No copies y pegues sin analizar
- Lee el código que te da la IA
- Asegúrate de entender qué hace
- Prueba que funcione de verdad

### 2. Cuando le pidas código a la IA, dile que:
- Siga el estilo del proyecto
- Te explique qué hace cada parte
- Agregue comentarios en las partes complicadas

### 3. Antes de usar ese código, checa que:
- No tenga errores (corre el linting)
- Compile bien
- No tenga contraseñas o cosas privadas escritas directamente

---

## Seguridad

### Cosas que JAMÁS debes poner en el código:

- ❌ Contraseñas
- ❌ API keys (esas llaves que te dan servicios como Google Maps, Stripe, etc.)
- ❌ Tokens de acceso
- ❌ URLs de bases de datos con usuario y contraseña
- ❌ Información personal de usuarios

### Se guarda en:
En un archivo `.env` (variables de entorno) que NUNCA se sube a Git:

```
# archivo .env (este NO se sube a Git)
API_KEY=tu_llave_super_secreta
DATABASE_URL=myssql://usuario:contraseña@localhost/midb

```
usarlo así:

```javascript
const apiKey = process.env.API_KEY  // BIEN
const apiKey = "123456789"          // MAL
```

---

## Cómo escribir código que todos entiendan

### Dale nombres que se expliquen solos

**Nombres buenos (se entiende qué hacen):**

```javascript
const autenticarUsuario = () => { }
const calcularPrecioTotal = (productos) => { }
const usuarioEstaActivo = true
```
**La regla:** Si alguien lee el nombre y no sabe qué hace, el nombre está mal.

### Organiza tus archivos

La siguiente estructura muestra cómo está organizado el proyecto **PROYECTO-FINAL-SSDL**

```bash

PROYECTO-FINAL-SSDL/
├── docs/         # Documentación técnica y de seguridad (SBOM, estándares, matrices, guías)
├── sbom/         # Software Bill of Materials generado por Snyk
├── static/       # Archivos estáticos (CSS, imágenes, JS)
├── views/        # Vistas HTML renderizadas por Nunjucks
├── .env          # Variables de entorno (no se sube al repositorio)
├── package.json  # Dependencias, scripts y metadatos del proyecto
└── server.js     # Servidor principal (Express, Okta, Nunjucks)

```

### Cuándo poner comentarios

No comentes TODO, solo lo necesario:

** Comenta cuando:**
- Hay algo raro o complicado
- Tomaste una decisión técnica que cambia bastante el codigo 

```javascript

// Ahora tarda mucho con 10,000+ usuarios
function buscarUsuarios() {
  // código aquí
}
```
---

## Pruebas (Test) 

## ¿Por qué hacemos tests? 

Los tests son como un **seguro** para nuestro código: te avisan si algo se rompe **antes** de que llegue a los usuarios.

## Regla general

> Si escribís código nuevo, preferiblemente escribí también su test.

---

## ¿Cómo hacer un test?

La idea es pensar en **cómo se debería comportarse** el sistema. Seguí estos 3 pasos básicos:

1. **Preparar:** ¿Qué necesito antes de probar? 
2. **Hacer:** ¿Qué voy a probar? 
3. **Verificar:** ¿Funcionó como esperaba?
---

## Ejemplo en código:

```javascript
describe('Carrito de Compras', () => {
  it('debe calcular correctamente el total con descuento', () => {
    // DADO un carrito con 2 productos de ₡100
    const carrito = new Carrito()
    carrito.agregar({ precio: 100, cantidad: 2 })

    // CUANDO se aplica un descuento del 10%
    const total = carrito.calcularTotal(0.1)

    // ENTONCES el total debe ser ₡180 (₡200 - 10%)
    expect(total).toBe(180)
  })
})
```
---

## Herramientas recomendadas para tests en este proyecto

* `jest` o `vitest` para proyectos con Node o React.


## Lista de verificación antes de subir tu código

Antes de hacer `git push`, haz esto (en orden):

### 1. Revisa el estilo del código (linting)
```bash
npm run lint
```
- Si salen errores (rojos): arregla antes de continuar
- Si salen warnings (amarillos): revisa qué son

### 2. Construye el proyecto (build)
```bash
npm run build
```
- Debe terminar sin errores
- Si falla, hay algo mal en tu código

### 3. Corre los tests
```bash
npm test
```
- Todos deben pasar (estar en verde)
- Si alguno falla, arréglalo

### 4. Formatea el código
```bash
npm run format
```
- Esto arregla la indentación, espacios, etc.

---

## Git y Commits - Cómo nombrar tus cambios

### Formato para mensajes de commit

Usa este formato para que todos sepamos qué cambiaste:

```
tipo: descripción corta de qué hiciste
```

### Tipos de cambios:

- `feat`: Agregaste algo nuevo
- `fix`: Arreglaste un bug
- `docs`: Cambiaste documentación
- `style`: Solo cambiaste formato (espacios, comas, etc.)
- `refactor`: Mejoraste código sin cambiar lo que hace
- `test`: Agregaste o cambiaste tests

### Ejemplos buenos:

```
feat: agregar botón de guerdar transsaccion
fix: corregir error al calcular iva
docs: actualizar ducumentacion de la matriz de riesgo
refactor: simplificar función de validación de edad
```

### Ejemplos malos:
```
cambios varios
arreglé cosas
WIP (work in progress)
asdfgh
```

### Cómo trabajar con Git

1. **Crea una rama para tu cambio:**
   ```bash
   git checkout -b feat/login
   ```

2. **Haz tus cambios y commits pequeños:**
   ```bash
   git add .
   git commit -m "feat: agregar botón de login"
   ```

3. **Antes de subir, verifica TODO el checklist de arriba**

4. **Sube tu rama:**
   ```bash
   git push origin feat/login
   ```

5. **Crea un Pull Request explicando:**
   - Qué cambiaste

---

## Reglas específicas para el lenguaje

### JavaScript

// ✅ Usa const para cosas que no cambian
const usuario = "Sofia"

// ✅ Usa let solo si el valor va a cambiar
let contador = 0
contador = contador + 1

// ❌ Nunca uses var por ejemplo:  
var nombre = "Pedro"  // NO HAGAS ESTO

// ✅ Usa funciones de flecha
const saludar = (nombre) => {
  return `Hola ${nombre}`
}

// ✅ Usa async/await (más fácil de leer)
async function obtenerUsuario() {
  const respuesta = await fetch('/api/usuario')
  return respuesta.json()
}

// ❌ Evita .then() si puedes
function obtenerUsuario() {
  return fetch('/api/usuario')
    .then(r => r.json())
    .then(data => data)  // más difícil de leer
}

## Errores comunes que todos cometemos

### 1. Dejar console.logs olvidados

```
console.log("entré aquí")  // ❌ No lo subas así
console.log(usuario)        // ❌ Debugging olvidado
```

**Solución:** Quítalos antes de subir.

### 2. Dejar código comentado "por si acaso"

```
// const viejaFuncion = () => { ... }  // ❌ 
// esto ya no funciona pero lo dejo por aquello 

function nuevaFuncion() {
  // código actual
}
```

**Solución:** Git guarda todo el historial. Si lo borraste y lo necesitas, ahí está.

### 3. Commits gigantes

```
git commit -m "cambié todo el proyecto"
```

**Solución:** Haz commits pequeños y frecuentes. Es más fácil encontrar qué causó un bug.

### 4. Ignorar los warnings (advertencias)

"Tomarles la misma importancia y atención"


### 5. No actualizar la documentación

Cambiaste cómo funciona algo pero no actualizaste la carpeta docs.

**Solución:** Si cambias código, cambia el archivo espesifico en docs también.


---

**Recuerda:** Estas reglas existen para ayudarnos, no para hacernos la vida difícil.

---

## Glosario

**Linting:** Herramienta que revisa tu código y te dice si tiene errores de estilo o posibles bugs.

**Build:** Construir o compilar el proyecto para verificar que funciona.

**Test/Prueba:** Código que verifica que tu código funciona bien.

**Commit:** Guardar cambios en Git con un mensaje describiendo qué hiciste.

**Pull Request (PR):** Pedir que tu código se integre al proyecto principal.

**Branch/Rama:** Una copia del código donde trabajas sin afectar lo que ya funciona.



---
