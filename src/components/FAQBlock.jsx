const FAQBlock = ({ title = 'Preguntas frecuentes', items = [] }) => {
  if (!items.length) return null;

  return (
    <section className="py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-6">{title}</h2>
        <div className="space-y-4">
          {items.map((faq) => (
            <details key={faq.question} className="bg-white border border-gray-200 rounded-xl p-5">
              <summary className="font-semibold text-text cursor-pointer">{faq.question}</summary>
              <p className="mt-3 text-gray-700 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQBlock;
