# DigiPath: Diagnóstico de Madurez Digital

Frontend para un sistema predictivo de madurez digital, diseñado para MYPEs Industriales Manufactureras de Lima.

![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

## Tecnologías Principales

-   **Framework:** React
-   **Lenguaje:** TypeScript
-   **Build Tool:** Vite
-   **Gestor de Paquetes:** Bun
-   **Estilos:** Tailwind CSS
-   **Componentes:** Shadcn/ui
-   **Gestión de Estado de Servidor:** TanStack Query
-   **Routing:** React Router

## Primeros Pasos

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener **Bun** instalado. Si no lo tienes, instálalo con el siguiente comando:

```bash
# Para PowerShell (Windows)
powershell -c "irm bun.sh/install.ps1|iex"

# Para macOS / Linux
curl -fsSL https://bun.sh/install | bash

```

## Instalación

### 1. Clona el repositorio
```Bash
git clone https://github.com/ifpareja28/DigiPath.git
```

### 2. Navega al directorio del proyecto
```Bash
cd DigiPath
```

### 3. Instala las dependencias
```Bash
bun install
```

### 4. Inicia el servidor de desarrollo
```Bash
bun run dev
```

La aplicación estará disponible en http://localhost:8080.

## Scripts disponibles

```Bash
# bun run dev   : inicia el servidor de desarrollo.
# bun run build : compila la aplicación para producción.
# bun run lint  : ejecuta el linter para analizar el código.
# bun run preview: previsualiza el build de producción.
```

## Licencia

Este proyecto está distribuido bajo la Licencia ISC.