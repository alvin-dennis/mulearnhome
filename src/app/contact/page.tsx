import ContactForm from "./_components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mulearn-gray-50 to-mulearn-whitish">
      {/* Hero Section */}
      <section className="pt-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-mulearn-blackish mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-mulearn-gray-600 max-w-2xl mx-auto mb-8">
            Have questions or feedback? We'd love to hear from you. 
            Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-4 px-6">
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}