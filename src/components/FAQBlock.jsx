const FAQBlock = ({ title = 'Preguntas frecuentes', items = [], className = 'py-14' }) => {
  if (!items.length) return null;

  return (
    <section className={className}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-6">{title}</h2>
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {items.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="flex items-center justify-between gap-4 font-semibold text-ink cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                {faq.question}
                <svg className="w-5 h-5 flex-shrink-0 text-gray-500 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQBlock;
