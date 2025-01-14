# Guía para Desplegar un Proyecto con FastApi y React

Este documento detalla los pasos necesarios para desplegar un proyecto que utiliza **FastApi** como backend y **React** como frontend.

## Requisitos previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema:

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [NPM](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/) (según tu preferencia)
- Un editor de código como [Visual Studio Code](https://code.visualstudio.com/)
- Git para clonar repositorios
---

## Estructura del Proyecto

```plaintext
project-root/
├── api-backend/ (FastApi)
│   ├── main.py
│   ├── .env
│   └── Dockerfile
...
├── api-react-cliente/ (React)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```


## Comando para iniciar el proyecto

Ambiente de prueba

```bash
sudo docker-compose up --build 
```


## Captura de pantalla
![Descripción de la imagen](/public/images/image.png)
![Descripción de la imagen](/public/images/image1.png)
