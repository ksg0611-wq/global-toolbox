---
title: "How to Achieve a 100/100 Lighthouse Score on Cloudflare Pages"
description: "A practical guide to optimizing asset delivery, caching, and static rendering to reach the absolute maximum speed score on the edge network."
date: "2026-07-15"
author: "SungGeun Kim"
tags: ["Web Performance", "Cloudflare", "SEO"]
slug: "optimize-cloudflare-pages-lighthouse-score"
---

## The Obsession with Web Performance

As web developers, we inherently understand that speed is a feature. A blazing-fast website not only provides a superior user experience but is also a critical ranking factor for Google's Core Web Vitals. When I initially launched Global ToolBox, my Lighthouse scores hovered around the 70s. However, by strategically utilizing Cloudflare Pages alongside a few frontend optimizations, I successfully pushed the score to a perfect 100/100.

Here is the exact playbook I used to achieve this milestone.

## 1. Static Site Generation (SSG) is Non-Negotiable

If you are shipping a standard React Single Page Application (SPA), your Time to Interactive (TTI) and First Contentful Paint (FCP) will inevitably suffer due to the heavy JavaScript payload required before rendering.

To bypass this, I integrated `react-snap` into my Vite build pipeline. By pre-rendering the HTML at build time, the browser can immediately paint the UI upon receiving the document, drastically improving FCP.

## 2. Leveraging Cloudflare's Edge Network

Cloudflare Pages automatically serves your assets from their global CDN. However, simply uploading your files isn't enough to achieve a perfect score. You need to enforce aggressive caching strategies.

### Implementing Custom `_headers`

By defining a `_headers` file in your `public` directory, you can instruct the browser to aggressively cache immutable assets (like your compiled CSS, JS, and optimized images).

```text
# /public/_headers

# Cache static assets aggressively
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Ensure HTML files are revalidated
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

This ensures returning visitors load the application instantaneously without making redundant network requests for unchanged assets.

## 3. Asset and Image Optimization

Large images are the silent killers of Lighthouse scores. Instead of relying on traditional PNGs or JPEGs, I transitioned all static assets to next-generation formats like **WebP** and **AVIF**.

Furthermore, lazy loading should be applied to any image not immediately visible in the initial viewport:

```html
<img src="/assets/hero-graphic.webp" alt="Hero Graphic" loading="lazy" decoding="async" />
```

Combining `loading="lazy"` with `decoding="async"` prevents image decoding from blocking the main thread, keeping the UI perfectly responsive.

## Conclusion

Achieving a perfect 100/100 Lighthouse score is rarely about a single "silver bullet." Instead, it is the culmination of Static Site Generation, edge-level caching, and meticulous asset optimization. By fully utilizing the capabilities of Cloudflare Pages, solo developers can deliver enterprise-grade performance without the enterprise-grade infrastructure costs.
