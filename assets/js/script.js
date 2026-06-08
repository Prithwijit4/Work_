const curEl = document.getElementById('cur');
const tf = document.getElementById('tf');

const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');

const ACCENT = '#e84a2f';
const DARK = '#1a1917';

const R = 200;

const BACK = [
    'UNTIL',
    'THEY',
    "DON'T"
];

let mx = -999;
let my = -999;

let cx = -999;
let cy = -999;

let curR = 0;
let targR = 0;

let hoveringText = false;

/* CANVAS SIZE */

function resize() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
}

resize();

window.addEventListener('resize', resize);

/* MOUSE */

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
});

/* HOVER ONLY ON TEXT */

tf.addEventListener('mouseenter', () => {
    hoveringText = true;
    targR = R;
});

tf.addEventListener('mouseleave', () => {
    hoveringText = false;
    targR = 0;
});

/* FONT SIZE */

function getFontSize() {
    return Math.min(
        Math.max(70, window.innerWidth * 0.095),
        138
    );
}

/* MAIN LOOP */

function loop() {

    /* CURSOR FOLLOW */

    cx += (mx - cx) * 0.13;
    cy += (my - cy) * 0.13;

    curEl.style.left = cx + 'px';
    curEl.style.top = cy + 'px';

    /* SMOOTH RADIUS */

    const speed = hoveringText ? 0.08 : 0.08;

    curR += (targR - curR) * speed;

    const r = curR;

    /* TEXT MASK */

    const tfRect = tf.getBoundingClientRect();

    const lx = cx - tfRect.left;
    const ly = cy - tfRect.top;

    if (r > 1) {

        const mask =
            `radial-gradient(circle ${r}px at ${lx}px ${ly}px, transparent 99%, black 100%)`;

        tf.style.webkitMaskImage = mask;
        tf.style.maskImage = mask;

    } else {

        tf.style.webkitMaskImage = 'none';
        tf.style.maskImage = 'none';

    }

    /* CANVAS */

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    if (r > 1) {

        /* ORANGE CIRCLE */

        ctx.save();

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);

        ctx.fillStyle = ACCENT;
        ctx.fill();

        ctx.restore();

        /* CLIPPED TEXT */

        ctx.save();

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);

        ctx.clip();

        const fs = getFontSize();

        const lh = fs * 0.95;

        const totalH = lh * 3;

        const tfRect2 = tf.getBoundingClientRect();

        const textMidY =
            tfRect2.top + tfRect2.height / 2;

        const startY =
            textMidY - totalH / 2;

        ctx.font =
            `900 ${fs*0.78}px syne`;

        ctx.fillStyle = DARK;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        BACK.forEach((line, i) => {

            ctx.fillText(
                line,
                window.innerWidth / 2,
                startY + i * lh
            );

        });

        ctx.restore();
    }

    requestAnimationFrame(loop);
}

loop();

/* LOADER */

const pctEl = document.getElementById('lpct');

const barEl = document.getElementById('lbar');

const loaderEl = document.getElementById('loader');

let pct = 0;

const iv = setInterval(() => {

    pct += Math.random() * 4 + 1;

    if (pct >= 100) {

        pct = 100;

        clearInterval(iv);

        startReveal();
    }

    const p = Math.floor(pct);

    pctEl.innerHTML =
        (p < 10 ? '0' : '') +
        p +
        '<span style="font-size:.55em;color:#e84a2f">%</span>';

    barEl.style.width = pct + '%';

}, 45);

/* REVEAL */

function startReveal() {

    setTimeout(() => {

        gsap.to(loaderEl, {
            yPercent: -100,
            duration: 1,
            ease: 'power3.inOut',

            onComplete: () => {
                loaderEl.style.display = 'none';
            }
        });

        gsap.set('#tf .row', {
            opacity: 0,
            y: 70
        });

        gsap.set('.nav-links a', {
            opacity: 0
        });

        const tl = gsap.timeline({
            defaults: {
                ease: 'power3.out'
            }
        });

        tl.to('.nav-logo', {
            opacity: 1,
            duration: .7,
            delay: .4
        })

        .to('.nav-links a', {
            opacity: 1,
            stagger: .1,
            duration: .5
        }, '-=.3')

        .to('#tf .row', {
            opacity: 1,
            y: 0,
            stagger: .15,
            duration: .9,
            ease: 'power4.out'
        }, '-=.2')

        .to('#hsub', {
            opacity: 1,
            duration: .6
        }, '-=.4')

        .to('#mq', {
            opacity: 1,
            duration: .5
        }, '-=.3')

        .to('#cbtn', {
            opacity: 1,
            duration: .5
        }, '-=.4');

    }, 200);
}