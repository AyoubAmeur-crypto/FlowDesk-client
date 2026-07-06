import React, { useRef, useEffect } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Mani',
    handle: '@BeingMani97',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=auto&fit=crop',
    content: 'The scroll variant hits differently. Never imagined making complex things could be this easy. Everyday I learn something new.',
    time: '2:34 PM · Mar 12, 2024',
    likes: 142,
    retweets: 38,
  },
  {
    id: 2,
    name: 'Fekry Aiad',
    handle: '@FekryAiad',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&q=auto&fit=crop',
    content: 'I have been in a rabbit hole for the past 6 hours without even noticing — its everything I love in Figma combined with everything I love in web.',
    time: '9:12 AM · Feb 28, 2024',
    likes: 87,
    retweets: 21,
  },
  {
    id: 3,
    name: './on',
    handle: '@oleg_nykolyn',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&q=auto&fit=crop',
    content: 'Absolutely mind-blowing. Sick AF tbh.',
    time: '11:58 PM · Jan 15, 2024',
    likes: 310,
    retweets: 64,
  },
  {
    id: 4,
    name: 'Miguel Ventura',
    handle: '@migdvv',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&q=auto&fit=crop',
    content: 'Learned the basics yesterday, delivered a landing page to a client today. The learning curve is unreal.',
    time: '4:20 PM · Mar 3, 2024',
    likes: 204,
    retweets: 47,
  },
  {
    id: 5,
    name: 'DANN©',
    handle: '@DannPetty',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&q=auto&fit=crop',
    content: 'I learned how to build a website in 20 minutes a day last week. Nothing fancy. Just responsive elements. If I can do it, so can you!',
    time: '8:05 AM · Feb 10, 2024',
    likes: 519,
    retweets: 112,
  },
  {
    id: 6,
    name: 'Parker',
    handle: '@_prkr',
    image: 'https://images.unsplash.com/photo-1516587573714-ffd4afdd338b?w=50&q=auto&fit=crop',
    content: 'I was enjoying it a lot but I am BLOWN AWAY by the Figma plug-in. This changes everything for my workflow.',
    time: '3:47 PM · Mar 19, 2024',
    likes: 93,
    retweets: 18,
  },
  {
    id: 7,
    name: 'Daniël van der Winden',
    handle: '@dvdwinden',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&q=auto&fit=crop',
    content: 'Seeing it tackle CMS stuff so effortlessly is mind-boggling. Built sites in WordPress before — this is another level.',
    time: '1:22 PM · Jan 30, 2024',
    likes: 167,
    retweets: 29,
  },
  {
    id: 8,
    name: 'Lauren Waller',
    handle: '@waller_texas',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&q=auto&fit=crop',
    content: 'The publish time is insanely fast. Just published 2 weeks of changes in 5 seconds 🤯 almost too fast for such a big moment.',
    time: '6:14 PM · Feb 22, 2024',
    likes: 441,
    retweets: 88,
  },
  {
    id: 9,
    name: 'Christopher Lo',
    handle: '@ChristopherLoCC',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=50&q=auto&fit=crop',
    content: 'Thank you for building such an empowering tool for designers. The site went from Figma to live in less than a week!',
    time: '10:33 AM · Mar 7, 2024',
    likes: 78,
    retweets: 14,
  },
  {
    id: 10,
    name: 'Amos',
    handle: '@amosbastian',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=50&q=auto&fit=crop',
    content: 'Playing around while building a landing page for a side project. I suck at animations, but they make it so easy 🤩',
    time: '7:51 PM · Jan 25, 2024',
    likes: 256,
    retweets: 53,
  },
]

const XLogo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const RetweetIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
)

const CARD_WIDTH = 260
const CARD_GAP   = 16

function TweetCard({ testimonial }) {
  return (
    <div 
      data-card
      style={{
        width:         `${CARD_WIDTH}px`,
        flexShrink:    0,
        background:    '#111',
        border:        '1px solid #333',
        borderRadius:  '12px',
        padding:       '12px',
        display:       'flex',
        flexDirection: 'column',
        gap:           '8px',
        boxShadow:     '0 1px 3px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={testimonial.image}
              alt={testimonial.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              loading="lazy"
            />
            <div>
              <p style={{ fontWeight: 700, fontSize: '12px', color: '#fff', margin: 0, lineHeight: 1.2 }}>
                {testimonial.name}
              </p>
              <p style={{ fontSize: '11px', color: '#8899a6', margin: 0, lineHeight: 1.2 }}>
                {testimonial.handle}
              </p>
            </div>
          </div>
          <span style={{ color: '#fff', opacity: 0.7 }}><XLogo /></span>
        </div>

        {/* Content */}
        <p style={{ fontSize: '12px', color: '#e7e9ea', lineHeight: 1.5, margin: 0 }}>
          {testimonial.content}
        </p>

        {/* Divider + time */}
        <p style={{ fontSize: '11px', color: '#8899a6', margin: 0, borderTop: '1px solid #333', paddingTop: '6px' }}>
          {testimonial.time}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#8899a6' }}>
            <RetweetIcon /> {testimonial.retweets}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#8899a6' }}>
            <HeartIcon /> {testimonial.likes}
          </span>
        </div>
      </div>
  )
}



function TestimonialsSection() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)

  // Repeat items to fill enough space for scrubbing
  const originalRow1 = testimonials.slice(0, 5)
  const originalRow2 = testimonials.slice(5)
  const row1 = [...originalRow1, ...originalRow1, ...originalRow1, ...originalRow1]
  const row2 = [...originalRow2, ...originalRow2, ...originalRow2, ...originalRow2]

  useEffect(() => {
    let ctx
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsap.registerPlugin(ScrollTrigger)
      
      ctx = gsap.context(() => {
        // Header scrub animation
        gsap.fromTo(headerRef.current,
          { opacity: 0.1, y: 30 },
          { opacity: 1, y: 0, ease: 'none', 
            scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', end: 'top 50%', scrub: 1.5 } }
        )

        // Marquee Row scrubbing animations
        const cardsWidth = (260 + 16) * 5 // width of 5 cards
        const scrubDistance = cardsWidth * 1.5 
        
        const tracks = document.querySelectorAll('[data-marquee-track]')
        if (tracks[0]) {
          gsap.fromTo(tracks[0], 
            { x: 0 }, 
            { x: -scrubDistance, ease: 'power1.out', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2.5 } }
          )
        }
        if (tracks[1]) {
          gsap.fromTo(tracks[1], 
            { x: -scrubDistance }, 
            { x: 0, ease: 'power1.out', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2.5 } }
          )
        }

        // Cards fade scale in
        const cards = document.querySelectorAll('[data-card]')
        if (cards.length > 0) {
          gsap.fromTo(cards, 
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
          )
        }
      }, sectionRef.current)
    }, { threshold: 0.05 })

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { observer.disconnect(); ctx?.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        width:           '100vw',
        position:        'relative',
        left:            '50%',
        transform:       'translateX(-50%)',
        backgroundColor: '#000',
        paddingTop:      '4rem',
        paddingBottom:   '4rem',
      }}
    >
      {/* Header */}
      <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 2rem', opacity: 0 }}>
        <p style={{
          fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#000', background: '#c8ff00', fontWeight: 800,
          display: 'inline-block', padding: '12px 12px', borderRadius: '999px', marginBottom: '1rem',
        }}>
          Testimonials
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800,
          color: '#fff', lineHeight: 1.1, margin: '0 auto', maxWidth: '600px',
        }}>
          Loved by <span style={{ color: '#c8ff00' }}>people who build</span>
        </h2>
        <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: '#8899a6', maxWidth: '400px', margin: '0.75rem auto 0' }}>
          Don't take our word for it — see what real users are saying.
        </p>
      </div>

      {/* Row 1 — left */}
      <div style={{ marginBottom: '20px', overflow: 'hidden', width: '100vw' }}>
        <div data-marquee-track style={{ display: 'flex', gap: `${CARD_GAP}px`, width: 'max-content', willChange: 'transform' }}>
          {row1.map((t, i) => <TweetCard key={`a-${i}-${t.id}`} testimonial={t} />)}
        </div>
      </div>

      {/* Row 2 — right */}
      <div style={{ overflow: 'hidden', width: '100vw' }}>
        <div data-marquee-track style={{ display: 'flex', gap: `${CARD_GAP}px`, width: 'max-content', willChange: 'transform' }}>
          {row2.map((t, i) => <TweetCard key={`b-${i}-${t.id}`} testimonial={t} />)}
        </div>
      </div>

      {/* Edge fade masks — black & white only */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to right, #000 0%, transparent 6%, transparent 94%, #000 100%)',
      }} />
    </section>
  )
}

export default TestimonialsSection