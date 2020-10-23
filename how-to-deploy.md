# CI/CD
El siguiente artículo explica lo que se debe realizar para configurar el CI/CD de un proyecto en Github. En resumen se realizarán los siguientes pasos:

1. Crear nueva máquina en EC2
1. Crear subdominio
1. Configurar máquina creada en EC2
1. Configurar SSL
1. Configurar Github
1. Instalar Backend y Frontend
1. Configurar CircleCI

# Crear nueva máquina en EC2
Esta nueva máqina será la encargada de alojar el frontend y el backend de la aplicación. Para crear una nueva máquina seguiremos los siguientes pasos:

1. Ingresar a "EC2" > "Instances" > "Launch Instance". 
1. Utilizaremos una AMI personalizada que ya tiene configuraciones de base, esta nueva AMI se llama "warehouse-prod"
1. Debemos utilizar la llave "prod-warehouse2" para poder ingresar a la máquina. 

**Notas**:

* Se recomienda separar la máquina, es decir, backend y frontend deberían estar en máquinas independientes.
* Por seguridad, todas las máquinas deberían tener llaves diferentes, a manera de ejemplo y como ya los otros servidores se han configurado así, se sigue este patrón.
# Crear subdominio
Debido a que vamos a desplegar un sitio bajo un subdominio (para el ejemplo https://b3.amzlstationhealth.com), debemos primero crear el subdominio `b3`, el subdominio nos permitirá apuntar a la IP pública de una máquina, AWS cuenta con servicio de administración de dominios, **Route53**. Para crear el subdominio `b3.amzlstationhealth.com` realizaremos los siguientes pasos:

* Ingresar a https://console.aws.amazon.com/route53/ > "Hosted Zones" > "Click al dominio" > "Create recordset"
* Aquí estableceremos la IP pública donde se encuentra el servidor (esta es obtiene de la máquina en EC2, parámetro: IPv4 Public IP)
* También debermos establecer cuál será el subdominio en el campo, "name"
# Configurar máquina creada en EC2
Ahora crearemos dos scripts (deploy.sh y deploy_backend.sh) los cuales serán ejecutados por CircleCI en un paso posterior. Estos dos scripts realizarán tres acciones:

1. Hacer un pull el código
1. Actualizar dependencias
1. Reiniciar la aplicación (sólo backend)

Para esto, primero crearemos los archivos como en el siguiente ejemplo:

Archivo para frontend, `deploy.sh`: 

```
#!/bin/bash

echo "Entering in the dir"
cd /var/www/amzl-sh-frontend
echo "Pulling changes"
git pull origin development
echo "Installing dependencies"
npm i
echo "Bulding project"
npm run build
echo "Done!"

```

Archivo para backend, `deploy_backend.sh`: 

```
#!/bin/bash

echo "Entering in the dir"
cd /var/www/amzl-sh-backend
echo "Pulling changes"
git pull origin development
echo "Installing dependencies"
npm i
echo "Restarting the pm2"
pm2 restart 0
echo "Done!"

```


Ahora debemos configurar los archivos de `nginx` los cuales se encuentran en las siguientes ubicaciones:

* /etc/nginx/conf.d/default
* etc/nginx/sites-available/default

**Nota**:
* Esta configuración depende mucho de los proyectos, es necesario revsiar instalaciones anteriores para tomar datos semejantes.
# Configurar certificado SSL
Para configurar un certificado SSL utilizaremos  `certbot` (https://certbot.eff.org). Esta entidad otorga certificados gratuitos, seguiremos las instrucciones para instalar la utilidad en caso que esta no se encuentre instalada en la máquina, posteriormente realizaremos lo siguiente:

* *sudo certbot --nginx*, esto para iniciar certbot utilizando el servidor web que tenemos, nginx
* *seleccionar el dominio/subdominio*, certbot nos preguntará a qué dominio o subdominio queremos aplicar el certificado
* *seleccionar redirect (opción 2)*, esto permitirá redireccionar a https
## Ejemplo de configuración

```
ubuntu@ip-172-31-19-145:/etc/nginx/sites-enabled$ sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx

Which names would you like to activate HTTPS for?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: amzlstationhealth.com
2: b3.amzlstationhealth.com
3: www.amzlstationhealth.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 2
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for b3.amzlstationhealth.com
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/default

Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/default

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://b3.amzlstationhealth.com

You should test your configuration at:
https://www.ssllabs.com/ssltest/analyze.html?d=b3.amzlstationhealth.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/b3.amzlstationhealth.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/b3.amzlstationhealth.com/privkey.pem
   Your cert will expire on 2020-08-25. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot again
   with the "certonly" option. To non-interactively renew *all* of
   your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

```

Con esto, ya podremos acceder a la aplicación mediante el protocolo HTTPS.
# Configurar Github
Debido a que esta máquina realizará pulls sobre los repositorios, debe tener permisos para acceder a estos, una forma de otorgar este acceso es mediante SSH, para más información, puedes visitar acá: https://help.github.com/en/enterprise/2.15/user/articles/adding-a-new-ssh-key-to-your-github-account

Para este despliegue se generaron estas llaves mediante el siguiente comando, `ssh-keygen -t rsa -b 4096 -C "dduarte@dulink.net”`
# Instalar Backend y Frontend
Dependiendo de la configuración realizada en el archivo de nginx, se deberá clonar el repositorio para backend y otro para frontend, para el ejemplo, se clonaron estos repositorios en los siguientes directorios:

```
1. /var/www/amzl-sh-backend
2. /var/www/amzl-sh-frontend
```
## Frontend
Para frontend, se sugiere construir el proyecto la primera vez para validar que este se construye de manera correcta

	npm run build 
	posterior a esto, verificar que en el directorio /dist se encuentren los archivos de la aplicación
## Backend
Para backend, se debe realizar lo siguiente:

1. Actualizar dependencias mediante `npm install`
1. Ejecutar la aplicación mediante, `pm2 start index.js --name BACKEND_AMZL`
1. Verificar que `pm2` haya cargado la aplicación correctamente mediante `pm2 ls`
1. Verificar que el backend este funcionando mediante `cURL`.

``` 
ubuntu@ip-172-31-2-55:/var/www/amzl-sh-backend$ curl localhost:8000
<h1>Hello world from the backend</h1>
```
## Comandos útiles
Acá hay un par de comandos útiles al configurar la aplicación

* **Reiniciar servicio**: sudo service nginx restart
* **Iniciar servicio**: sudo service nginx start
* **Detener servicio**: sudo service nginx stop
* **Status servicio**: service nginx status
# Configurar CircleCI
Por último, configuraremos CircleCI el cual ejecutará pruebas y se comunicará con las máquinas anteriormente configuradas para actualizar el código. Para esto debemo:

1. Configurar/crear el archivo de CircleCI en el repositorio y versionarlo (.circleci/config.yml) .
1. CircleCI se conecta mediante SSH para ejecutar el archivo que realiza el deploy (`deploy.sh` o `deploy_backend.sh` según el caso). Para que CircleCI tenga permisos de ingresar a esta máquina a ejecutar dicho comando, es necesario configurar la llave pública que fue otorgada al crear la instancia en EC2. Para realizar esto debemos ingresar al proyecto a configurar e ir a la opción "Project Settings" > "SSH Keys" > "Add SSH Key". Ingresamos public DNS de la máquina y la llave.
## Ejemplo de archivo
```
# Javascript Node CircleCI 2.0 configuration file
#
# Check https://circleci.com/docs/2.0/language-javascript/ for more details
#
version: 2
jobs:
  deploy:
    machine:
      enabled: true

    working_directory: ~/amazon-rts-backend

    steps:
      - checkout

      - add_ssh_keys: # add private SSH key from CircleCI account based on fingerprint
          fingerprints:
            - "02:56:a0:e6:ec:9c:98:67:77:7b:c3:87:cc:98:3d:da"
      - run:
          name: Deploy dev
          command: |
            if [[ "${CIRCLE_BRANCH}" == "development" ]]
            then
            ssh ubuntu@ec2-3-21-44-79.us-east-2.compute.amazonaws.com bash ./deploy_backend.sh
            ssh ubuntu@ec2-18-222-57-242.us-east-2.compute.amazonaws.com bash ./new_deploy_backend.sh
            fi
      - run:
          name: Deploy Master
          command: |
            if [[ "${CIRCLE_BRANCH}" == "master" ]]
            then
              echo ERROR NOT DEFINED
            fi

  build:
    docker:
      # specify the version you desire here
      - image: circleci/node:10.17

      # Specify service dependencies here if necessary
      # CircleCI maintains a library of pre-built images
      # documented at https://circleci.com/docs/2.0/circleci-images/
      # - image: circleci/mongo:3.4.4
    steps:
      - checkout

      # Download and cache dependencies
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-

      - run: npm install

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}

      # run tests!
      - run: echo "Everything good!"
workflows:
  version: 2
  main:
    jobs:
      - build
      - deploy:
          requires:
            - build
```
