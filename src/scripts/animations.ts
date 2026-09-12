import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function smoothScroll(): Lenis {
  const lenis = new Lenis({ duration: 1.05, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href')!);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });

  return lenis;
}

function reveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    const enter = { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' };

    // Те, що вже в кадрі на старті, ScrollTrigger не підхопить — програємо одразу.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      gsap.fromTo(el, { opacity: 0, y: 26 }, { ...enter, delay: 0.15 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 26 },
      { ...enter, scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
    );
  });

  // Заголовок героя виїжджає рядок за рядком одразу на завантаженні
  gsap.fromTo(
    '[data-reveal-line]',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.1 },
  );
}

// Сигнатурний момент: картки зі словами народжуються в хаосі
// і складаються в систему, поки читач гортає перший екран.
function wordField() {
  const field = document.querySelector<HTMLElement>('[data-word-field]');
  if (!field) return;

  const chips = gsap.utils.toArray<HTMLElement>('[data-chip]', field);

  chips.forEach((chip) => {
    const dx = Number(chip.dataset.dx ?? 0);
    const dy = Number(chip.dataset.dy ?? 0);
    const dr = Number(chip.dataset.dr ?? 0);

    gsap.set(chip, { x: dx, y: dy, rotate: dr, opacity: 0 });

    gsap.to(chip, {
      opacity: 1,
      duration: 0.6,
      delay: 0.3 + Math.random() * 0.5,
      ease: 'power2.out',
    });

    // Дрейф до того, як з'явиться система
    const drift = gsap.to(chip, {
      x: `+=${gsap.utils.random(-14, 14)}`,
      y: `+=${gsap.utils.random(-12, 12)}`,
      rotate: `+=${gsap.utils.random(-3, 3)}`,
      duration: gsap.utils.random(2.6, 4.2),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    gsap.to(chip, {
      x: 0,
      y: 0,
      rotate: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: field,
        start: 'top 72%',
        end: 'bottom 28%',
        scrub: 0.8,
        onEnter: () => drift.pause(),
        onLeaveBack: () => drift.play(),
      },
    });
  });
}

function navState() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: (self) => nav.classList.toggle('is-stuck', self.scroll() > 60),
  });
}

function parallaxPhoto() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

function floatArt() {
  gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el) => {
    gsap.to(el, { y: -12, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true });
  });
}

function magneticButtons() {
  if (matchMedia('(hover: none)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    const strength = 0.28;
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - (r.left + r.width / 2)) * strength,
        y: (e.clientY - (r.top + r.height / 2)) * strength,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// Нативний <details> не анімується — розкриваємо вручну.
function accordion() {
  document.querySelectorAll<HTMLDetailsElement>('[data-qa]').forEach((item) => {
    const body = item.querySelector<HTMLElement>('.qa__body');
    const summary = item.querySelector('summary');
    if (!body || !summary) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (item.open) {
        gsap.to(body, {
          height: 0,
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            item.open = false;
            gsap.set(body, { height: 'auto' });
          },
        });
        return;
      }

      item.open = true;
      gsap.fromTo(
        body,
        { height: 0 },
        {
          height: 'auto',
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => ScrollTrigger.refresh(),
        },
      );
    });
  });
}

// Заглушка YouTube: важкий iframe вантажимо лише на клік.
function videoFacade() {
  document.querySelectorAll<HTMLElement>('[data-yt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.yt;
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      frame.title = 'Відео';
      frame.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
      btn.replaceChildren(frame);
    });
  });
}

export function init() {
  accordion();
  videoFacade();

  if (reduced) return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.dataset.animInit = 'true';

  // Стрибок на якір робимо до reveals(), інакше секція лишиться прихованою:
  // її тригер уже позаду, а «що видно на старті» рахується саме тут.
  if (location.hash) {
    document.querySelector(location.hash)?.scrollIntoView();
  }

  smoothScroll();
  reveals();
  wordField();
  navState();
  parallaxPhoto();
  floatArt();
  magneticButtons();

  // Ліниві зображення зсувають розмітку вже після того, як тригери прораховані
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
