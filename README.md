# Content Management System (CMS)

A modern, responsive content management system built with **Next.js 14**, **React**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

- 📊 **Dashboard**: Overview with post statistics and recent activity
- 📝 **Post Management**: Create, edit, publish, and delete posts
- 🖼️ **Media Library**: Upload and manage media files with drag & drop
- 👥 **User Management**: Manage users with different roles (admin, editor, author)
- ⚙️ **Settings**: Configure site settings and preferences
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Works seamlessly on all devices
- ⚡ **Fast**: Built with Next.js for optimal performance

## 🛠 Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cms
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard page
│   ├── posts/page.tsx     # Posts management page
│   ├── media/page.tsx     # Media library page
│   ├── users/page.tsx     # User management page
│   ├── settings/page.tsx  # Settings page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── CMSLayout.tsx      # Main layout component
│   ├── Dashboard.tsx      # Dashboard component
│   ├── Posts.tsx          # Posts management component
│   ├── Media.tsx          # Media library component
│   ├── Users.tsx          # User management component
│   └── Settings.tsx       # Settings component
└── types/                 # TypeScript type definitions
    └── index.ts           # Type definitions
```

## 🎯 Features in Detail

### Dashboard
- Overview statistics (total posts, published, drafts, this month)
- Recent posts list with status indicators
- Quick action cards for common tasks

### Post Management
- Create new posts with title, content, and author
- View all posts in a clean list format
- Toggle post status (draft/published)
- Delete posts with confirmation
- Modal for creating new posts

### Media Library
- Drag & drop file upload
- Support for images, videos, and documents
- File size display and upload date
- Grid view with hover effects
- Delete media files

### User Management
- Add new users with roles (admin, editor, author)
- Role-based color coding
- User avatar initials
- Edit and delete user functionality

### Settings
- Site title and description configuration
- Logo URL with preview
- Theme selection (light/dark)
- Additional settings toggles
- Form validation and save feedback

## 🎨 Design System

The CMS uses Tailwind CSS with a consistent design system:

- **Colors**: Blue primary, gray neutrals, semantic colors (green, yellow, red)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Components**: Reusable components with hover states and transitions
- **Responsive**: Mobile-first design that works on all screen sizes

## 🔧 Customization

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/app/`
3. Update navigation in `CMSLayout.tsx`
4. Add new types in `src/types/index.ts`

### Styling
- All styling is done with Tailwind CSS utility classes
- Custom styles can be added to `src/app/globals.css`
- Component-specific styles are co-located with components

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔮 Future Enhancements

- [ ] Rich text editor for post content
- [ ] Image optimization and CDN integration
- [ ] User authentication and authorization
- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] API routes for backend functionality
- [ ] Search functionality
- [ ] Categories and tags for posts
- [ ] SEO optimization
- [ ] Dark mode implementation
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Backup and restore functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Emoji](https://emojipedia.org/)
