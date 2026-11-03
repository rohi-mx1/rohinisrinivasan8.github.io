// NAVBAR SCROLL EFFECT

const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
});


// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});


// SCROLL ANIMATION

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

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});


// CONTACT FORM

document.getElementById("contactForm").addEventListener("submit", event => {

    event.preventDefault();

    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const message = document.getElementById("cf-msg").value.trim();

    const subject = encodeURIComponent("Portfolio enquiry from " + name);

    const body = encodeURIComponent(
        "Name: " + name +
        "\nEmail: " + email +
        "\n\n" + message
    );

    document.getElementById("formStatus").textContent =
        "Opening your email application...";

    window.location.href =
        `mailto:rohinimec8@gmail.com?subject=${subject}&body=${body}`;

});


// ANIMATED BACKGROUND

const canvas = document.getElementById("net-canvas");
const ctx = canvas.getContext("2d");

let points = [];

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    points.forEach((p, i) => {

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        for (let j = i + 1; j < points.length; j++) {

            const q = points[j];

            const distance = Math.hypot(
                p.x - q.x,
                p.y - q.y
            );

            if (distance < 105) {

                ctx.strokeStyle =
                    `rgba(101,214,208,${(1 - distance / 105) * 0.17})`;

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();

            }

        }

        ctx.fillStyle = "rgba(244,185,66,.35)";

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();

    });

    requestAnimationFrame(drawNetwork);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

drawNetwork();