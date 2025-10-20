"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { contactInfo } from "@/data/data";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    muId: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Placeholder for form submission
      console.log("Form submitted:", formData);
      alert("Thank you for your message! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        muId: "",
        message: ""
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two columns for input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            {/* MuID Field */}
            <div className="space-y-2">
              <Label htmlFor="muId" className="text-sm font-medium">
                MuID (Optional)
              </Label>
              <Input
                type="text"
                id="muId"
                name="muId"
                value={formData.muId}
                onChange={handleChange}
                placeholder="Enter your MuID if available"
              />
            </div>
          </div>
        </div>

        {/* Centered Message Field */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your query or feedback..."
              rows={4}
              className={`w-full px-3 py-2 border border-mulearn-gray-300 rounded-lg focus:ring-2 focus:ring-mulearn-trusty-blue focus:border-transparent transition-all duration-300 resize-none text-sm ${
                errors.message ? "border-red-500" : ""
              }`}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message}</p>
            )}
          </div>
        </div>

        {/* Centered Submit Button */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-mulearn-trusty-blue to-mulearn-duke-purple text-white py-3"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>

        <p className="text-xs text-mulearn-gray-500 text-center">
          * Required fields
        </p>
      </form>

      {/* Contact Information */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-mulearn-blackish mb-4 text-center">
          Other Ways to Connect
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-mulearn-trusty-blue rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-mulearn-gray-900 text-sm mb-1">Email</h4>
            <p className="text-xs text-mulearn-gray-600">{contactInfo.email}</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-mulearn-duke-purple rounded-full flex items-center justify-center mx-auto mb-2">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-mulearn-gray-900 text-sm mb-1">Phone</h4>
            <p className="text-xs text-mulearn-gray-600">{contactInfo.phone}</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-mulearn-trusty-blue rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-mulearn-gray-900 text-sm mb-1">Location</h4>
            <p className="text-xs text-mulearn-gray-600">{contactInfo.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}