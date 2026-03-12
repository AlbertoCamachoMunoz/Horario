# Spec 14: APK Generation via Netlify and PWABuilder

## 1. Objetivo
Generar un archivo instalable `.apk` para Android a partir del código base Vanilla JS del proyecto `horarios`, sin necesidad de instalar Android Studio, SDKs locales ni modificar la versión local de Java (v25).

## 2. Estrategia
Dado que el entorno local tiene una versión de Java demasiado reciente para las herramientas de compilación de Android y carece del Android SDK, externalizaremos la compilación usando **PWABuilder**. Para que PWABuilder funcione, la aplicación debe estar accesible públicamente en internet. Usaremos **Netlify** para el hosting temporal/permanente.

## 3. Fases de Ejecución

### Fase 1: Verificación de Integridad (Automático - Agent)
Antes de subir nada, el agente debe asegurar que la PWA cumple los requisitos mínimos para ser empaquetada:
- Verificar que `manifest.json` existe y tiene los campos requeridos (`name`, `start_url`, `display`, `icons`).
- Verificar que `service-worker.js` cachea todos los archivos necesarios de `/js` y `/styles.css` para funcionar 100% offline.
- Confirmar que los iconos referenciados en el manifest existen en el directorio. *(Actualmente se usa `logo.svg`, que es válido, pero se advertirá si PWABuilder exige PNGs).*

### Fase 2: Despliegue en Netlify (Semi-Automático - Agent + Usuario)
El agente preparará el entorno para subir la carpeta `app/` a internet.
1. El agente instalará la herramienta de línea de comandos de Netlify (`netlify-cli`) en el proyecto.
2. El agente ejecutará el comando de despliegue: `npx netlify deploy --dir=app --prod`.
3. **Intervención del usuario:** La terminal pedirá al usuario que inicie sesión en Netlify (abrirá el navegador) o autorice el despliegue.
4. El agente capturará la **URL de Producción** generada (ej: `https://horarios-app.netlify.app`).

### Fase 3: Generación del APK (Manual - Usuario)
Debido a que PWABuilder no ofrece una API pública oficial estable para línea de comandos que no dependa del entorno local de Android, este paso final requiere usar su interfaz web.
1. El usuario debe copiar la URL obtenida en la Fase 2.
2. El usuario debe ir a [https://www.pwabuilder.com/](https://www.pwabuilder.com/).
3. Pegar la URL y hacer clic en "Start".
4. Una vez analizada, hacer clic en "Package for Store" -> "Android" -> "Generate Package".
5. Descargar el `.zip`, extraer el `.apk` e instalarlo en el dispositivo Android.

## 4. Criterios de Éxito
- La aplicación se sirve correctamente desde una URL pública con HTTPS.
- El manifest y el service worker son reconocidos como válidos por Lighthouse/PWABuilder.
- El APK generado se instala en Android y funciona sin conexión a internet tras el primer inicio.