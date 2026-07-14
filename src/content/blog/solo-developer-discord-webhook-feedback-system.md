---
title: "Building a Free, DB-Less Feedback System via Discord Webhooks for Solo Developers"
description: "Learn how solo developers can collect customer feedback and error logs for free without a database or admin page using Discord Webhooks and Cloudflare Functions."
date: "2026-07-13"
author: "SungGeun Kim"
tags: ["Discord Webhook", "Cloudflare Functions", "Feedback System", "Indie Maker", "Serverless"]
slug: "solo-developer-discord-webhook-feedback-system"
---

## Why Do Solo Developers Need a Feedback System?

Collecting user feedback and in-site error logs is vital for product iteration. However, for a solo indie maker, building a dedicated database to store feedback and an accompanying admin dashboard is often an inefficient use of resources.

To solve this, I leveraged **Discord**—the messenger I check most frequently—to construct a webhook system that delivers instant feedback without incurring additional costs or maintenance overhead.

## How to Create a Discord Webhook

Setting up a Discord webhook is remarkably straightforward:

1. Create a dedicated channel (e.g., `#feedback-logs`) in your target Discord server.
2. Navigate to Channel Settings (gear icon) > **Integrations** > **Webhooks**.
3. Click 'New Webhook', assign it a name, and hit the **Copy Webhook URL** button. (Ensure this URL is never exposed publicly.)

## Integrating with Cloudflare Functions (Code Example)

Sending POST requests directly from the frontend to a Discord webhook URL exposes it to security vulnerabilities. Therefore, a serverless function is required to act as a secure backend proxy. I utilized **Cloudflare Functions (Workers)**, which pairs perfectly with Cloudflare Pages.

Below is a simple implementation of `functions/api/feedback.js`:

```javascript
// Utilizes the FEEDBACK_WEBHOOK_URL stored in environment variables (env).
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { name, email, message, type } = data;

    const embed = {
      title: `New ${type === 'bug' ? 'Bug Report 🐛' : 'Feedback 💡'}`,
      color: type === 'bug' ? 16711680 : 3447003, // Red for bugs, Blue for feedback
      fields: [
        { name: 'Name', value: name || 'Anonymous', inline: true },
        { name: 'Email', value: email || 'None', inline: true },
        { name: 'Message', value: message }
      ],
      timestamp: new Date().toISOString()
    };

    const response = await fetch(env.FEEDBACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!response.ok) {
      throw new Error('Failed to send Discord Webhook');
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
```

On the frontend, you simply send the form data to the `/api/feedback` endpoint upon submission.

## Architectural Insights and System Advantages

The most significant advantages of this system are its **instant responsiveness** and **zero cost**. When a user submits a bug report, my phone immediately chimes with a Discord notification, allowing for rapid response times.

By eliminating database maintenance and admin page management, and fully leveraging Cloudflare's auto-scaling edge network, this architecture is heavily optimized for the agility required in solo development. If you are struggling with feedback collection, I highly recommend adopting this setup!
