# Matriz de Riesgos 

Este documento lista las librerías que usamos en el proyecto y los riesgos que pueden traer si no las configuramos bien o si tienen vulnerabilidades conocidas. 

---

## Cómo leer la tabla

**Probabilidad (1-5):** Qué tan probable es que pase algo malo  
**Impacto (1-5):** Qué tan grave sería si pasa  
**Riesgo = Probabilidad × Impacto**

- **Bajo (1-8):** Está bien, solo hay que mantenerlo actualizado
- **Medio (9-15):** Requiere atención, hay que configurarlo bien
- **Alto (16-25):** Peligro, hay que actuar ya

---

## Dependencias críticas

| Librería | Versión | Para qué la usamos | Prob. | Impacto | Riesgo | Qué puede pasar | Mitigar |
|----------|---------|-------------------|:-----:|:-------:|:------:|-----------------|-----------|
| **express** | 4.21.2 | El servidor web principal, maneja todas las rutas | 3 | 4 | **Medio (12)** | Si no se configura bien puede dejar endpoints expuestos | Usar helmet, validar todos los inputs, sanitizar las rutas |
| **express-session** | 1.18.2 | Maneja las sesiones de usuarios con cookies | 4 | 5 | **Alto (20)** | Las sesiones pueden ser robadas si las cookies no están bien configuradas | Configurar cookies con HttpOnly, Secure, SameSite=strict. Rotar IDs de sesión después del login |
| **nunjucks** | 3.2.4 | Motor de plantillas HTML seguro y moderno | 2 | 3 | **Bajo (6)** | Si no se filtran bien los datos, puede haber inyección de HTML | Mantener actualizado y sanitizar variables en plantillas |
| **socket.io** | 4.8.1 | Chat o comunicación en tiempo real | 3 | 4 | **Medio (12)** | Alguien podría conectarse sin estar autenticado | Validar que el usuario esté logueado en cada conexión |
| **lodash** | 4.17.21 | Funciones útiles para manejar arrays y objetos | 3 | 3 | **Medio (9)** | Ha tenido problemas de seguridad antes | Estar pendiente de actualizaciones, correr npm audit seguido |
| **dotenv** | 17.2.3 | Lee las variables del archivo .env (contraseñas, API keys, etc.) | 2 | 5 | **Medio (10)** | Si subimos el .env a Git, todos ven nuestras contraseñas | Verificar que .env esté en .gitignore. NUNCA subirlo al repo |
| **cors** | 2.8.5 | Controla qué dominios pueden llamar nuestra API | 3 | 3 | **Medio (9)** | Si está muy abierto cualquiera puede usar nuestra API | NO usar `origin: '*'`. Hacer lista blanca de dominios permitidos |
| **jose** | 4.15.9 | Maneja el cifrado de tokens JWT | 2 | 5 | **Bajo (10)** | Si usamos algoritmos viejos pueden romper los tokens | Usar algoritmos modernos (RS256 o ES256), cambiar las claves periódicamente |

---

## Otras dependencias importantes

| Librería | Versión | Para qué sirve | Riesgo | Notas |
|----------|---------|----------------|:------:|-------|
| **@okta/oidc-middleware** | 5.4.0 | Autenticación con Okta/Auth0 | **Bajo** | Mantener actualizado, revisar expiración de tokens |
| **express-openid-connect** | 2.19.2 | Integración con Auth0 / Okta | **Bajo** | Revisar que el client ID y secret estén en .env |
| **csrf-sync** | 4.2.1 | Protege contra ataques CSRF | **Bajo** | Validar que los tokens estén bien configurados |
| **joi** | 17.13.3 | Valida datos de formularios | **Bajo** | Validar todos los campos críticos (emails, passwords, etc.) |
| **openid-client** | 5.7.1 | Cliente para OpenID Connect | **Bajo** | Mantener actualizado |
| **debug** | 4.3.7 | Para hacer debugging | **Bajo** | Desactivar en producción (no dejar DEBUG=* prendido) |
| **uuid** | 9.0.1 | Genera IDs únicos | **Bajo** | No hay problema, funciona bien |
| **node-fetch** | 2.7.0 | Hace requests HTTP a otras APIs | **Bajo** | Validar las URLs antes de llamarlas (evitar SSRF) |
| **helmet** | 8.1.0 | Aumenta la seguridad del servidor Express | **Bajo** | Siempre activarlo para mitigar ataques XSS y clickjacking |

---

## Lo que encontró Snyk

El análisis más reciente de Snyk **no encontró vulnerabilidades críticas activas** en las dependencias actuales del proyecto. Las librerías principales (como express, helmet, lodash y socket.io) están actualizadas y mantenidas.

**Antes:**  
Se detectaban vulnerabilidades en `swig`, `uglify-js` y `minimist`.

**Ahora:**  
Estas dependencias ya no están presentes en el SBOM (reemplazadas por `nunjucks`).

**Total de componentes:** 177 (según el SBOM actual)

**SBOM generado por:** Snyk CLI 1.1300.1 (CycloneDX v1.4)  

---

## Mantenimiento regular

- Correr `npm audit` semanalmente
- Ejecutar análisis de Snyk mensualmente
- Actualizar dependencias críticas cuando salgan parches
- Revisar esta matriz constantemente

---

## Notas

Los riesgos pueden variar con el tiempo, así que hay que mantenerla actualizada. Si se detecta una nueva vulnerabilidad, actualizar este documento.

---
