# Crear Certificado en CertificateManager

URL: https://console.aws.amazon.com/acm/home?region=us-east-1#/

Necesitamos crear un certificado para posteriormente aplicarlo al balanceador de carga que creará ElasticBeanstalk (EB). Para esto seguiremos los siguientes pasos:

1. Request a certificate
2. Request a public certificate
3. Escribir los dominios que va a permitir el certificado, ejemplo: *.midominio.com
4. DNS Validation

Después de esto es necesario configurar el DNS para que permita validar que el dominio es propio. Para esto lo ideal es utilizar la opción que Amazon muestra. No pude tomar un screenshot acá.

# Crear ElasticBeanstalk

URL: https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-1#/environments

1. Create a new environment
2. Seleccionar Web server environment
3. Definir:
- Application name: Algún nombre para la aplicación
- Environment name: Nombre del entorno
- Domain, puede ir vacío
- Establecer plataforma: Node.js, branch 64bit amazon linux 2, versión 5.2.0
- Application code: Seleccionar subir el código manualmente
- Configure more options
- Seleccionar high availability
- En security seleccionar la llave que tendrá la máquina

Cuando se termine de crear el proyecto se debe configurar más información en EB.

## Configurar variables de entorno

* Ir a configuration
* Ir a software
* En environment properties asignar las variables de entorno necesarias dependiendo del proyecto.

## Configurar SSL Certificate en el Application Load Balancer

* Add listener
* Port: 443
* Protocol: HTTPS
* SSL Certificate: Asignar el certificado creado en el primer paso
* SSL Policy: ELBSecurityPolicy-TLS-1-2-Ext-2018-06

## Asignar EC2 key pair (opcional)

Si se quiere, se puede modificar el certificado en Configuration > Modify security

# Crear CodePipeline

URL: https://console.aws.amazon.com/codesuite/codepipeline/pipelines?region=us-east-1

CodePipeline nos permite conectar nuetro código con amazon para hacer automatic deploy. Debemos seguir los siguientes pasos.

* Crear pipeline settings
* Asignar el nombre de un pipeline name
* Conectar Github con CodePipeline
* Seleccionar repositorio y branch a desplegar (esto se puede cambiar en el futuro)
* Seleccionar GitHub webhooks
* No seleccionar build provider
* Seleccionar proyecto configurado en ElasticBeanstalk


