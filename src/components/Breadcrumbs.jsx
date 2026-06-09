import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
      <ol className="flex items-center flex-wrap gap-2">
        {items.map((item, index) => (
          <li key={`${item.path}-${item.label}`} className="flex items-center gap-2">
            {index < items.length - 1 ? (
              <Link to={item.path} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-text font-semibold">{item.label}</span>
            )}
            {index < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
