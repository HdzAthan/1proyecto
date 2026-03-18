# 💥 Me Rifan 💥

Una plataforma web interactiva para participar en rifas con números disponibles, compra de tickets y registro de participantes.

> Un proyecto enfocado en crear una experiencia de usuario moderna y responsive para gestionar rifas en línea.

---

## 📋 Tabla de contenidos

- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Páginas](#páginas)
- [Funcionalidades](#funcionalidades)
- [Autor](#autor)

---

## ✨ Características

- 🎰 **Grilla interactiva de números** - Visualiza 100 números disponibles
- 👤 **Formulario de registro** - Completa información para participar
- 📱 **Diseño responsive** - Funciona en celulares, tablets y pantallas grandes
- 🎨 **Interfaz moderna** - Estilos CSS limpios y profesionales
- ✅ **Validación de formularios** - Campos requeridos y lógica de validación
- 🔗 **Navegación fluida** - Enlaces directos entre páginas

---

## 📁 Estructura del proyecto

```
1proyecto/
├── index.html              # Página principal con grilla de rifas
├── formulario.html         # Página de registro y compra de tickets
├── README.md              # Este archivo
├── Css/
│   ├── Style.css          # Estilos principales (index)
│   └── formulario.css     # Estilos del formulario
├── Scripts/
│   ├── Script.js          # Lógica de la grilla de números
│   └── formulario.js      # Validación del formulario
└── WebPage/
    └── Style.css          # (Archivo anterior, no utilizado actualmente)
```

---

## 🛠️ Tecnologías utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos responsivos con media queries
- **JavaScript (Vanilla)** - Interactividad sin librerías externas
- **Git** - Control de versiones

---

## 🚀 Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/HdzAthan/1proyecto.git
   cd 1proyecto
   ```

2. **Abre el proyecto:**
   - Abre `index.html` en tu navegador
   - O usa un servidor local (recomendado):

     ```bash
     # Si tienes Python 3
     python -m http.server 8000

     # Si tienes Node.js con http-server
     npx http-server
     ```

---

## 💻 Uso

### Página Principal (`index.html`)

1. **Visualiza la grilla de números** - Se muestran 100 números disponibles
2. **Selecciona números** - Haz clic en un número para marcarlo como vendido (color rojo)
3. **Registrate** - Haz clic en el botón "Registrarse →" (naranja, arriba a la derecha)
4. **O compra directamente** - Usa el botón "JUGAR" para ir al formulario

### Página de Formulario (`formulario.html`)

1. **Completa tus datos:**
   - Nombre
   - Apellido
   - Cédula
   - Teléfono
   - Email

2. **Selecciona cantidad de números:**
   - 5 números
   - 10 números
   - 15 números
   - 20 números
   - (Solo puedes seleccionar una opción)

3. **Envía el formulario** - Haz clic en "Comprar"

4. **Vuelve al inicio** - Usa el botón "← Volver al inicio" (naranja, arriba)

---

## 🎯 Funcionalidades

### Grilla de números (`Script.js`)

- ✅ Genera 100 números automáticamente
- ✅ Permite marcar números como vendidos (cambio de color a rojo)
- ✅ Efecto de escala al venderse
- ✅ Interfaz responsive en todos los tamaños de pantalla

### Formulario (`formulario.js`)

- ✅ Validación de campos requeridos
- ✅ Solo permite seleccionar un paquete de números
- ✅ Mensajes de error claros
- ✅ Confirmación al enviar

### Estilos (`Style.css` y `formulario.css`)

- ✅ Paleta de colores coherente
- ✅ Animaciones suaves
- ✅ Grid responsive automático
- ✅ Media queries para celulares, tablets y pantallas grandes

---

## 📄 Páginas

### 1. **index.html** - Portada Principal

- Encabezado con título y descripción
- Botón "Registrarse" (naranja)
- Botón "JUGAR" rojo para ir al formulario
- Grilla de 100 números interactivos
- Pie de página con información

**URL Local:** `http://localhost:8000/index.html`

### 2. **formulario.html** - Registro y Compra

- Encabezado con botón "Volver al inicio"
- Formulario centrado en una tarjeta elegante
- Campos de texto validados
- Selección de cantidad de números con checkboxes
- Botón "Comprar" azul

**URL Local:** `http://localhost:8000/formulario.html`

---

## 🎨 Paleta de colores

| Color       | Hex       | Uso                           |
| ----------- | --------- | ----------------------------- |
| Azul oscuro | `#2c3e50` | Encabezados                   |
| Azul        | `#3498db` | Botones principales, hover    |
| Naranja     | `#ff9800` | Botones de navegación         |
| Rojo        | `#e74c3c` | Botón jugar, números vendidos |
| Blanco      | `#ffffff` | Fondos, textos primarios      |
| Gris        | `#f4f4f4` | Fondo general                 |

---

## 📱 Responsividad

El proyecto es completamente responsive:

- **Celulares** (≤ 600px): Stack vertical, botones full-width
- **Tablets** (≤ 900px): Ajustes de tamaño
- **Pantallas grandes** (≥ 1400px): Tamaños aumentados para mejor visibilidad

---

## 🔄 Control de versiones

El proyecto utiliza Git para el control de versiones. Último commit:

```
920ff06 - Separar formulario en página independiente con estilos CSS modernos
```

Cambios:

- Creación de `formulario.html` con formulario completo
- Creación de `formulario.css` con estilos modernos
- Creación de `formulario.js` con validación
- Actualización de `index.html` con botones de navegación
- Simplificación de `Script.js`

---

## 🌟 Mejoras futuras

- [ ] Backend para guardar datos de participantes
- [ ] Base de datos de registros
- [ ] Sistema de pagos integrado
- [ ] Panel de administración
- [ ] Historial de ganadores
- [ ] Notificaciones por email
- [ ] Autenticación de usuarios

---

## 👤 Autor

**HdzAthan**

- GitHub: [github.com/HdzAthan](https://github.com/HdzAthan)
- Repositorio: [github.com/HdzAthan/1proyecto](https://github.com/HdzAthan/1proyecto)

---

## 📝 Licencia

Este proyecto es experimental y educativo. Siéntete libre de modificarlo y adaptarlo a tus necesidades.

---

## 💬 Notas

- Este es un proyecto breve para experimentar y crecer
- El código es vanilla JavaScript sin dependencias externas
- Los estilos son CSS puro sin frameworks
- Perfecto para aprender y practicar desarrollo web

¡Vamos a ver como lo hacemos crecer! 🚀
