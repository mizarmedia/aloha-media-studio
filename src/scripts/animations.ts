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

// Header fade on scroll - homepage only
export function initHeaderFade() {
  if (prefersReducedMotion) return

  const header = document.getElementById('header')
  if (!header) return

  // Only on homepage
  if (window.location.pathname !== '/') return

  // Find the trigger section and lock-out section
  const whoThisIsFor = document.getElementById('who-this-is-for')
  const howItWorks = document.querySelector('[data-timeline-section]') as HTMLElement
  if (!whoThisIsFor) return

  let lastScrollY = 0
  let headerVisible = true

  const updateHeaderVisibility = () => {
    const currentScrollY = window.scrollY
    const triggerTop = whoThisIsFor.getBoundingClientRect().top + currentScrollY
    const isScrollingUp = currentScrollY < lastScrollY

    // Check if we're inside the How It Works section
    let insideHowItWorks = false
    if (howItWorks) {
      const rect = howItWorks.getBoundingClientRect()
      insideHowItWorks = rect.top < window.innerHeight && rect.bottom > 0
    }

    // If inside How It Works section, always keep header hidden
    if (insideHowItWorks && currentScrollY > triggerTop) {
      if (headerVisible) {
        gsap.to(header, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.out' })
        headerVisible = false
      }
    } else if (isScrollingUp && !headerVisible && !insideHowItWorks) {
      // Scrolling up outside How It Works - show header
      gsap.to(header, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
      headerVisible = true
    } else if (!isScrollingUp && currentScrollY > triggerTop && headerVisible) {
      // Scrolling down past trigger - hide header
      gsap.to(header, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.out' })
      headerVisible = false
    }

    lastScrollY = currentScrollY
  }

  window.addEventListener('scroll', updateHeaderVisibility, { passive: true })
}

// NLE Timeline scroll animation - Three-Act Story
// Planning (0-25%) → Timeline (25-55%) → Render Queue (60-90%) → Success (90-100%)
export function initTimelineScroll() {
  const section = document.querySelector('[data-timeline-section]')
  if (!section) return

  // Act 1: Planning Outline elements
  const actPlanning = document.querySelector('[data-act-planning]') as HTMLElement
  const planningTitle = document.querySelector('[data-planning-title]') as HTMLElement
  const planningEpisodes = document.querySelectorAll('[data-planning-episode]') as NodeListOf<HTMLElement>
  const scrollHint = document.querySelector('[data-scroll-hint]') as HTMLElement
  const actHeader = document.querySelector('[data-act-header]') as HTMLElement

  // Act 2: Timeline elements
  const actTimeline = document.querySelector('[data-act-timeline]') as HTMLElement
  const playhead = document.querySelector('[data-playhead]') as HTMLElement
  const timecodeDisplay = document.querySelector('[data-current-timecode]') as HTMLElement
  const clips = document.querySelectorAll('[data-clip]') as NodeListOf<HTMLElement>
  const detailRecording = document.querySelector('[data-detail-recording]') as HTMLElement
  const detailPost = document.querySelector('[data-detail-post]') as HTMLElement

  // Act 3: Render Queue elements
  const actRender = document.querySelector('[data-act-render]') as HTMLElement
  const queueStatus = document.querySelector('[data-queue-status]') as HTMLElement
  const queueIndicator = document.querySelector('[data-queue-indicator]') as HTMLElement

  // Act 4: Success elements
  const actSuccess = document.querySelector('[data-act-success]') as HTMLElement
  const confettiParticles = document.querySelectorAll('[data-confetti-particle]') as NodeListOf<HTMLElement>

  // Render job elements
  const jobs = ['editing', 'thumbnail', 'publish']
  const jobElements = jobs.map(id => ({
    id,
    progress: document.querySelector(`[data-job-progress="${id}"]`) as HTMLElement,
    status: document.querySelector(`[data-job-status="${id}"]`) as HTMLElement,
    percent: document.querySelector(`[data-job-percent="${id}"]`) as HTMLElement,
    icon: document.querySelector(`[data-job-icon="${id}"]`) as HTMLElement
  }))

  if (!actPlanning) return

  // Scroll zone boundaries (faster planning phase)
  const ZONES = {
    PLANNING_END: 0.25,      // Planning phase ends (was 0.35)
    TIMELINE_END: 0.55,      // Timeline phase ends (was 0.60)
    TRANSITION_END: 0.60,    // Transition complete (was 0.65)
    RENDER_END: 0.90,        // Render queue ends (was 0.95)
    SUCCESS: 1.0             // Success state
  }

  // Format seconds to timecode
  function formatTimecode(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Update planning paper - reveal episodes sequentially
  function updatePlanningPaper(progress: number) {
    const planningProgress = progress / ZONES.PLANNING_END // Normalize to 0-1 within planning phase

    // Show title first (at 5%)
    if (planningTitle && planningProgress > 0.05) {
      planningTitle.style.opacity = '1'
    }

    // Reveal episodes sequentially (6 episodes over 25% scroll = ~15% per episode)
    planningEpisodes.forEach((episode, index) => {
      const episodeThreshold = 0.08 + (index * 0.15) // Start at 8%, each takes ~15%
      if (planningProgress > episodeThreshold) {
        episode.style.opacity = '1'
        episode.style.transform = 'translateX(0)'
      }
    })
  }

  // Update timeline detail panel based on progress
  function updateTimelineDetail(progress: number) {
    // Normalize progress within timeline phase (0.35 to 0.60)
    const timelineProgress = (progress - ZONES.PLANNING_END) / (ZONES.TIMELINE_END - ZONES.PLANNING_END)

    // Hide all first
    if (detailRecording) detailRecording.classList.add('hidden')
    if (detailPost) detailPost.classList.add('hidden')

    // Show appropriate detail (recording for first 70%, post for last 30%)
    if (timelineProgress < 0.70) {
      if (detailRecording) {
        detailRecording.classList.remove('hidden')
        detailRecording.classList.add('block')
      }
    } else {
      if (detailPost) {
        detailPost.classList.remove('hidden')
        detailPost.classList.add('block')
      }
    }
  }

  // Reveal clips as playhead passes them
  function updateClipVisibility(progress: number) {
    // Normalize progress within timeline phase
    const timelineProgress = (progress - ZONES.PLANNING_END) / (ZONES.TIMELINE_END - ZONES.PLANNING_END)
    const playheadPosition = timelineProgress * 100 // Convert to percentage

    clips.forEach(clip => {
      const clipStart = parseFloat(clip.dataset.clipStart || '0')
      // Clip appears when playhead reaches its start position
      if (playheadPosition >= clipStart) {
        clip.style.opacity = '1'
        clip.style.transform = 'scaleX(1)'
      } else {
        clip.style.opacity = '0'
        clip.style.transform = 'scaleX(0.8)'
      }
    })
  }

  // Update render queue progress bars
  function updateRenderQueue(progress: number) {
    // Normalize progress within render phase (0.65 to 0.95)
    const renderProgress = (progress - ZONES.TRANSITION_END) / (ZONES.RENDER_END - ZONES.TRANSITION_END)

    // Each job takes 1/3 of the render phase
    jobElements.forEach((job, index) => {
      const jobStart = index / 3
      const jobEnd = (index + 1) / 3
      let jobProgress = 0

      if (renderProgress >= jobEnd) {
        jobProgress = 100
      } else if (renderProgress > jobStart) {
        jobProgress = ((renderProgress - jobStart) / (jobEnd - jobStart)) * 100
      }

      // Update progress bar
      if (job.progress) {
        job.progress.style.width = `${jobProgress}%`
      }

      // Update percentage text
      if (job.percent) {
        job.percent.textContent = `${Math.round(jobProgress)}%`
      }

      // Update status text
      if (job.status) {
        if (jobProgress >= 100) {
          job.status.textContent = 'COMPLETE'
          job.status.classList.add('text-emerald-400')
          job.status.classList.remove('text-[var(--color-stone)]')
        } else if (jobProgress > 0) {
          job.status.textContent = 'RENDERING'
          job.status.classList.add('text-[var(--color-coral)]')
          job.status.classList.remove('text-[var(--color-stone)]')
        } else {
          job.status.textContent = 'QUEUED'
          job.status.classList.remove('text-emerald-400', 'text-[var(--color-coral)]')
          job.status.classList.add('text-[var(--color-stone)]')
        }
      }

      // Update icon
      if (job.icon) {
        if (jobProgress >= 100) {
          job.icon.classList.add('bg-emerald-500/20', 'border-emerald-500')
          job.icon.classList.remove('bg-[var(--color-void)]', 'border-[var(--color-graphite)]')
          job.icon.innerHTML = '<svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
        }
      }
    })

    // Update queue status
    if (queueStatus) {
      const allComplete = renderProgress >= 1
      queueStatus.textContent = allComplete ? 'Complete!' : 'Processing...'
      if (allComplete && queueIndicator) {
        queueIndicator.classList.remove('bg-[var(--color-coral)]')
        queueIndicator.classList.add('bg-emerald-500')
      }
    }
  }

  // Animate confetti
  function triggerConfetti() {
    confettiParticles.forEach((particle, i) => {
      gsap.to(particle, {
        opacity: 1,
        y: 400 + Math.random() * 200,
        x: (Math.random() - 0.5) * 100,
        rotation: Math.random() * 720,
        duration: 2 + Math.random(),
        ease: 'power2.out',
        delay: i * 0.05
      })
    })
  }

  if (prefersReducedMotion) {
    // Show all elements immediately
    if (planningTitle) planningTitle.style.opacity = '1'
    planningEpisodes.forEach(ep => {
      ep.style.opacity = '1'
      ep.style.transform = 'translateX(0)'
    })
    clips.forEach(clip => {
      clip.style.opacity = '1'
    })
    return
  }

  // Track label width (48px = w-12)
  const trackLabelWidth = 48

  let confettiTriggered = false
  let currentPhase = 'planning'

  // Create the scroll-triggered animation
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress

      // === ACT 1: PLANNING PAPER (0% - 35%) ===
      if (progress < ZONES.PLANNING_END) {
        if (currentPhase !== 'planning') {
          currentPhase = 'planning'
          // Show planning, hide others
          actPlanning.style.opacity = '1'
          actPlanning.style.transform = 'translateX(0)'
          actPlanning.style.pointerEvents = 'auto'
          if (actTimeline) {
            actTimeline.style.opacity = '0'
            actTimeline.style.transform = 'translateX(100px)'
            actTimeline.style.pointerEvents = 'none'
          }
          if (actRender) {
            actRender.style.opacity = '0'
            actRender.style.transform = 'translateX(100px)'
            actRender.style.pointerEvents = 'none'
          }
          if (actSuccess) {
            actSuccess.style.opacity = '0'
            actSuccess.style.transform = 'scale(0.95)'
            actSuccess.style.pointerEvents = 'none'
          }
          // Update header
          if (actHeader) {
            actHeader.innerHTML = 'Your Content. <span class="text-[var(--color-coral)]">Our Plan.</span>'
          }
        }

        // Update planning paper
        updatePlanningPaper(progress)

        // Hide scroll hint after initial scroll
        if (scrollHint) {
          scrollHint.style.opacity = progress > 0.05 ? '0' : '0.6'
        }
      }

      // === TRANSITION: Planning → Timeline (35% - 40%) ===
      else if (progress < ZONES.PLANNING_END + 0.05) {
        const transitionProgress = (progress - ZONES.PLANNING_END) / 0.05

        // Cross-fade planning out, timeline in
        actPlanning.style.opacity = String(1 - transitionProgress)
        actPlanning.style.transform = `translateX(${-transitionProgress * 100}px)`

        if (actTimeline) {
          actTimeline.style.opacity = String(transitionProgress)
          actTimeline.style.transform = `translateX(${(1 - transitionProgress) * 100}px)`
        }

        // Update header mid-transition
        if (actHeader && transitionProgress > 0.5) {
          actHeader.innerHTML = 'Your Content. <span class="text-[var(--color-coral)]">Our Timeline.</span>'
        }

        currentPhase = 'planning-to-timeline'
      }

      // === ACT 2: TIMELINE (40% - 60%) ===
      else if (progress < ZONES.TIMELINE_END) {
        if (currentPhase !== 'timeline') {
          currentPhase = 'timeline'
          // Show timeline, hide others
          actPlanning.style.opacity = '0'
          actPlanning.style.pointerEvents = 'none'
          if (actTimeline) {
            actTimeline.style.opacity = '1'
            actTimeline.style.transform = 'translateX(0)'
            actTimeline.style.pointerEvents = 'auto'
          }
          if (actRender) {
            actRender.style.opacity = '0'
            actRender.style.transform = 'translateX(100px)'
            actRender.style.pointerEvents = 'none'
          }
          if (actSuccess) {
            actSuccess.style.opacity = '0'
            actSuccess.style.transform = 'scale(0.95)'
            actSuccess.style.pointerEvents = 'none'
          }
          // Update header
          if (actHeader) {
            actHeader.innerHTML = 'Your Content. <span class="text-[var(--color-coral)]">Our Timeline.</span>'
          }
        }

        // Update timeline progress
        const timelineProgress = (progress - ZONES.PLANNING_END) / (ZONES.TIMELINE_END - ZONES.PLANNING_END)

        // Move playhead
        if (playhead) {
          const playheadLeft = trackLabelWidth + 4 + (timelineProgress * (window.innerWidth - trackLabelWidth - 100))
          playhead.style.left = `${Math.min(playheadLeft, window.innerWidth - 50)}px`
        }

        // Update timecode (0 to 20 minutes = 1200 seconds)
        const currentTime = timelineProgress * 1200
        if (timecodeDisplay) {
          timecodeDisplay.textContent = formatTimecode(currentTime)
        }

        // Reveal clips
        updateClipVisibility(progress)

        // Update detail panel
        updateTimelineDetail(progress)
      }

      // === TRANSITION: Timeline → Render Queue (60% - 65%) ===
      else if (progress < ZONES.TRANSITION_END) {
        const transitionProgress = (progress - ZONES.TIMELINE_END) / (ZONES.TRANSITION_END - ZONES.TIMELINE_END)

        // Cross-fade timeline out, render queue in
        if (actTimeline) {
          actTimeline.style.opacity = String(1 - transitionProgress)
          actTimeline.style.transform = `translateX(${-transitionProgress * 100}px)`
        }

        if (actRender) {
          actRender.style.opacity = String(transitionProgress)
          actRender.style.transform = `translateX(${(1 - transitionProgress) * 100}px)`
        }

        // Update header mid-transition
        if (actHeader && transitionProgress > 0.5) {
          actHeader.innerHTML = 'Your Content. <span class="text-[var(--color-coral)]">Delivered.</span>'
        }

        currentPhase = 'timeline-to-render'
      }

      // === ACT 3: RENDER QUEUE (65% - 95%) ===
      else if (progress < ZONES.RENDER_END) {
        if (currentPhase !== 'render') {
          currentPhase = 'render'
          // Show render queue, hide timeline
          actPlanning.style.opacity = '0'
          actPlanning.style.pointerEvents = 'none'
          if (actTimeline) {
            actTimeline.style.opacity = '0'
            actTimeline.style.pointerEvents = 'none'
          }
          if (actRender) {
            actRender.style.opacity = '1'
            actRender.style.transform = 'translateX(0)'
            actRender.style.pointerEvents = 'auto'
          }
          if (actSuccess) {
            actSuccess.style.opacity = '0'
            actSuccess.style.pointerEvents = 'none'
          }
          // Update header
          if (actHeader) {
            actHeader.innerHTML = 'Your Content. <span class="text-[var(--color-coral)]">Delivered.</span>'
          }
        }

        // Update render queue progress
        updateRenderQueue(progress)
      }

      // === ACT 4: SUCCESS (95% - 100%) ===
      else {
        if (currentPhase !== 'success') {
          currentPhase = 'success'
          // Hide render queue, show success
          actPlanning.style.opacity = '0'
          actPlanning.style.pointerEvents = 'none'
          if (actTimeline) {
            actTimeline.style.opacity = '0'
            actTimeline.style.pointerEvents = 'none'
          }
          if (actRender) {
            actRender.style.opacity = '0'
            actRender.style.pointerEvents = 'none'
          }
          if (actSuccess) {
            actSuccess.style.opacity = '1'
            actSuccess.style.transform = 'scale(1)'
            actSuccess.style.pointerEvents = 'auto'
          }

          // Trigger confetti once
          if (!confettiTriggered) {
            confettiTriggered = true
            triggerConfetti()
          }

          // Update header
          if (actHeader) {
            actHeader.innerHTML = 'Your Episode is <span class="text-[var(--color-coral)]">Live!</span>'
          }
        }
      }
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

// Views counter animation - counts up from 0 to target
export function initViewsCounter() {
  const counterEl = document.querySelector('[data-views-counter]') as HTMLElement
  if (!counterEl) return

  const target = parseInt(counterEl.dataset.counterTarget || '20000')

  if (prefersReducedMotion) {
    counterEl.textContent = target.toLocaleString()
    return
  }

  let animated = false

  ScrollTrigger.create({
    trigger: counterEl,
    start: 'top 85%',
    onEnter: () => {
      if (animated) return
      animated = true

      gsap.to({ val: 0 }, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: function() {
          counterEl.textContent = Math.round(this.targets()[0].val).toLocaleString()
        }
      })
    }
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
  initTimelineScroll()
  initPriceCountdown()
  initViewsCounter()
  initHeaderFade()
}
