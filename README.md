# ContactManager

Este proyecto es una aplicación web que permite gestionar contactos utilizando la API de HubSpot. Proporciona funcionalidades para buscar, agregar y visualizar información de contactos en una interfaz.

## Funcionalidades

- **Buscar Contactos:** Permite buscar contactos por su correo electrónico.
- **Agregar Contactos:** Permite agregar nuevos contactos proporcionando su nombre, apellido, correo electrónico y número de teléfono.
- **Visualizar Contactos:** Muestra los contactos existentes en una tabla con su información básica.

## Requisitos Previos

- Node.js instalado en tu sistema.
- Un accessToken de la API de hubspot

## Configuración

1. Clona este repositorio en tu máquina local.
2. Instala las dependencias ejecutando `npm install`.
3. Crea un archivo `.env` en la raíz del proyecto y agrega tu API Key de HubSpot:

## Uso

1. Ejecuta la aplicación con `npm start`.
2. Abre tu navegador y navega a `http://localhost:8080`.
3. Utiliza la interfaz para buscar, agregar y visualizar contactos.

## Estructura del Proyecto

- **`index.js`:** Archivo principal que configura y ejecuta el servidor Express.
- **`views/`:** Carpeta que contiene los archivos de plantillas EJS para las vistas de la aplicación.
- **`styles/`:** Carpeta que contiene archivos CSS para estilizar la interfaz.
- **`public/`:** Carpeta que almacena recursos estáticos como imágenes, scripts, etc.
- **`package.json`:** Archivo que especifica las dependencias del proyecto y scripts de comandos npm.
