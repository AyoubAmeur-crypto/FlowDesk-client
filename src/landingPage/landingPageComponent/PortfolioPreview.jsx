import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import div1 from '../../assets/div1.png'
import div2 from '../../assets/div2.png'
import div3 from '../../assets/div3.png'
import div4 from '../../assets/div4.png'
import div5 from '../../assets/div5.png'
import div6 from '../../assets/div6.png'

gsap.registerPlugin(ScrollTrigger)

const portfolioItems = [
  {
    id: 1,
    title: 'Brand Identity',
    category: 'Design',
    image: div1,
    description: 'Complete brand overhaul for a leading tech startup'
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    category: 'Development',
    image: div2,
    description: 'Scalable online store with custom features'
  },
  {
    id: 3,
    title: 'Mobile Experience',
    category: 'Mobile App',
    image: div3,
    description: 'Native iOS and Android application'
  },
  {
    id: 4,
    title: 'Marketing Campaign',
    category: 'Marketing',
    image: div4,
    description: 'Multi-channel digital marketing strategy'
  },
  {
    id: 5,
    title: 'Dashboard Analytics',
    category: 'Web App',
    image: div5,
    description: 'Real-time data visualization platform'
  },
  {
    id: 6,
    title: 'Brand Refresh',
    category: 'Design',
    image: div6,
    description: 'Modern brand identity for established company'
  }
]

function PortfolioPreview() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const gridRef = useRef(null)
  const [hoveredItem, setHoveredItem] = useState(null)

  useGSAP(() => {
    const section = sectionRef.current
    const grid = gridRef.current

    if (!section || !grid) return

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

      // Animate portfolio items with stagger
      gsap.fromTo(
        grid.children,
        {
          y: 80,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power2.out',
          stagger: {
            each: 0.1,
            from: 'center',
          },
          scrollTrigger: {
            trigger: grid,
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
      className="w-full py-20 md:py-32 bg-black px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Featured Work
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
          >
            Explore our portfolio of successful projects that showcase our expertise and creative excellence
          </p>
        </div>

        {/* Portfolio Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="inline-block px-3 py-1 mb-3 text-xs md:text-sm font-medium text-black bg-[#c8ff00] rounded-full">
                    {item.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base mb-4">
                    {item.description}
                  </p>
                  <button className="flex items-center gap-2 text-white font-medium group-hover:text-[#c8ff00] transition-colors">
                    <span>View Project</span>
                    <ArrowUpRight
                      size={18}
                      className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </button>
                </div>
              </div>

              {/* Default Content (visible when not hovered) */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${hoveredItem === item.id ? 'opacity-0' : 'opacity-100'}`}>
                <div className="text-center">
                  <span className="text-white/80 text-sm md:text-base">
                    {item.category}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-white mt-2">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                  hoveredItem === item.id ? 'shadow-[0_0_40px_rgba(200,255,0,0.2)]' : ''
                }`}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-3 px-8 py-4 text-white font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c8ff00] rounded-full transition-all duration-300 group">
            <span>View All Projects</span>
            <ArrowUpRight
              size={20}
              className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  )
}

export default PortfolioPreview