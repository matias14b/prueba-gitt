# Formularios Tuenti #
 
## Descripción ##
Formularios para el inicio de los trámites en Tuenti y para la verificación de su estado. Estos son:
* Formulario de alta de portabilidad (https://portabilidad.tuenti.com.ar)
* Formulario de alta de portabilidad para clientes referidos (https://invita.tuenti.com.ar/formulario)
* Landing para clientes referidos (https://invita.tuenti.com.ar)
* Formulario de solicitud de nueva línea (https://pedituchip.tuenti.com.ar)
* Sitio web de autogestión (https://autogestion.tuenti.com.ar)
 
## Requisitos ##
* Aplicación *portabilidad* ejecutándose
* Aplicación *tuenti-correos* ejecutándose
 
## Instalación ##
* Clonar el proyecto
* En el archivo public_html/js/app/service/utils.js, reemplazar la palabra "host" por la IP y puerto de la aplicación de portabilidad (ej: http://localhost:8989)

Adicionalmente, para poder probar las funciones de PWA y Web Push de autogestión, es necesario:

* En el archivo public_html/js/app/service/notificacionesPwa.js, reemplazar el string "<WEBPUSH_PUBLIC_KEY>" por la clave pública de API Web Push de desarrollo (BP0ocAqM_gbFW7opq3AuykcTfQFykn8AUKp0WaQ-iDdK4S6B9On6pO1MpNxvfYpv4OVsQfJtL1ifP4EqjKKhfGI)
* En los archivos public_html/serviceWorkerAutogestion.js y public_html/js/app/app.js, reemplazar el string "<AUTOGESTION_BASE_URL>" por el esquema y host de autogestión (ej: http://localhost:5500)
* Levantar el sitio con Live Server o alguna aplicación similar, con HTTPS habilitado y sirviendo como página por defecto public_html/autogestion.html
 
## Integraciones ##
* Aplicación de [Portabilidad](https://gitlab.com/somospnt/tuenti/portabilidad)
* Aplicación de [Correos](https://gitlab.com/somospnt/tuenti/tuenti-correos) (a través de la de Portabilidad)
* Notificaciones Web Push a través de [Push API](https://developer.mozilla.org/es/docs/Web/API/Push_API) (En el KeePass de SomosPNT podes encontrar información sobre la cuenta productiva de Firebase, donde podemos acceder a las claves pública y privada de producción)
 
## Dónde empezar ##
### Si no necesita probarse PWA y Web Push de autogestión ###
* Abrir el html del formulario deseado en un navegador.

### Si se desea probar PWA y Web Push de autogestión ###
* Levantar un servidor de contenido estático como Live Server, Apache, etc.
* Configurar HTTPS en localhost, por ejemplo mediante [MKCert](https://github.com/FiloSottile/mkcert)
* Anotar el puerto donde vamos a levantar el sitio y seguir las instrucciones de la sección "Instalación"
   
## Entornos ##
### Entorno de Desarrollo - Servidor Dev: ###
* Formulario de alta de portabilidad (https://portabilidad.tuenti.dev.somospnt.com)
* Formulario de alta de portabilidad para clientes referidos (https://invita.tuenti.dev.somospnt.com/formulario)
* Landing para clientes referidos (https://invita.tuenti.dev.somospnt.com)
* Formulario de solicitud de nueva línea (https://pedituchip.tuenti.dev.somospnt.com)
* Sitio web de autogestión (https://autogestion.tuenti.dev.somospnt.com)

### Entorno de Productivo - Servidor Tuenti: ###
* Formulario de alta de portabilidad (https://portabilidad.tuenti.com.ar)
* Formulario de alta de portabilidad para clientes referidos (https://invita.tuenti.com.ar/formulario)
* Landing para clientes referidos (https://invita.tuenti.com.ar)
* Formulario de solicitud de nueva línea (https://pedituchip.tuenti.com.ar)
* Sitio web de autogestión (https://autogestion.tuenti.com.ar)
 
## Más información ##
 
Los formularios cuentan con ciertos parámetros opcionales que informamos a continuación:

### Formulario portabilidad (común y referidos) ###

| Parámetro | Descripción |
|:---:|:---|
| codigoPromocional | Admite cualquier string. Solo sirve en conjunto con el parámetro *showBanner=false*. Sirve para completar automáticamente el campo "Código promocional" con el valor indicado. |
| showBanner | Admite un booleano (*true* o *false*). Sirve para mostrar u ocultar el banner de la página. Su propósito es ocultar el banner cuando se embebe el formulario en otro sitio. |
| testing | Admite un booleano (*true* o *false*). Sirve para desactivar el captcha y el envío de PIN en el formulario, para poder correr pruebas automatizadas. |
| producto | Admite cualquier string. Su propósito es informar al formulario en qué tipo de promoción hizo click el usuario antes de acceder al formulario, a fin de reflejar ese valor en los eventos de Analytics. |

### Formulario nuevo chip ###

| Parámetro | Descripción |
|:---:|:---|
| producto | Admite cualquier string. Su propósito es informar al formulario en qué tipo de promoción hizo click el usuario antes de acceder al formulario, a fin de reflejar ese valor en los eventos de Analytics. |

### Sitio de autogestión ###

| Parámetro | Descripción |
|:---:|:---|
| nuevaLineaToken | Admite cualquier string. Su propósito es ingresar directamente a una nueva línea en cuestión, usando el token para obtener los datos de ese cliente. No puede usarse junto con *portabilidadToken* |
| portabilidadToken | Admite cualquier string. Su propósito es ingresar directamente a una portabilidad en cuestión, usando el token para obtener los datos de ese cliente. No puede usarse junto con *nuevaLineaToken* |