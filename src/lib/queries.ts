/**
 * GROQ queries. Each pageBuilder block's fields are spelled out
 * explicitly (not `...`) so adding a field to a block's schema doesn't
 * silently start fetching it everywhere — you opt each query in.
 *
 * Try any of these live at /studio/vision before wiring them into a
 * page, with real content once a project is connected.
 */

const linkFragment = /* groq */ `{
  text,
  linkType,
  openInNewTab,
  "url": select(
    linkType == "external" => externalUrl,
    linkType == "internal" && internalLink->_type == "homePage" => "home",
    linkType == "internal" => internalLink->slug.current
  )
}`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[] {
    _type == "heroBlock" => {
      _type,
      _key,
      backgroundImage,
      heading,
      subheading,
      darkenOverlay,
    },
    _type == "splitHeroBlock" => {
      _type,
      _key,
      eyebrow,
      heading,
      body,
      primaryButton ${linkFragment},
      secondaryButton ${linkFragment},
      image,
    },
    _type == "textBlock" => {
      _type,
      _key,
      eyebrow,
      heading,
      body,
      button ${linkFragment},
      pullQuote,
    },
    _type == "textWithImageBlock" => {
      _type,
      _key,
      eyebrow,
      heading,
      body,
      button ${linkFragment},
      facts[] { label, value },
      showContactDetails,
      image,
      imageStyle,
      imagePosition,
    },
    _type == "personGridBlock" => {
      _type,
      _key,
      heading,
      people[] { name, role, photo, bio },
      button ${linkFragment},
    },
    _type == "imageGalleryBlock" => {
      _type,
      _key,
      heading,
      layout,
      images[] {
        ...,
        caption,
        credit,
        "dimensions": asset->metadata.dimensions
      },
    },
    _type == "ctaBlock" => {
      _type,
      _key,
      eyebrow,
      heading,
      body,
      button ${linkFragment},
    },
    _type == "testimonialsBlock" => {
      _type,
      _key,
      eyebrow,
      heading,
      layout,
      quotes[] { quote, name, source, date, group },
      limit,
      button ${linkFragment},
    },
    _type == "infoGridBlock" => {
      _type,
      _key,
      eyebrow,
      heading,
      columns,
      items[] { title, meta, detail },
    },
    _type == "contactFormBlock" => {
      _type,
      _key,
      heading,
      nameLabel,
      namePlaceholder,
      emailLabel,
      emailPlaceholder,
      messageLabel,
      messagePlaceholder,
      submitLabel,
      successMessage,
      errorMessage,
    },
    _type == "eventsBlock" => {
      _type,
      _key,
      eyebrow,
      heading,
      limit,
      button ${linkFragment},
      // Doesn't come from this block's own fields — every Event
      // document is queried here directly, so adding an event in the
      // Studio shows up automatically without editing any page.
      "events": *[_type == "event" && defined(date)] | order(date asc) {
        _id,
        title,
        description,
        date,
        venue,
        location,
        ticketLink ${linkFragment}
      }
    },
    _type == "recordingsBlock" => {
      _type,
      _key,
      eyebrow,
      heading,
      button ${linkFragment},
      // Hand-picked highlights, in the order the editor put them —
      // empty unless the block's own "featured" field is filled in.
      "featured": featured[]-> {
        _id,
        title,
        composer,
        category,
        mediaUrl,
        thumbnail
      },
      "recordings": *[_type == "recording"] | order(category asc, title asc) {
        _id,
        title,
        composer,
        category,
        mediaUrl,
        thumbnail
      }
    },
  }
`;

export const HOME_PAGE_QUERY = /* groq */ `
  *[_type == "homePage"][0] {
    ${pageBuilderFragment},
    seo
  }
`;

export const PAGE_QUERY = /* groq */ `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    ${pageBuilderFragment},
    seo
  }
`;

export const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0] {
    siteName,
    logo,
    navItems[] {
      link ${linkFragment},
      children[] ${linkFragment}
    },
    email,
    phone,
    address,
    managementName,
    website,
    socialLinks[] { platform, url },
    copyrightName,
    language,
    siteDescription,
    defaultShareImage,
    entityType
  }
`;

/** Everything the sitemap lists: the home page and each page not hidden from search engines. */
export const SITEMAP_QUERY = /* groq */ `{
  "home": *[_type == "homePage"][0] { "slug": null, "updatedAt": _updatedAt },
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true] { "slug": slug.current, "updatedAt": _updatedAt }
}`;
