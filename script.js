document.addEventListener('DOMContentLoaded', function() {
            // Asegúrate de que este ID coincida con el formulario: id="registrationForm"
            const form = document.getElementById('registrationForm');
            const mensajeExito = document.getElementById('mensaje-exito');
            
            // ==========================================================
            // 1. CONFIGURACIÓN: URL de tu Apps Script
            // ==========================================================
            // REEMPLAZA ESTA URL con la que obtuviste después de desplegar tu Google Apps Script.
            const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbxs8sIUyzxDIXRlCDn7DbBAbVXFcYdf43ZUIBpCclHLsLuYKsTg3Pv_xwbGHDIq1ct_2Q/exec'; 
            

            const submitButton = form.querySelector('button[type="submit"]');

            form.addEventListener('submit', function(event) {
                event.preventDefault(); 
                
                // ==========================================================
                // 2. CAPTURA DE DATOS (Asegúrate que los IDs coincidan con el HTML)
                // ==========================================================
                const dataToSend = new URLSearchParams();
                
                // Estos 'append' deben coincidir con los 'name' del HTML y las columnas de tu hoja de cálculo
                dataToSend.append('nombre', document.getElementById('nombre').value.trim()); 
                dataToSend.append('apellidos', document.getElementById('apellidos').value.trim()); 
                dataToSend.append('codigo_trabajador', document.getElementById('codigo_trabajador').value.trim()); 
                dataToSend.append('area', document.getElementById('area').value.trim()); 
                dataToSend.append('correo', document.getElementById('correo').value.trim());
                
                // Validación simple de campos vacíos
                let isValid = true;
                dataToSend.forEach(value => {
                    if (value === '') isValid = false;
                });
                
                if (!isValid) {
                    alert('Por favor, completa todos los campos requeridos.');
                    return; 
                }
                
                // ==========================================================
                // 3. GESTIÓN DE UI Y PREPARACIÓN DE URL (Método GET)
                // ==========================================================
                submitButton.disabled = true;
                submitButton.textContent = 'Registrando... ⏳';

                // Añade los datos como parámetros de URL
                const finalUrl = `${URL_APPS_SCRIPT}?${dataToSend.toString()}`;

                // ==========================================================
                // 4. ENVÍO DE DATOS ASÍNCRONO (FETCH API con GET)
                // ==========================================================
                fetch(finalUrl, {
                    method: 'GET', // Usamos GET para enviar datos a través de la URL (Query Parameters)
                })
                .then(response => {
                    // La respuesta del Apps Script en GET suele ser un redirect, por eso 
                    // simplemente asumimos éxito si la solicitud no falló.
                    if (!response.ok) {
                         throw new Error('La solicitud falló con código de estado: ' + response.status);
                    }
                    return response.text(); 
                })
                .then(data => {
                    console.log('Registro enviado. Respuesta del servidor:', data);
                    
                    // Éxito: Limpia el formulario y muestra el mensaje
                    form.reset(); 
                    form.classList.add('hidden'); // Oculta el formulario
                    mensajeExito.classList.remove('hidden'); // Muestra el mensaje de éxito
                })
                .catch(error => {
                    alert('Hubo un error de conexión al registrarte. Por favor, revisa la URL del script y la conexión. ' + error.message);
                    console.error('Error en la solicitud Fetch:', error);
                })
                .finally(() => {
                    // Se ejecuta siempre para restaurar el botón.
                    submitButton.disabled = false;
                    submitButton.textContent = 'Inscribirse';
                    
                    // Opcional: Ocultar el mensaje de éxito y mostrar el formulario de nuevo después de 5 segundos
                    setTimeout(() => {
                        mensajeExito.classList.add('hidden');
                        form.classList.remove('hidden');
                    }, 5000); 
                });

            });
        });