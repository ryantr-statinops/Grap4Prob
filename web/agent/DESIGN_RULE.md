# UI/UX DESIGN SYSTEM GUIDELINES (BRILLIANT.ORG STYLE)

## 1. Design Concept & Philosophy
- **Style**: Playful & Structural Minimalism, Visual-First EdTech.
- **Core Principle**: Distraction-free learning layout. Every piece of information must sit inside clean grids or beautifully rounded cards to represent bite-sized learning chunks.
- **Theme**: Pure White background for the main canvas, combined with highly vibrant, well-structured functional colors.

## 2. Color Tokens (Brilliant Aesthetics)
- **Backgrounds**:
  - Main Canvas: `#FFFFFF` (Pure White - creates space and focus).
  - Component/Section Card: `#F8FAFC` (Slate 50) or `#F1F5F9` (Slate 100).
- **Typography**:
  - Primary Headers/Text: `#0F172A` (Slate 900 - Deep, authoritative black-blue).
  - Secondary/Body Text: `#475569` (Slate 600 - High legibility for long text).
- **Brand & Gamification Accents**:
  - Primary Action / Brand Blue: `#2563EB` (Blue 600) - For CTA buttons and active paths.
  - Success Green: `#16A34A` (Green 600) - For correct answers, goals, and streaks.
  - Warning/Streak Orange: `#EA580C` (Orange 600) - For active learning streaks or premium highlights.
- **Borders**: `#E2E8F0` (Slate 200) - Super subtle 1px lines to separate clean grids.

## 3. Typography Hierarchy
- **Font Family**: Inter, SF Pro Display, or System Sans-serif (Geometric, friendly, highly legible).
- **Header 1 (Hero Title)**: `text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900`
- **Header 2 (Section Title)**: `text-2xl md:text-3xl font-bold text-slate-900`
- **Header 3 (Card Title)**: `text-lg md:text-xl font-semibold text-slate-900`
- **Body Text**: `text-base font-normal leading-relaxed text-slate-600`

## 4. UI/UX Structure & Layout Rules (Strict for AI)
- **Learning Cards**: 
  - Must use `bg-white`, `border border-slate-200`, and strict large border-radius `rounded-2xl` (16px) or `rounded-3xl` (24px).
  - Shadows must be extremely subtle or entirely flat (`shadow-sm` or border-only).
- **Buttons (Interactive Elements)**:
  - Big, chunky, and confident layout. Use `py-3 px-6 font-bold rounded-xl transition-all duration-200`.
  - Must look highly clickable: clean color fillings or distinctive solid borders.
- **Bite-Sized Grid Layout**:
  - Break curriculum or topics down into a `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` format.
  - Spacing must be generous: Use `space-y-8` or `space-y-12` between sections to allow content to "breathe".
- **Progress Tracking**:
  - Visual indicators (progress bars, badge icons) must use flat color blocks (`bg-green-600` or `bg-blue-600`) with smooth `rounded-full` caps.

## 5. Technology Stack
- **UI Framework**: React / Next.js with Tailwind CSS.
- **Icons**: Lucide React (Clean, geometric stroke icons).
- **Responsive**: Mobile-first design. Dashboards must adapt flawlessly from vertical phone timelines to wide desktop grids.
