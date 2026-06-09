const SeoTextBlock = ({ title, paragraphs = [] }) => {
  if (!paragraphs.length) return null;

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-6">{title}</h2>}
        <div className="space-y-4 text-gray-700 leading-relaxed">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 30)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeoTextBlock;
