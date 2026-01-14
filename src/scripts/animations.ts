// Premium animations with GSAP + Lenis
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Initialize smooth scroll
export function initSmoothScroll() {
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
  // Fade up animations
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

  // Scale up animations
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

  // Parallax effect
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.2')
    gsap.to(el, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  })

  // Text reveal animation
  gsap.utils.toArray<HTMLElement>('[data-animate="text-reveal"]').forEach((el) => {
    gsap.fromTo(el,
      { 
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0 
      },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  })

  // Slide in from left
  gsap.utils.toArray<HTMLElement>('[data-animate="slide-left"]').forEach((el) => {
    gsap.fromTo(el,
      { 
        opacity: 0, 
        x: -60 
      },
      {
        opacity: 1,
        x: 0,
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

  // Slide in from right
  gsap.utils.toArray<HTMLElement>('[data-animate="slide-right"]').forEach((el) => {
    gsap.fromTo(el,
      { 
        opacity: 0, 
        x: 60 
      },
      {
        opacity: 1,
        x: 0,
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
}

// Custom cursor
export function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor')
  const cursorDot = document.getElementById('cursor-dot')
  
  if (!cursor || !cursorDot) return

  let mouseX = 0
  let mouseY = 0
  let cursorX = 0
  let cursorY = 0

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  // Smooth cursor follow
  function animateCursor() {
    const dx = mouseX - cursorX
    const dy = mouseY - cursorY
    
    cursorX += dx * 0.15
    cursorY += dy * 0.15
    
    cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`
    cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    
    requestAnimationFrame(animateCursor)
  }
  
  animateCursor()

  // Hover effects
  const hoverElements = document.querySelectorAll('a, button, [data-cursor-hover]')
  
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover')
    })
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover')
    })
  })

  // Hide on mobile
  if ('ontouchstart' in window) {
    cursor.style.display = 'none'
    cursorDot.style.display = 'none'
  }
}

// Magnetic button effect
export function initMagneticButtons() {
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

// Initialize all animations
export function initAllAnimations() {
  initSmoothScroll()
  initScrollAnimations()
  initCustomCursor()
  initMagneticButtons()
}
