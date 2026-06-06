# 📍 Ubicacion de Punto de Venta — PWA

App móvil premium para registrar visitas a clientes con GPS.  
**Sin instalación de Node, sin servidor, funciona offline.**

---

## 📁 Estructura del proyecto

```
pwa-visitas/
├── index.html        ← La app completa (toda la lógica está aquí)
├── manifest.json     ← Permite instalarla como app en el celular
├── sw.js             ← Service Worker (permite uso offline)
├── icons/            ← Íconos de la app para el celular
│   ├── icon-192x192.png
│   └── icon-512x512.png  (y más tamaños)
└── README.md         ← Este archivo
```

---

## 🚀 Cómo subir a GitHub Pages (paso a paso)

### Paso 1 — Crear cuenta en GitHub (si no tienes)
1. Ve a [github.com](https://github.com)
2. Crea una cuenta gratuita

### Paso 2 — Crear repositorio nuevo
1. Haz clic en el botón verde **"New"** (o el ícono `+`)
2. Nombre del repositorio: `pdv-visitas` (o el que quieras)
3. Elige **Public**
4. Haz clic en **"Create repository"**

### Paso 3 — Subir los archivos
En la página de tu nuevo repositorio vacío:
1. Haz clic en **"uploading an existing file"**
2. Arrastra TODA la carpeta `pwa-visitas` (o selecciona todos los archivos)
3. Asegúrate de incluir la carpeta `icons/` con todas las imágenes
4. Haz clic en **"Commit changes"** (botón verde abajo)

### Paso 4 — Activar GitHub Pages
1. Ve a **Settings** (pestaña en tu repositorio)
2. En el menú izquierdo busca **"Pages"**
3. En "Source" selecciona **"Deploy from a branch"**
4. En "Branch" selecciona **"main"** y la carpeta **"/ (root)"**
5. Haz clic en **"Save"**

### Paso 5 — Obtener tu URL
Después de 1-2 minutos, tu app estará en:
```
https://TU_USUARIO.github.io/pdv-visitas/
```
¡Comparte ese link con tus vendedores!

---

## 📱 Cómo instalar la app en el celular

### En Android (Chrome):
1. Abre el link de GitHub Pages en Chrome
2. Aparecerá un banner abajo que dice **"Agregar a pantalla de inicio"**
3. Si no aparece: toca los 3 puntos (⋮) → "Agregar a pantalla de inicio"
4. Confirma y listo — aparecerá como ícono en tu pantalla

### En iPhone (Safari):
1. Abre el link en Safari (importante: no Chrome)
2. Toca el ícono de compartir (cuadrado con flecha arriba)
3. Desliza y toca **"Agregar a pantalla de inicio"**
4. Confirma

---

## 📋 Cómo usar la app

1. **Carga el Excel** → Toca el área de archivo y selecciona `ubicacion.xlsx`
2. **Selecciona el cliente** → Elige de la lista desplegable
3. **Elige el tipo de visita** → Toca "Semanal" o "Quincenal"
4. **Captura GPS** → Toca el botón y acepta el permiso de ubicación
5. **Guarda** → El Excel se descarga automáticamente con los datos

> 💡 **Tip:** Comparte el Excel descargado por WhatsApp o correo.

---

## 📊 Formato del archivo Excel

El archivo `ubicacion.xlsx` debe tener estas columnas exactas en la primera fila:

| Nombre Cliente | Visita al Cliente | Ubicacion |
|---|---|---|
| Ferretería El Clavo | Semanal | 20.603218,-101.370621 |
| Materiales Querétaro | | |

- **Nombre Cliente** — Nombre del cliente (se carga automático)
- **Visita al Cliente** — Se llena con "Semanal" o "Quincenal"
- **Ubicacion** — Se llena con "latitud,longitud" al capturar GPS

---

## ❓ Preguntas frecuentes

**¿Funciona sin internet?**  
Sí, una vez que la abriste al menos una vez, funciona offline.

**¿El GPS no funciona?**  
Asegúrate de haber dado permiso de ubicación al navegador en los ajustes del celular.

**¿Cómo actualizo la lista de clientes?**  
Edita el Excel con la nueva lista de clientes y vuelve a cargarlo en la app.

**¿Los datos se guardan en la nube?**  
No — todo se procesa localmente en el celular. El Excel se descarga para que tú lo compartas.

---

*Por Roberto Fierro A.*
