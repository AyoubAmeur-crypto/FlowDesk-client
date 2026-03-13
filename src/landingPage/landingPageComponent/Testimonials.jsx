import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'CEO, TechStart Inc.',
    image: 'SM',
    rating: 5,
    quote: 'FlowDesk transformed our entire digital presence. Their strategic approach and creative excellence exceeded all expectations. Weve seen a 200% increase in user engagement since launch.',
    stats: { metric: '200%', label: 'Engagement' }
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Founder, InnovateLab',
    image: 'JW',
    rating: 5,
    quote: 'The team delivered exceptional results on time and within budget. Their attention to detail and commitment to quality is unmatched. They truly understand modern digital experiences.',
    stats: { metric: '150+', label: 'Projects' }
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Marketing Director, GrowthCo',
    image: 'EC',
    rating: 5,
    quote: 'Outstanding work from start to finish. FlowDesk brought our vision to life with precision and creativity. The seamless communication and expertise made this project a success.',
    stats: { metric: '98%', label: 'Satisfaction' }
  },
  {
    id: 4,
    name: 'Michael Torres',
    role: 'CTO, DigitalEdge',
    image: 'MT',
    rating: 5,
    quote: 'Exceptional technical expertise combined with beautiful design. FlowDesk delivered a solution that perfectly balances performance, security, and user experience.',
    stats: { metric: '50+', label: 'Team Size' }
  }
]

function Testimonials() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const cardsRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useGSAP(() => {
    const section = sectionRef.current
    const cards = cardsRef.current

    if (!section || !cards) return

    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        [titleRef.current, subtitleRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      )

      // Animate testimonial cards
      gsap.fromTo(
        cards.children,
        {
          y: 100,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
          }
        }
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-32 bg-gradient-to-b from-black via-neutral-950 to-black px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            What Our Clients Say
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
          >
            Trusted by industry leaders to deliver exceptional results
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Featured Testimonial */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div
              className="h-full rounded-3xl p-8 md:p-12 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(200, 255, 0, 0.1) 0%, rgba(0, 204, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Quote
                size={48}
                className="text-[#c8ff00] mb-6 opacity-60"
              />

              <p className="text-white text-xl md:text-2xl leading-relaxed mb-8">
                {testimonials[activeIndex].quote}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-black font-bold text-lg"
                    style={{
                      background: 'linear-gradient(135deg, #c8ff00 0%, #00CCFF 100%)',
                    }}
                  >
                    {testimonials[activeIndex].image}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-white/60">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-[#c8ff00] fill-[#c8ff00]"
                    />
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="absolute bottom-8 right-8 flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4 h-full">
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`rounded-2xl p-6 transition-all duration-500 ${
                    activeIndex === index
                      ? 'bg-white/10 scale-105'
                      : 'bg-white/5 hover:bg-white/8'
                  }`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-black font-semibold text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${index % 2 === 0 ? '#c8ff00' : '#00CCFF'} 0%, ${index % 2 === 0 ? '#a3e600' : '#00a3cc'} 100%)`,
                      }}
                    >
                      {testimonial.image}
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="text-[#c8ff00] fill-[#c8ff00]"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm line-clamp-2 mb-3">
                    {testimonial.quote}
                  </p>
                  <div className="text-2xl font-bold text-white">
                    {testimonial.stats.metric}
                  </div>
                  <div className="text-xs text-white/40">
                    {testimonial.stats.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials