
// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================

const nav = document.getElementById("nav");

if (nav) {
    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
}


// ==========================================
// MOBILE MENU
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}


// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
} else {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
}


// ==========================================
// CONTACT FORM
// ==========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("cf-name")?.value.trim();
        const email = document.getElementById("cf-email")?.value.trim();
        const message = document.getElementById("cf-msg")?.value.trim();

        const formStatus = document.getElementById("formStatus");

        if (!name || !email || !message) {
            if (formStatus) {
                formStatus.textContent = "Please fill in all fields.";
            }
            return;
        }

        const subject = encodeURIComponent(
            "Portfolio enquiry from " + name
        );

        const body = encodeURIComponent(
            "Name: " + name +
            "\nEmail: " + email +
            "\n\nMessage:\n" + message
        );

        if (formStatus) {
            formStatus.textContent =
                "Opening your email application...";
        }

        window.location.href =
            `mailto:rohinimec8@gmail.com?subject=${subject}&body=${body}`;
    });
}


// ==========================================
// ANIMATED NETWORK BACKGROUND
// ==========================================

const canvas = document.getElementById("net-canvas");

if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
        let points = [];
        let animationId;

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();

            const dpr = Math.min(
                window.devicePixelRatio || 1,
                2
            );

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            points = Array.from(
                { length: Math.floor(rect.width / 22) },
                () => ({
                    x: Math.random() * rect.width,
                    y: Math.random() * rect.height,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25
                })
            );
        }

        function drawNetwork() {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            ctx.clearRect(0, 0, width, height);

            points.forEach((point, i) => {
                point.x += point.vx;
                point.y += point.vy;

                if (point.x < 0 || point.x > width) {
                    point.vx *= -1;
                }

                if (point.y < 0 || point.y > height) {
                    point.vy *= -1;
                }

                for (let j = i + 1; j < points.length; j++) {
                    const other = points[j];

                    const distance = Math.hypot(
                        point.x - other.x,
                        point.y - other.y
                    );

                    if (distance < 105) {
                        ctx.strokeStyle =
                            `rgba(101,214,208,${(1 - distance / 105) * 0.17})`;

                        ctx.beginPath();
                        ctx.moveTo(point.x, point.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }

                ctx.fillStyle = "rgba(244,185,66,.35)";

                ctx.beginPath();
                ctx.arc(point.x, point.y, 1.3, 0, Math.PI * 2);
                ctx.fill();
            });

            if (!document.hidden) {
                animationId = requestAnimationFrame(drawNetwork);
            }
        }

        function startAnimation() {
            if (!animationId) {
                animationId = requestAnimationFrame(drawNetwork);
            }
        }

        function stopAnimation() {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        resizeCanvas();
        startAnimation();

        window.addEventListener("resize", () => {
            resizeCanvas();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    }
}


// ==========================================
// PROJECT IMAGE DRAG / ROTATE
// ==========================================

document.querySelectorAll(".rotate-image").forEach(image => {
    let isDragging = false;
    let startX = 0;
    let rotation = -12;

    image.addEventListener("pointerdown", event => {
        isDragging = true;
        startX = event.clientX;

        image.style.cursor = "grabbing";

        image.setPointerCapture(event.pointerId);
    });

    image.addEventListener("pointermove", event => {
        if (!isDragging) return;

        const difference = event.clientX - startX;

        rotation += difference * 0.5;
        startX = event.clientX;

        image.style.transform = `rotateY(${rotation}deg)`;
    });

    function stopDragging() {
        isDragging = false;
        image.style.cursor = "grab";
    }

    image.addEventListener("pointerup", stopDragging);
    image.addEventListener("pointercancel", stopDragging);
    image.addEventListener("lostpointercapture", stopDragging);
});
