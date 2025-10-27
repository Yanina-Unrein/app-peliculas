# 🎬 MovieApp – Aplicación de Películas en Angular

## 📖 Descripción

MovieApp es una aplicación desarrollada con Angular que permite explorar una colección de películas, ver detalles individuales, y disfrutar de una interfaz moderna y completamente responsiva.
El proyecto fue creado como práctica para afianzar conceptos de componentes, servicios, comunicación entre componentes y diseño adaptable.

## 🚀 Funcionalidades Principales

- 🔍 Listado de películas: muestra todas las películas disponibles.

- 🏠 Sección Hero: destaca las 5 películas más recientes o destacadas.

- 🎞️ Vista detallada: al seleccionar una película, se abre un modal con su descripción, imagen y más información.

- 📱 Diseño responsive: adaptado a pantallas móviles, tablets y escritorio.

- 🍔 Menú hamburguesa: visible en dispositivos móviles; en tablet y escritorio, se muestra la navegación normal.

- 🌙 Estilo moderno: interfaz con esquema de colores oscuros y scroll personalizado transparente.

## ⚙️ Tecnologías Utilizadas

- Angular – Framework principal.

- TypeScript – Tipado fuerte y estructura del código.

- HTML5 / CSS3 – Diseño de la interfaz.

## 📦 Instalación y Uso

Cloná este repositorio:
```bash
git clonehttps://github.com/Yanina-Unrein/app-peliculas.git
cd movie-app-peliculas
npm install
ng serve
```

## Configuración para desarrollo

1. **Clona el repositorio**
2. **Instala dependencias**: `npm install`
3. **Configura environment**:
   - Copia `src/environments/environment.example.ts` a `src/environments/environment.ts`
   - Obtén una API key de [TMDB](https://www.themoviedb.org/settings/api)
   - Agrega tu API key en `environment.ts`

4. **Ejecuta localmente**: `ng serve`

## Variables de entorno necesarias

- `TMDB_API_KEY`: Tu API key de TMDB

## Despliegue

La app está configurada para Vercel. Las variables de entorno se configuran en el dashboard de Vercel.

Abrí tu navegador en:
👉 http://localhost:4200/