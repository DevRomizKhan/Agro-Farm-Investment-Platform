interface BlogJsonLdProps {
  post: any
}

export default function BlogJsonLd({ post }: BlogJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.meta_description,
    image: post.featured_image,
    author: post.author?.full_name
      ? {
          '@type': 'Person',
          name: post.author.full_name,
        }
      : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    publisher: {
      '@type': 'Organization',
      name: 'NHK Agro Invest',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
