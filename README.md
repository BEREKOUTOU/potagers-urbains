# Green City Grow Hub

An urban gardening platform that connects city dwellers with local gardens, fosters community collaboration, and promotes sustainable urban agriculture through technology and shared resources.

## 🌱 Features

- **Garden Discovery & Management**: Browse, join, and manage urban gardens in your area
- **Community Collaboration**: Connect with fellow gardeners, share tips, and participate in discussions
- **AI-Powered Features**: Get intelligent recommendations for gardening practices
- **Resource Sharing**: Access tools, guides, and educational content
- **Garden Statistics**: Track and analyze garden performance and growth metrics
- **User Profiles**: Manage your gardening profile and contributions
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd green-city-grow-hub-main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run build:dev` - Build the project in development mode
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview the production build locally

## 📁 Project Structure

``
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── data/               # Static data and mock data
└── assets/             # Images and static assets
``

## 🌟 Key Components

- **HeroSection**: Landing page hero with call-to-action
- **GardensGrid**: Display grid of available gardens
- **DashboardCards**: User dashboard with quick actions
- **Community**: Discussion forums and community features
- **Resources**: Educational content and gardening resources
- **StatsSection**: Analytics and statistics display

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

*Empowering urban communities to grow together, one garden at a time.*
