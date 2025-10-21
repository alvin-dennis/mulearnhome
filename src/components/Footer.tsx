"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import MuImage from "@/components/MuImage";
import { footer, socials, contactInfo } from "@/data/data";
import { Mail, Phone, Globe } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      className="bg-gradient-to-br from-mulearn-gray-50 to-mulearn-whitish text-mulearn-blackish px-6 py-12 border-t border-mulearn-gray-200"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section - Links & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex flex-col items-start space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-25 h-25 rounded-2xl flex items-center justify-center overflow-hidden ">
                    <MuImage
                      src="/assets/loader/MuLoader.gif"
                      alt="µLearn Logo"
                      width={80}
                      height={80}
                      className="object-contain"
                      unoptimized 
                    />
                </div>
              </div>
              <p className="text-mulearn-gray-600 text-sm leading-relaxed max-w-md">
                Empowering learners through community-driven education and 
                innovative learning pathways. Join us in shaping the future of education.
              </p>
              {/* Social Media Links */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-sm font-semibold text-mulearn-gray-900 uppercase tracking-wide">
                  Connect With Us
                </h3>
                <div className="flex space-x-3">
                  {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.label}
                        href={social.url}
                        aria-label={social.label}
                        className="w-10 h-10 rounded-lg bg-white border border-mulearn-gray-200 flex items-center justify-center text-mulearn-gray-600 transition-all duration-300 hover:bg-mulearn-trusty-blue hover:text-white hover:shadow-lg hover:scale-105"
                      >
                        <Icon />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {footer.map((section) => (
            <div 
              key={section.title} 
              className={`space-y-4 ${
                ['Quick Links', 'Legal', 'Be Part of Us'].includes(section.title) 
                  ? 'mt-8 lg:mt-12' 
                  : ''
              }`}
            >
              <h3 className="text-sm font-semibold text-mulearn-gray-900 uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.url}
                      className="text-mulearn-gray-600 hover:text-mulearn-trusty-blue transition-all duration-300 hover:translate-x-1 inline-block text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-mulearn-gray-200 my-8"></div>

        {/* Bottom Section - Contact & Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="text-center lg:text-left">
            <div className="text-sm text-mulearn-blakish-600 font-medium">
              {contactInfo.copyright}
            </div>
            <div className="text-xs text-mulearn-gray-500 mt-1">
              {contactInfo.address}
            </div>
          </div>

          {/* Contact Links with Blue Icons */}
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 text-sm">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="flex items-center space-x-2 text-mulearn-gray-600 hover:text-mulearn-trusty-blue transition-colors duration-300 group"
            >
              <Mail className="w-4 h-4 text-mulearn-trusty-blue group-hover:scale-110 transition-transform duration-300" />
              <span>{contactInfo.email}</span>
            </Link>
            
            <Link
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              className="flex items-center space-x-2 text-mulearn-gray-600 hover:text-mulearn-trusty-blue transition-colors duration-300 group"
            >
              <Phone className="w-4 h-4 text-mulearn-trusty-blue group-hover:scale-110 transition-transform duration-300" />
              <span>{contactInfo.phone}</span>
            </Link>
            
            <Link
              href={`https://${contactInfo.website}`}
              className="flex items-center space-x-2 text-mulearn-gray-600 hover:text-mulearn-trusty-blue transition-colors duration-300 group"
            >
              <Globe className="w-4 h-4 text-mulearn-trusty-blue group-hover:scale-110 transition-transform duration-300" />
              <span>{contactInfo.website}</span>
            </Link>
          </div>
        </div>

        {/* Additional decorative element */}
        <div className="mt-8 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-mulearn-trusty-blue to-mulearn-electric-purple rounded-full"></div>
        </div>
      </div>
    </motion.footer>
  );
}