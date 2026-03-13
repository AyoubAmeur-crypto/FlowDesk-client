import React, { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import logow from '../../assets/logow.svg'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone
} from 'lucide-react'

function Footer() {
  const footerRef = useRef(null)
  const contentRef = useRef(null)

  useGSAP(() => {
    const footer = footerRef.current
    const content = contentRef.current

    if (!footer || !content) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
        }
      )
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="w-full bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <img src={logow} alt="FlowDesk" className="h-8 mb-4" />
            <p className="text-white/60 mb-6 leading-relaxed">
              Transforming ambitious visions into remarkable digital realities. We craft experiences that resonate, engage, and convert.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'Portfolio', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/60 hover:text-[#c8ff00] transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {['Web Design', 'Development', 'Mobile Apps', 'Digital Marketing', 'Brand Strategy'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/60 hover:text-[#c8ff00] transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#c8ff00] mt-1" />
                <a href="mailto:hello@flowdesk.com" className="text-white/60 hover:text-white transition-colors">
                  hello@flowdesk.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#c8ff00] mt-1" />
                <span className="text-white/60">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#c8ff00] mt-1" />
                <span className="text-white/60">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 FlowDesk. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer