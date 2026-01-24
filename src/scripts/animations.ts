// Premium animations with GSAP + Lenis
// Stripped to core 6: fade-up, scale-up, stagger, smooth scroll, magnetic buttons, gradient-shift
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Initialize smooth scroll
export function initSmoothScroll() {
  if (prefersReducedMotion) return null

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  })

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenis
}

// Initialize scroll animations
export function initScrollAnimations() {
  if (prefersReducedMotion) {
    // Show all elements immediately if reduced motion is preferred
    gsap.utils.toArray<HTMLElement>('[data-animate]').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    gsap.utils.toArray<HTMLElement>('[data-animate-child]').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    return
  }

  // Fade up animations (primary reveal)
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((el) => {
    gsap.fromTo(el,
      {
        opacity: 0,
        y: 60
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  })

  // Fade in animations
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-in"]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  })

  // Scale up animations (price card)
  gsap.utils.toArray<HTMLElement>('[data-animate="scale-up"]').forEach((el) => {
    gsap.fromTo(el,
      {
        opacity: 0,
        scale: 0.9
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  })

  // Stagger animations for grids
  gsap.utils.toArray<HTMLElement>('[data-animate-stagger]').forEach((container) => {
    const children = container.querySelectorAll('[data-animate-child]')
    gsap.fromTo(children,
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  })
}

// Magnetic button effect (CTAs only)
export function initMagneticButtons() {
  if (prefersReducedMotion) return

  const buttons = document.querySelectorAll('[data-magnetic]')

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent
      const rect = (btn as HTMLElement).getBoundingClientRect()
      const x = mouseEvent.clientX - rect.left - rect.width / 2
      const y = mouseEvent.clientY - rect.top - rect.height / 2

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      })
    })

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      })
    })
  })
}

// Mouse-following gradient glow - throttled to 60fps
export function initMouseGradient() {
  if (prefersReducedMotion) return

  const containers = document.querySelectorAll('[data-mouse-glow]')
  const frameInterval = 1000 / 60 // 60fps throttle

  containers.forEach((container) => {
    const el = container as HTMLElement

    // Create gradient element
    const glow = document.createElement('div')
    glow.className = 'mouse-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500'
    glow.style.background = 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 107, 74, 0.15), transparent 40%)'
    el.style.position = 'relative'
    el.insertBefore(glow, el.firstChild)

    el.addEventListener('mouseenter', () => {
      glow.style.opacity = '1'
    })

    el.addEventListener('mouseleave', () => {
      glow.style.opacity = '0'
    })

    // Throttled mousemove handler
    let lastTime = 0
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < frameInterval) return
      lastTime = now

      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      glow.style.setProperty('--mouse-x', `${x}%`)
      glow.style.setProperty('--mouse-y', `${y}%`)
    })
  })
}

// Counter animation - numbers count up on scroll
export function initCounters() {
  if (prefersReducedMotion) {
    // Just show the final values
    gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
      const target = parseFloat(el.dataset.counter || el.textContent?.replace(/[^0-9.]/g, '') || '0')
      const prefix = el.dataset.counterPrefix || ''
      const suffix = el.dataset.counterSuffix || ''
      const decimals = el.dataset.counterDecimals ? parseInt(el.dataset.counterDecimals) : 0
      el.textContent = prefix + target.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix
    })
    return
  }

  gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
    const target = parseFloat(el.dataset.counter || el.textContent?.replace(/[^0-9.]/g, '') || '0')
    const prefix = el.dataset.counterPrefix || ''
    const suffix = el.dataset.counterSuffix || ''
    const decimals = el.dataset.counterDecimals ? parseInt(el.dataset.counterDecimals) : 0

    const counter = { value: 0 }

    gsap.to(counter, {
      value: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = prefix + counter.value.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }) + suffix
      }
    })
  })
}

// Hero scroll progress indicator
export function initScrollProgress() {
  if (prefersReducedMotion) return

  const progressBar = document.querySelector('[data-scroll-progress]')
  if (!progressBar) return

  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
    },
  })
}

// Initialize all animations
export function initAllAnimations() {
  initSmoothScroll()
  initScrollAnimations()
  initMagneticButtons()
  initMouseGradient()
  initCounters()
  initScrollProgress()
}
