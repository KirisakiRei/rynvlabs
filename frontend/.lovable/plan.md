# rynvlabs — Premium Agency Portfolio Website

## Design System: "Premium Tech Noir"

A dark, industrial, luxurious aesthetic inspired by high-end audio equipment and luxury engineering. Deep onyx backgrounds, gunmetal card surfaces, and a sparingly-used deep crimson accent. Typography pairing of **Syne** (headings) and **Inter** (body) for a geometric, engineered feel.

---

## Page Sections (Single-Page with Smooth Scroll)

### 1. Navbar

- Bold "rynvlabs" text logo in white
- Navigation links: Services, Products, Portfolio, Contact
- "Book Consultation" outline button with crimson border
- Sticky on scroll with subtle background blur

### 2. Hero Section

- Centered dramatic headline: *"Bridging Digital Logic with Physical Reality"*
- Subheadline describing IoT, software, and automation expertise
- Subtle geometric circuit pattern overlay on dark background (static, low opacity)
- Solid crimson "Explore Solutions" CTA button
- Fade-in entrance animations

### 3. Services — Bento Grid

Four service cards in an asymmetric bento grid layout:

- **Digital Solutions** — Web Apps, SaaS, Mobile
- **IoT & Embedded** — Custom Hardware, Firmware
- **Industrial Automation** — PLC, Control Systems
- **Research & Prototyping** — Academic support, MVP development

Each card with Lucide icon, hover effect (lighten background + crimson border)

### 4. Featured Product: "Smart Scales"

- Split layout: text features on left, device image placeholder on right
- Highlights: High precision, Cloud Integration, Real-time monitoring
- Dark card aesthetic with subtle crimson accents

### 5. Portfolio / Project Showcase

- Filter tabs: All, Software, IoT/Hardware, Automation
- Grid of project cards with placeholder images, titles, descriptions, and tech stack pill tags
- Mock projects: "Line Follower Robot", "SaaS QR Code Generator", "Smart Fish Pond Scale", and more
- Scroll-triggered entrance animations

### 6. Project Detail View (Modal)

- Opens when a project card is clicked
- Sections: Hero image, Challenge, Solution, Technical Deep Dive (system diagram placeholder), Image Gallery
- Clean overlay modal with smooth open/close transitions

### 7. Contact Section

- Simple contact prompt with "Book Consultation" CTA
- Clean, minimal footer with copyright

---

## Technical Approach

- React + Tailwind CSS with custom dark color palette
- Framer Motion for scroll-triggered fade-in animations
- Lucide React icons throughout
- Fully responsive (mobile-first)
- All content uses realistic mock data (no backend needed)

&nbsp;

ADDITIONAL REFINEMENTS TO THE PLAN:

1. **Tech Stack Ticker (Trust Signal):**

   - Place an infinite scrolling marquee (slider) immediately below the Hero Section.

   - Show logos of tech stacks in monochrome (gray #555), strictly SVG paths: React, Laravel, Docker, Python, C++, Arduino, Raspberry Pi, AWS.

   - On hover, logos regain their original brand colors.

2. **Product Specs for "Smart Scales":**

   - In the Product Section, add a small "Technical Specs" list styled like code comments or a terminal view.

   - Example items: "Conn: MQTT/WebSocket", "Power: 12V DC", "Material: Aluminum Alloy", "Latency: <50ms".

3. **"How We Work" Steps:**

   - Add a section before the Footer called "Engineering Process".

   - 4 Horizontal Steps linked by a thin line: 1. Logic Design -> 2. Prototyping -> 3. Integration -> 4. Deployment.

   - Use thin, minimal line icons for each step.

4. **Contact Form Detail:**

   - The contact section must include a functional-looking form, not just a button.

   - Inputs: Name, Email, Message.

   - Select Dropdown for "Project Category": [Web/SaaS, IoT/Hardware, Automation, Research/Academic].

   - Style: Minimalist, underlined inputs (border-bottom only), turning Crimson #B31F2E when active/focused.

5. **Texture:**

   - Add a very subtle CSS "noise" or "grain" texture overlay (opacity 0.03) over the entire #121212 background to give it an industrial, premium matte finish.