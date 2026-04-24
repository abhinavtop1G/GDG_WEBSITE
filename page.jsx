import './globals.css';

export const metadata = {
  title: 'GDG Universe — Build. Learn. Impact.',
  description:
    'An interactive 3D universe of the Google Developers Group student community. Explore events, learning tracks, projects, and real-world impact.',
  keywords: ['GDG', 'Google Developers Group', 'student', 'community', 'AI', 'ML', 'Cloud'],
  openGraph: {
    title: 'GDG Universe',
    description: 'Build. Learn. Impact. — An interactive universe of developers.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
