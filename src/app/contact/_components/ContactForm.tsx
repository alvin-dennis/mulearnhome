"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Zod schema for validation
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^(\+91[\s]?)?[0-9]{10}$/.test(val), {
      message: "Please enter a valid 10-digit phone number",
    }),
  muId: z.string().optional(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Form submitted:", data);
    toast.success("Message sent successfully!");
    reset(); // Reset the form fields after successful submission
    // Placeholder: No backend submission
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-display font-bold mb-4 text-center">
        Contact Us
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            {...register("name")}
            className="focus:ring-2 focus:ring-mulearn-trusty-blue"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="focus:ring-2 focus:ring-mulearn-trusty-blue"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number (optional)"
            {...register("phone")}
            className="focus:ring-2 focus:ring-mulearn-trusty-blue"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* MuID Field */}
        <div>
          <Label htmlFor="muId">MuID</Label>
          <Input
            id="muId"
            type="text"
            placeholder="Enter your MuID (optional)"
            {...register("muId")}
            className="focus:ring-2 focus:ring-mulearn-trusty-blue"
          />
          {errors.muId && (
            <p className="text-red-500 text-sm mt-1">{errors.muId.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <Label htmlFor="description">Description / Message *</Label>
          <textarea
            id="description"
            placeholder="Enter your message"
            {...register("description")}
            className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mulearn-trusty-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button variant="mulearn" type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </div>
  );
}
