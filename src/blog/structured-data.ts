import type { BlogPost } from "./types";
import { getCanonicalUrl, getPostDescription, getPostTitle, getSiteName } from "./seo";

export function buildBreadcrumbJsonLd(post: BlogPost) {
  const primaryCategory = post.categories[0];

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: getCanonicalUrl("/")
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: getCanonicalUrl("/blog")
    }
  ];

  if (primaryCategory) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: primaryCategory.name,
      item: getCanonicalUrl(`/category/${primaryCategory.slug}`)
    });
  }

  items.push({
    "@type": "ListItem",
    position: primaryCategory ? 4 : 3,
    name: post.title,
    item: getCanonicalUrl(`/blog/${post.slug}`)
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}

export function buildAuthorJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: post.author.name,
    description: post.author.bio,
    url: getCanonicalUrl(`/author/${post.author.slug}`),
    worksFor: {
      "@type": "Organization",
      name: getSiteName()
    }
  };
}

export function buildFaqJsonLd(post: BlogPost) {
  if (post.faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function buildArticleEnhancedJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: getPostTitle(post),
    description: getPostDescription(post),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: getCanonicalUrl(`/author/${post.author.slug}`)
    },
    about: post.categories.map((category) => category.name),
    mainEntityOfPage: getCanonicalUrl(`/blog/${post.slug}`),
    publisher: {
      "@type": "Organization",
      name: getSiteName()
    }
  };
}
