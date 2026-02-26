# Nova Lux - Premium E-Commerce

A luxury e-commerce platform for premium fashion products.

## Features

- 🛍️ Product catalog with image uploads
- 🛒 Shopping cart functionality
- 🌍 Multi-language support (Arabic, French, English)
- 🌙 Dark/Light theme toggle
- 📱 Mobile responsive design
- 🔐 Admin panel for product and order management

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query, Context API
- **Internationalization**: react-i18next

## Getting Started

### Prerequisites

- Node.js & npm installed

### Installation

```bash
# Clone the repository
git clone https://github.com/Zertx20/novalux.git

# Navigate to project
cd novalux

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── types/          # TypeScript type definitions
└── lib/            # Utility functions
```

## Deployment

Build for production:

```bash
npm run build
```

## License

© 2024 Nova Lux. All rights reserved.
