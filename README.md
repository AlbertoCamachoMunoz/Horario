# Horarios - Gestión de Empleados (PWA)

Aplicación web progresiva (PWA) construida con Vanilla JavaScript, HTML5 y CSS3, diseñada para gestionar horarios de empleados, calcular costes por horas y generar informes de pagos. Su arquitectura permite que funcione de manera completamente autónoma sin conexión a internet y puede ser empaquetada como una aplicación nativa de Android (.apk).

---

## 🚀 Características Principales

*   **Sin dependencias pesadas:** No requiere Angular, React ni frameworks CSS. Pura velocidad y simplicidad.
*   **Offline First:** Gracias al `service-worker.js`, toda la aplicación se guarda en la memoria del dispositivo tras la primera carga.
*   **Base de datos local:** Almacenamiento persistente en el dispositivo del usuario sin necesidad de servidores externos.
*   **Instalable:** Puede instalarse directamente desde el navegador (Chrome/Edge) o convertirse en un `.apk`.

---

## 📦 Guía de Compilación a .APK (Android)

Para evitar los requisitos de instalar **Android Studio**, **Android Command-line Tools** o gestionar versiones específicas de **Java (ej. Java 21)** de forma local, este proyecto utiliza un flujo de compilación externalizado mediante **Netlify** y **PWABuilder**.

### 🛠️ Requisitos Previos Locales
*   **Node.js**: v24.x o superior.
*   **NPM**: Incluido con Node.js.
*   *Nota: No se requiere instalación local de Java ni de Android SDK.*

### Paso 1: Preparación de Iconos y Entorno (Local)
PWABuilder requiere estrictamente que la aplicación cuente con iconos en formato `.png` de 192x192 y 512x512 píxeles declarados en el `manifest.json`.

1. Instalar dependencias del proyecto (incluye la librería `sharp` para procesar imágenes y el CLI de Netlify):
   ```bash
   npm install
   ```

2. Generar los iconos `.png` automáticamente a partir del `app/logo.svg` original:
   ```bash
   node generate-icons.js
   ```
   *Esto creará los archivos `app/icon-192.png` y `app/icon-512.png` necesarios.*

### Paso 2: Despliegue en Internet (Netlify)
Para que los servidores de PWABuilder puedan analizar y compilar la PWA, esta debe estar accesible públicamente a través de una URL segura (HTTPS).

1. Iniciar sesión en Netlify desde la terminal (abrirá una pestaña del navegador):
   ```bash
   npx netlify login
   ```

2. Desplegar la carpeta `app/` a producción creando un nuevo sitio:
   ```bash
   npx netlify deploy --dir=app --prod --create-site=horarios-app
   ```
   *(Puedes cambiar `horarios-app` por cualquier nombre único que prefieras).*

3. **Copiar la URL de Producción** que devuelve la terminal (ej: `https://horarios-app.netlify.app`).

### Paso 3: Generación del .APK (PWABuilder)
Este paso se realiza íntegramente en el navegador utilizando los servidores de Microsoft.

1. Navegar a [https://www.pwabuilder.com/](https://www.pwabuilder.com/).
2. En la barra central ("Ship your PWA to app stores"), **pegar la URL de Producción** obtenida en el Paso 2.
3. Hacer clic en el botón azul **"Start"**.
4. El sistema analizará la PWA. Deberías obtener una alta puntuación si el `manifest.json` y el `service-worker.js` están correctos.
5. Hacer clic en el botón **"Package for Store"**.
6. Seleccionar la plataforma **"Android"**.
7. Bajar hasta el final de la ventana emergente y hacer clic en **"Generate Package"**.
8. Se descargará un archivo `.zip`. Al descomprimirlo, encontrarás tu archivo **`.apk`**, listo para ser transferido e instalado en cualquier dispositivo Android.

---

## 🗂️ Estructura del Proyecto para Compilación

*   `app/` - Contiene el código fuente que se despliega.
    *   `manifest.json` - Declara la app como instalable, colores y rutas de iconos.
    *   `service-worker.js` - Gestiona la caché estática de archivos (`js/`, `css`) para el modo offline.
*   `generate-icons.js` - Script de automatización de Node.js para adaptar gráficos vectoriales a los requisitos de Android.
*   `package.json` - Dependencias de Node utilizadas exclusivamente para preparación y despliegue (no se empaquetan en el APK final).
