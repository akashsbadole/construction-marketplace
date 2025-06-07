import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  noIndex?: boolean
  structuredData?: object
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = '/og-image.jpg',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noIndex = false,
    structuredData
  } = config

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title,
      description,
      type: ogType as any,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      siteName: 'BuildConnect'
    },
    twitter: {
      card: twitterCard as any,
      title,
      description,
      images: [ogImage]
    },
    alternates: canonical ? { canonical } : undefined
  }

  return metadata
}

// Common SEO configurations
export const seoConfigs = {
  home: {
    title: 'BuildConnect - India\'s Leading Construction Marketplace',
    description: 'Connect with verified contractors, suppliers, and vendors for your construction projects. Get quotes, compare prices, and hire the best professionals in your area.',
    keywords: [
      'construction marketplace',
      'contractors india',
      'building materials',
      'construction suppliers',
      'home renovation',
      'commercial construction',
      'construction quotes'
    ],
    canonical: 'https://buildconnect.com'
  },

  contractors: {
    title: 'Find Verified Contractors - BuildConnect',
    description: 'Hire verified and experienced contractors for residential, commercial, and industrial construction projects. View portfolios, read reviews, and get instant quotes.',
    keywords: [
      'contractors near me',
      'construction contractors',
      'building contractors',
      'residential contractors',
      'commercial contractors',
      'verified contractors india'
    ],
    canonical: 'https://buildconnect.com/contractors'
  },

  vendors: {
    title: 'Construction Material Suppliers & Vendors - BuildConnect',
    description: 'Find reliable suppliers for cement, steel, bricks, and all construction materials. Compare prices, check availability, and get fast delivery across India.',
    keywords: [
      'construction materials',
      'building materials suppliers',
      'cement suppliers',
      'steel suppliers',
      'construction vendors',
      'material suppliers near me'
    ],
    canonical: 'https://buildconnect.com/vendors'
  },

  projects: {
    title: 'Post Construction Projects - Get Free Quotes - BuildConnect',
    description: 'Post your construction project and receive competitive quotes from verified contractors. Free project posting with instant contractor matching.',
    keywords: [
      'post construction project',
      'construction quotes',
      'hire contractors',
      'construction project management',
      'building project quotes'
    ],
    canonical: 'https://buildconnect.com/projects'
  },

  materials: {
    title: 'Construction Materials & Building Supplies - BuildConnect',
    description: 'Buy quality construction materials online. Wide range of cement, steel, bricks, tiles, and building supplies with competitive prices and fast delivery.',
    keywords: [
      'construction materials online',
      'building materials',
      'cement online',
      'steel bars',
      'construction supplies',
      'building supplies india'
    ],
    canonical: 'https://buildconnect.com/materials'
  }
}

// Generate structured data for different entity types
export function generateStructuredData(type: string, data: any) {
  const baseUrl = 'https://buildconnect.com'

  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'BuildConnect',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'India\'s leading construction marketplace connecting contractors, suppliers, and customers',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-1234567890',
          contactType: 'customer service',
          availableLanguage: ['English', 'Hindi']
        },
        sameAs: [
          'https://facebook.com/buildconnect',
          'https://twitter.com/buildconnect',
          'https://linkedin.com/company/buildconnect'
        ]
      }

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'BuildConnect',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }

    case 'contractor':
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${baseUrl}/contractors/${data.id}`,
        name: data.businessName,
        description: data.description,
        url: data.website,
        image: data.avatar || `${baseUrl}/placeholder-contractor.jpg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.businessAddress?.address,
          addressLocality: data.businessAddress?.city,
          addressRegion: data.businessAddress?.state,
          postalCode: data.businessAddress?.pincode,
          addressCountry: 'IN'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.totalReviews,
          bestRating: 5,
          worstRating: 1
        },
        priceRange: data.priceRange || '₹₹₹',
        telephone: data.phone,
        openingHours: data.businessHours ? Object.entries(data.businessHours)
          .filter(([_, hours]: [string, any]) => hours.isOpen)
          .map(([day, hours]: [string, any]) => `${day.substring(0, 2).toUpperCase()} ${hours.openTime}-${hours.closeTime}`) : []
      }

    case 'vendor':
      return {
        '@context': 'https://schema.org',
        '@type': 'Store',
        '@id': `${baseUrl}/vendors/${data.id}`,
        name: data.businessName,
        description: data.description,
        url: data.website,
        image: data.logo || `${baseUrl}/placeholder-vendor.jpg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.businessAddress?.address,
          addressLocality: data.businessAddress?.city,
          addressRegion: data.businessAddress?.state,
          postalCode: data.businessAddress?.pincode,
          addressCountry: 'IN'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.totalReviews,
          bestRating: 5,
          worstRating: 1
        },
        paymentAccepted: data.paymentMethods?.join(', '),
        currenciesAccepted: 'INR',
        openingHours: data.businessHours ? Object.entries(data.businessHours)
          .filter(([_, hours]: [string, any]) => hours.isOpen)
          .map(([day, hours]: [string, any]) => `${day.substring(0, 2).toUpperCase()} ${hours.openTime}-${hours.closeTime}`) : []
      }

    case 'product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${baseUrl}/products/${data.id}`,
        name: data.name,
        description: data.description,
        image: data.images?.[0] || `${baseUrl}/placeholder-product.jpg`,
        brand: {
          '@type': 'Brand',
          name: data.brand
        },
        category: data.category,
        sku: data.sku,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'INR',
          availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: data.vendorName
          }
        },
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.reviewCount,
          bestRating: 5,
          worstRating: 1
        } : undefined
      }

    case 'review':
      return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        '@id': `${baseUrl}/reviews/${data.id}`,
        reviewBody: data.comment,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: data.rating,
          bestRating: 5,
          worstRating: 1
        },
        author: {
          '@type': 'Person',
          name: data.userName
        },
        datePublished: data.createdAt,
        itemReviewed: {
          '@type': data.entityType === 'contractor' ? 'LocalBusiness' : 'Store',
          name: data.entityName
        }
      }

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.url}`
        }))
      }

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }

    default:
      return null
  }
}

// SEO utility functions
export function generateCanonicalUrl(path: string): string {
  const baseUrl = 'https://buildconnect.com'
  return `${baseUrl}${path}`
}

export function generateOGImage(title: string, subtitle?: string): string {
  const baseUrl = 'https://buildconnect.com'
  const encodedTitle = encodeURIComponent(title)
  const encodedSubtitle = subtitle ? encodeURIComponent(subtitle) : ''
  
  return `${baseUrl}/api/og?title=${encodedTitle}&subtitle=${encodedSubtitle}`
}

export function generateSitemap(): string {
  const baseUrl = 'https://buildconnect.com'
  const staticPages = [
    '',
    '/contractors',
    '/vendors',
    '/materials',
    '/projects',
    '/post-project',
    '/about',
    '/contact',
    '/terms',
    '/privacy'
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`).join('')}
</urlset>`

  return sitemap
}

export function generateRobotsTxt(): string {
  const baseUrl = 'https://buildconnect.com'
  
  return `User-agent: *
Allow: /

# Disallow admin and private pages
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /contractors
Allow: /vendors
Allow: /materials
Allow: /projects

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`
}
