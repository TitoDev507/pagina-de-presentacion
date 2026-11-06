/**
 * Script principal para Portfolio Express - Héctor Paredes
 * Gestiona la navegación móvil, animaciones al hacer scroll y el modal de contacto.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const btnContactar = document.getElementById('btn-contactar');
    const contactModal = document.getElementById('contact-modal');
    const modalClose = document.getElementById('modal-close');
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const currentYearSpan = document.getElementById('current-year');

    // 1. Actualizar el año actual en el pie de página
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Efecto de sombra en la barra de navegación al hacer scroll
    const actualizarEstadoHeader = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', actualizarEstadoHeader, { passive: true });
    actualizarEstadoHeader();

    // 3. Menú de navegación responsive para móvil
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const estaAbierto = navMenu.classList.toggle('open');
            menuToggle.classList.toggle('active', estaAbierto);
            menuToggle.setAttribute('aria-expanded', String(estaAbierto));
        });

        // Cerrar el menú móvil al pulsar cualquier enlace de navegación
        navLinks.forEach((enlace) => {
            enlace.addEventListener('click', () => {
                navMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 4. Animaciones de aparición suave al hacer scroll (IntersectionObserver)
    const elementosAnimables = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observador = new IntersectionObserver(
            (entradas, obs) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add('visible');
                        obs.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        elementosAnimables.forEach((elemento, indice) => {
            // Ligero retardo escalonado para tarjetas en la misma fila
            elemento.style.transitionDelay = `${(indice % 4) * 70}ms`;
            observador.observe(elemento);
        });
    } else {
        // Respaldo para navegadores antiguos
        elementosAnimables.forEach((elemento) => elemento.classList.add('visible'));
    }

    // 5. Gestión del modal interactivo de contacto
    const abrirModal = () => {
        if (!contactModal) return;
        contactModal.classList.add('active');
        contactModal.setAttribute('aria-hidden', 'false');
        const campoNombre = document.getElementById('nombre');
        if (campoNombre) {
            setTimeout(() => campoNombre.focus(), 100);
        }
    };

    const cerrarModal = () => {
        if (!contactModal) return;
        contactModal.classList.remove('active');
        contactModal.setAttribute('aria-hidden', 'true');
        if (formFeedback) {
            formFeedback.textContent = '';
        }
    };

    if (btnContactar) {
        btnContactar.addEventListener('click', abrirModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', cerrarModal);
    }

    if (contactModal) {
        // Cerrar al hacer clic fuera de la tarjeta del modal
        contactModal.addEventListener('click', (evento) => {
            if (evento.target === contactModal) {
                cerrarModal();
            }
        });
    }

    // Cerrar el modal al presionar la tecla Escape
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && contactModal?.classList.contains('active')) {
            cerrarModal();
        }
    });

    // 6. Simulación de envío del formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nombreUsuario = document.getElementById('nombre')?.value.trim() || '';

            if (formFeedback) {
                formFeedback.textContent = `¡Gracias por tu mensaje, ${nombreUsuario}! Te responderé muy pronto.`;
            }

            contactForm.reset();

            setTimeout(() => {
                cerrarModal();
            }, 2200);
        });
    }
});

