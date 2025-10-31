#  Verificación de ESLint y Prettier

Este documento explica cómo comprobar si **ESLint** y **Prettier** están correctamente instalados en tu proyecto.

---

## Paso 1: Verificar ESLint

### Verificar script en `package.json`

Debés tener esta línea dentro de `"scripts"`:

```json
"scripts": {
  "lint": "eslint ."
}
```

### Ejecutar el comando

```bash
npm run lint
```

### Resultado esperado

- Si ESLint está instalado: verás advertencias o errores del código.
- Si no está instalado: verás un mensaje como `eslint: command not found`.

---

## Paso 2: Verificar Prettier

### Verificar script en `package.json`

```json
"scripts": {
  "format": "prettier --write ."
}
```

### Ejecutar el comando

```bash
npm run format
```

### Resultado esperado

- Si Prettier está instalado: el código se formateará y mostrará los archivos que fueron editados.
- Si no está instalado: verás un error como `prettier: command not found`.

---

## Paso 3: Verificar versiones con `npx`

También podés usar estos comandos:

```bash
npx eslint -v
npx prettier -v
```

Si ves una versión (ej. `8.56.0`), entonces están correctamente instalados.
