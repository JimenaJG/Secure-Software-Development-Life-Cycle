# Instalación del Escáner Estático Snyk (CLI + Extensión VS Code)

Este documento detalla los pasos para instalar y configurar el escáner estático **Snyk** para su uso local en tu proyecto Node.js, incluyendo la extensión de VS Code.

---

##  Paso 1: Instalar Snyk CLI

### Comando para instalar globalmente:

```bash
npm install -g snyk
```

---

## Paso 2: Autenticarse con Snyk

Después de instalar, ejecutá:

```bash
snyk auth
```

Esto abrirá una ventana en tu navegador para iniciar sesión. Usá una cuenta con GitHub, Google o SSO.

---

## Paso 3: Escanear el proyecto

Colocate en la raíz de tu proyecto (`package.json`) y ejecutá:

```bash
snyk test
```
---

## Paso 4 (Opcional): Instalar extensión en VS Code

1. Abrí VS Code.
2. Buscá "Snyk Security" en el marketplace.
3. Hacé clic en **Instalar**.
4. Iniciá sesión desde la barra lateral de Snyk si te lo pide.

---

## Confirmar instalación

Verificá que esté instalado con:

```bash
snyk --version
```

> Deberías ver una versión como `1.1300.0` o superior.

---
