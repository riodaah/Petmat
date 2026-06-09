const SITE_URL = 'https://petmat.cl';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export function buildAbsoluteUrl(pathname = '/') {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${normalizedPath}`;
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function setSeoMeta({
  title,
  description,
  pathname,
  image = DEFAULT_IMAGE,
  noindex = false
}) {
  const canonical = buildAbsoluteUrl(pathname);
  document.title = title;

  upsertMeta('meta[name="description"]', {
    name: 'description',
    content: description
  });
  upsertMeta('meta[name="robots"]', {
    name: 'robots',
    content: noindex ? 'noindex,nofollow' : 'index,follow'
  });

  upsertLink('link[rel="canonical"]', {
    rel: 'canonical',
    href: canonical
  });

  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'PetMAT' });
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'es_CL' });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
  upsertMeta('meta[property="twitter:card"]', { property: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[property="twitter:url"]', { property: 'twitter:url', content: canonical });
  upsertMeta('meta[property="twitter:title"]', { property: 'twitter:title', content: title });
  upsertMeta('meta[property="twitter:description"]', { property: 'twitter:description', content: description });
  upsertMeta('meta[property="twitter:image"]', { property: 'twitter:image', content: image });
}

export function setJsonLdSchemas(schemas = []) {
  const previous = document.querySelectorAll('script[data-seo-schema="true"]');
  previous.forEach((node) => node.remove());

  schemas.forEach((schema) => {
    if (!schema) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoSchema = 'true';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: buildAbsoluteUrl(item.path)
    }))
  };
}
