import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setJsonLdSchemas, setSeoMeta } from '../lib/seo';

const SeoHead = ({ title, description, image, noindex = false, schemas = [] }) => {
  const location = useLocation();

  useEffect(() => {
    setSeoMeta({
      title,
      description,
      image,
      pathname: location.pathname,
      noindex
    });
    setJsonLdSchemas(schemas);
  }, [description, image, location.pathname, noindex, schemas, title]);

  return null;
};

export default SeoHead;
