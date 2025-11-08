# Matriz de Riesgos 

Este documento lista las librerías que usamos en el proyecto y los riesgos que pueden aparecer si no se configuran correctamente o si presentan vulnerabilidades conocidas.

---

## Cómo leer la tabla

**Probabilidad (1–5):** Qué tan probable es que ocurra el riesgo  
**Impacto (1–5):** Qué tan grave sería si ocurre  
**Riesgo = Probabilidad × Impacto**

- **Bajo (1–8):** Riesgo controlado, solo mantener actualizado  
- **Medio (9–15):** Requiere atención o buena configuración  
- **Alto (16–25):** Riesgo crítico, debe corregirse de inmediato

---

## Dependencias críticas

| Librería | Versión | Para qué la usamos | Prob. | Impacto | Riesgo | Qué puede pasar | Mitigar |
|----------|---------|--------------------|:-----:|:-------:|:------:|-----------------|---------|
| **express** | 4.21.2 | Servidor web principal que maneja todas las rutas | 3 | 4 | **Medio (12)** | Si no se configura bien puede dejar endpoints expuestos o permitir inyección de cabeceras | Usar Helmet, validar y sanitizar todos los inputs, manejar errores globalmente |
| **express-session** | 1.18.2 | Maneja las sesiones de usuario con cookies | 4 | 5 | **Alto (20)** | Las sesiones pueden ser robadas si las cookies no están bien configuradas o si no hay HTTPS | Configurar cookies con `HttpOnly`, `Secure`, `SameSite=strict`, rotar ID de sesión tras login y usar HTTPS |
| **nunjucks** | 3.2.4 | Motor de plantillas HTML seguro y moderno | 2 | 4 | **Medio (8)** | Si no se activa el autoescape puede ocurrir inyección de código (SSTI o XSS) | Activar `autoescape: true`, sanitizar variables en plantillas |
| **socket.io** | 4.8.1 | Comunicación en tiempo real (chat o notificaciones) | 3 | 4 | **Medio (12)** | Alguien podría conectarse sin estar autenticado o interceptar mensajes | Validar autenticación en cada conexión, usar HTTPS/WSS |
| **lodash** | 4.17.21 | Funciones para manejar arrays y objetos | 3 | 3 | **Medio (9)** | Ha tenido vulnerabilidades en versiones pasadas | Mantener actualizado y ejecutar `npm audit` regularmente |
| **dotenv** | 16.4.5 | Carga variables del archivo `.env` (contraseñas, API keys, etc.) | 2 | 5 | **Medio (10)** | Si se sube el `.env` al repositorio, se exponen credenciales | Asegurar que `.env` esté en `.gitignore`, usar variables de entorno seguras en producción |
| **cors** | 2.8.5 | Controla qué dominios pueden consumir nuestra API | 3 | 3 | **Medio (9)** | Si está muy abierto, cualquiera puede usar nuestra API | No usar `origin: '*'`, aplicar lista blanca de dominios |
| **jose** | 4.15.9 | Firma y verifica tokens JWT | 2 | 5 | **Medio (10)** | Si se usan algoritmos obsoletos, los tokens pueden falsificarse | Usar algoritmos modernos (`RS256` o `ES256`), rotar claves y validar expiración correctamente |

---

## Otras dependencias importantes

| Librería | Versión | Para qué sirve | Riesgo | Notas |
|----------|---------|----------------|:------:|-------|
| **@okta/oidc-middleware** | 5.4.0 | Autenticación con Okta/Auth0 | **Bajo** | Mantener actualizado, revisar expiración y refresco de tokens |
| **express-openid-connect** | 2.19.2 | Integración con Auth0 / Okta | **Bajo** | Asegurar que `clientID`, `secret` y `issuerBaseURL` estén en `.env` |
| **csrf-sync** | 4.2.1 | Protege contra ataques CSRF | **Bajo** | Validar correctamente los tokens CSRF en cada solicitud POST |
| **joi** | 17.13.3 | Valida datos de formularios | **Bajo** | Validar todos los campos críticos (emails, contraseñas, IDs) |
| **openid-client** | 5.7.1 | Cliente para OpenID Connect | **Bajo** | Mantener actualizado y validar issuer/token |
| **debug** | 4.3.7 | Herramienta de debugging | **Bajo** | Desactivar en producción (`DEBUG=*` debe estar apagado) |
| **uuid** | 9.0.1 | Genera identificadores únicos | **Bajo** | Sin riesgos conocidos |
| **node-fetch** | 2.7.0 | Realiza peticiones HTTP a otras APIs | **Bajo** | Validar las URLs antes de llamar para evitar SSRF |
| **helmet** | 8.1.0 | Aumenta la seguridad del servidor Express | **Bajo** | Activar en todos los entornos para mitigar XSS, clickjacking y otras amenazas |

---

## Resultados de análisis Snyk 

 **Fecha del análisis:** noviembre 2025  
 **Herramienta:** Snyk CLI (CycloneDX v1.4)  
 **Componentes totales:** ~177

**Resultado:** No se encontraron vulnerabilidades críticas activas en las dependencias actuales del proyecto.

**Antes:**  
Se detectaban vulnerabilidades en `swig`, `uglify-js` y `minimist`.  

**Ahora:**  
Estas dependencias ya no están presentes (reemplazadas por `nunjucks`).

---

## Mantenimiento y monitoreo continuo

- Ejecutar `npm audit` semanalmente  
- Correr análisis de Snyk mensualmente  
- Usar `npm outdated` para revisar versiones  
- Mantener los paquetes críticos (express, helmet, lodash, socket.io, jose) actualizados  
- Revisar esta matriz en cada release o cambio de entorno  
- Utilizar `snyk monitor` o `dependabot` para seguimiento automático de vulnerabilidades  

---

## Referencias técnicas

- OWASP Top 10 (2025): A01 – Broken Access Control, A07 – Identification and Authentication Failures  
- OWASP ASVS v5.0: Secciones 2.4 (Autenticación), 3.2 (Gestión de Sesión), 5.2 (Validación de Entrada)  
- Snyk & npm Audit para monitoreo continuo de dependencias  

---
