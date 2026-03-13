import React, { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, Quote } from 'lucide-react'
import logob from '../../assets/logob.svg'

gsap.registerPlugin(ScrollTrigger)

const reviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'CEO, TechStart Inc.',
    rating: 5,
    text: 'FlowDesk transformed our digital presence completely. Their attention to detail and creative approach exceeded all expectations. We saw a 150% increase in conversions.',
    avatar: 'SM'
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Founder, InnovateLab',
    rating: 5,
    text: 'Working with FlowDesk was a game-changer for our brand. The team delivered exceptional results on time and within budget. Highly recommended for any serious business.',
    avatar: 'JW'
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Marketing Director, GrowthCo',
    rating: 5,
    text: 'The premium quality of work and seamless communication made our project a huge success. FlowDesk truly understands how to create memorable digital experiences.',
    avatar: 'EC'
  },
  {
    id: 4,
    name: 'Michael Torres',
    role: 'CTO, DigitalEdge',
    rating: 5,
    text: 'Exceptional technical expertise combined with outstanding design. FlowDesk delivered a solution that perfectly balances aesthetics with functionality.',
    avatar: 'MT'
  },
  {
    id: 5,
    name: 'Aisha Patel',
    role: 'Brand Manager, LuxeBrand',
    rating: 5,
    text: 'From concept to execution, FlowDesk delivered excellence. Their strategic thinking and creative execution elevated our brand to new heights.',
    avatar: 'AP'
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Founder, StartupX',
    rating: 5,
    text: 'The team at FlowDesk brings both creativity and business acumen. They understood our vision and translated it into a stunning digital experience.',
    avatar: 'DK'
  }
]

function HorizontalReviews() {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const cardsRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  useGSAP(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    const cards = cardsRef.current

    if (!container || !wrapper || !cards) return

    const ctx = gsap.context(() => {
      // Animate title and subtitle
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
          }
        }
      )

      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
          }
        }
      )

      // Calculate total width for horizontal scroll
      const cardWidth = cards.offsetWidth / reviews.length
      const totalWidth = cardWidth * reviews.length

      // Create horizontal scroll effect
      const scrollTween = gsap.to(cards, {
        x: -(totalWidth - window.innerWidth + 200),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          start: 'top top',
          end: `+=${totalWidth}`,
          scrub: 1.5,
          anticipatePin: 1,
        }
      })

      // Animate cards into view with stagger
      gsap.fromTo(
        cards.children,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 70%',
            end: 'bottom top',
            scrub: 1,
          }
        }
      )

    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-black overflow-hidden"
    >
      <div ref={wrapperRef} className="relative w-full min-h-screen">
        {/* Header Section */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8 lg:px-16 pt-20 md:pt-32 pb-8">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Client Stories
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-white/60 max-w-2xl"
          >
            Hear from the businesses we've helped transform and grow
          </p>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div className="absolute top-32 md:top-48 left-0 right-0">
          <div
            ref={cardsRef}
            className="flex gap-6 md:gap-8 px-4 md:px-8 lg:px-16"
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-[85vw] md:w-[600px] lg:w-[700px] group"
              >
                <div
                  className="h-full rounded-2xl p-8 md:p-10 transition-all duration-500"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote
                      size={32}
                      className="text-[#c8ff00]"
                      style={{ opacity: 0.6 }}
                    />
                  </div>

                  {/* Review Text */}
                  <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8">
                    {review.text}
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-[#c8ff00] fill-[#c8ff00]"
                      />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #c8ff00 0%, #00CCFF 100%)',
                      }}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">
                        {review.name}
                      </h4>
                      <p className="text-white/60 text-sm md:text-base">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 right-10 opacity-20">
          <img src={logob} alt="Logo" className="w-20 h-20" />
        </div>
      </div>
    </div>
  )
}

export default HorizontalReviews