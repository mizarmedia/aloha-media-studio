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

// Timeline thread animation - line draws and nodes activate on scroll
export function initTimelineThread() {
  const container = document.querySelector('[data-timeline-container]')
  if (!container) return

  const progressLine = document.querySelector('[data-timeline-progress]')
  const progressLineMobile = document.querySelector('[data-timeline-progress-mobile]')
  const steps = document.querySelectorAll('[data-timeline-step]')
  const nodes = document.querySelectorAll('[data-timeline-node]')
  const numbers = document.querySelectorAll('[data-timeline-number]')

  if (prefersReducedMotion) {
    // Show everything immediately
    if (progressLine) (progressLine as SVGLineElement).style.strokeDashoffset = '0'
    if (progressLineMobile) (progressLineMobile as SVGLineElement).style.strokeDashoffset = '0'
    nodes.forEach(node => node.classList.add('active'))
    numbers.forEach(num => {
      const target = (num as HTMLElement).dataset.numberTarget || '00'
      num.textContent = target
    })
    return
  }

  // Line drawing animation - starts when container enters, completes when last step is centered
  const lineAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 0.5,
    }
  })

  // Animate the progress line (desktop)
  if (progressLine) {
    lineAnimation.to(progressLine, {
      strokeDashoffset: 0,
      ease: 'none',
    }, 0)
  }

  // Animate the progress line (mobile)
  if (progressLineMobile) {
    lineAnimation.to(progressLineMobile, {
      strokeDashoffset: 0,
      ease: 'none',
    }, 0)
  }

  // Staggered node activation - trigger once when container enters, then stagger the animations
  let nodesActivated = false

  ScrollTrigger.create({
    trigger: container,
    start: 'top 70%',
    onEnter: () => {
      if (nodesActivated) return
      nodesActivated = true

      // Stagger each node with delay
      nodes.forEach((node, index) => {
        const numEl = numbers[index] as HTMLElement
        const target = numEl?.dataset.numberTarget || '00'
        const delay = index * 0.4 // 0s, 0.4s, 0.8s

        gsap.delayedCall(delay, () => {
          node.classList.add('active')
          // Animate number
          if (numEl) {
            const targetNum = parseInt(target)
            gsap.to({ val: 0 }, {
              val: targetNum,
              duration: 0.5,
              ease: 'power2.out',
              onUpdate: function() {
                numEl.textContent = String(Math.round(this.targets()[0].val)).padStart(2, '0')
              }
            })
          }
        })
      })
    },
    onLeaveBack: () => {
      nodesActivated = false
      nodes.forEach((node, index) => {
        node.classList.remove('active')
        const numEl = numbers[index] as HTMLElement
        if (numEl) numEl.textContent = '00'
      })
    }
  })
}

// Quote reveal animation - words reveal as you scroll
export function initQuoteReveal() {
  if (prefersReducedMotion) {
    gsap.utils.toArray<HTMLElement>('[data-quote-reveal]').forEach((el) => {
      el.style.opacity = '1'
    })
    return
  }

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

// Price countdown animation - counts down from agency price to actual price
export function initPriceCountdown() {
  const priceEl = document.querySelector('[data-price-counter]') as HTMLElement
  if (!priceEl) return

  const startValue = parseInt(priceEl.dataset.counterStart || '15000')
  const endValue = parseInt(priceEl.dataset.counterEnd || '4500')

  if (prefersReducedMotion) {
    priceEl.textContent = endValue.toLocaleString()
    return
  }

  let animated = false

  ScrollTrigger.create({
    trigger: priceEl,
    start: 'top 80%',
    onEnter: () => {
      if (animated) return
      animated = true

      gsap.to({ val: startValue }, {
        val: endValue,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          priceEl.textContent = Math.round(this.targets()[0].val).toLocaleString()
        }
      })
    }
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
  initQuoteReveal()
  initTimelineThread()
  initPriceCountdown()
}
