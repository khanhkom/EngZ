# EngZ Landing Page Specification

This document defines the requirements and design specification for the EngZ landing page. Use this as the blueprint for implementation.

## 1. Project Overview
**Product Name**: EngZ - Easy Dictionary
**Tagline**: Master English with Contextual Lookups.
**Value Proposition**: Instantly translate and learn new words by selecting text on any webpage. Supports Google, Bing, and Cambridge dictionaries in a single view.

## 2. Design Aesthetics & UX
> **Philosophy**: Premium, lightweight, and focused on learning focus.

*   **Visual Style**:
    *   **Glassmorphism**: Subtle usage on cards and sticky headers to convey a "modern utility" feel.
    *   **Typography**: `Inter` or `Plus Jakarta Sans` for clean, readable text.
    *   **Color Palette**:
        *   Primary: Deep Indigo/Violet (Intellectual, Focus).
        *   Accent: Vibrant Cyan/Teal (Discovery, Growth).
        *   Background: Dark/Light mode support. Dark mode should use rich dark grays (`#0f172a`), not pure black.
    *   **Motion**: `framer-motion` for smooth entrance animations (fade-up, stagger children) and hover effects.

## 3. Site Structure (Single Page)

### A. Hero Section
*   **Headline**: "The Smartest Way to Learn Vocabulary While You Surf."
*   **Subheadline**: "Select any text to get instant definitions from Google, Bing, and Cambridge. No context switching required."
*   **CTA Button**: "Add to Chrome - It's Free" (Primary, Glowing).
*   **Visual**: A high-fidelity mockup of the extension pop-over active on a webpage. Use `generate_image` or a CSS mockup.

### B. Feature Grid (Bento Grid Style)
1.  **Multi-Source Lookup**: Icons of Google, Bing, Cambridge. "Compare definitions to truly understand nuances."
2.  **Instant Capture**: "Just double-click or select text. We handle the rest."
3.  **Pronunciation**: Audio icon. "Listen to native pronunciations in US/UK English."
4.  **History & Review**: "Your lookups are saved. Review them later to build your vocabulary."

### C. "How it Works"
*   Step 1: Install EngZ.
*   Step 2: Surf the web as usual.
*   Step 3: Highlight a word.
*   Step 4: Learn instantly.

### D. Footer
*   Links: Support, Privacy Policy, GitHub.
*   Social Proof: "Open Source and Privacy Friendly."

## 4. Technical Stack
*   **Framework**: Next.js 15 (App Router)
*   **Styling**: Tailwind CSS (v3/v4) with `clsx` and `tailwind-merge`.
*   **Icons**: `lucide-react`.
*   **Animations**: `framer-motion`.
*   **Package Location**: `packages/landing` (to integrate with existing monorepo).

## 5. Implementation Plan
1.  **Setup**: Initialize Next.js app in `packages/landing`.
2.  **Design System**: extend `tailwind.config.ts` with EngZ brand colors.
3.  **Components**: Build `Hero`, `FeatureCard`, `Navbar`.
4.  **Content**: Fill with copy from this spec.
5.  **Polish**: Add animations and responsive checks.
