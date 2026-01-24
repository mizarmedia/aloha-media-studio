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


// Mouse-following gradient glow
export function initMouseGradient() {
  const containers = document.querySelectorAll('[data-mouse-glow]')

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

    el.addEventListener('mousemove', (e: MouseEvent) => {
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


// Step number reveal animation - simple fade + scale
export function initStepReveal() {
  gsap.utils.toArray<HTMLElement>('[data-step-reveal]').forEach((el, index) => {
    gsap.fromTo(el,
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        delay: index * 0.1
      }
    )
  })
}

// Hero scroll progress indicator
export function initScrollProgress() {
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

// Split text animation - words animate in with stagger
export function initSplitText() {
  gsap.utils.toArray<HTMLElement>('[data-split-text]').forEach((el) => {
    // Split text into words
    const text = el.textContent || ''
    const words = text.split(' ')

    // Wrap each word in a span
    el.innerHTML = words.map(word =>
      `<span class="split-word inline-block" style="opacity: 0; transform: translateY(30px);">${word}</span>`
    ).join(' ')

    const wordSpans = el.querySelectorAll('.split-word')

    gsap.to(wordSpans, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
  })
}

// Quote reveal animation - words reveal as you scroll
export function initQuoteReveal() {
  gsap.utils.toArray<HTMLElement>('[data-quote-reveal]').forEach((el) => {
    // Split text into words
    const text = el.textContent || ''
    const words = text.split(' ')

    // Wrap each word in a span
    el.innerHTML = words.map(word =>
      `<span class="quote-word inline-block" style="opacity: 0.15;">${word}</span>`
    ).join(' ')

    const wordSpans = el.querySelectorAll('.quote-word')

    // Create a scrub animation that reveals words as you scroll
    gsap.to(wordSpans, {
      opacity: 1,
      stagger: 0.02,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 1,
      },
    })
  })
}

// Initialize all animations
export function initAllAnimations() {
  initSmoothScroll()
  initScrollAnimations()
  initMagneticButtons()
  initMouseGradient()
  initCounters()
  initStepReveal()
  initScrollProgress()
  initSplitText()
  initQuoteReveal()
}
