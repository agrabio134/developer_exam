import "./globals.css";


export const metadata = {
  title: 'Table Waitlist Lite',
  description: 'Restaurant waitlist management prototype',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <a href="/waitlist" className="nav-link">Waitlist</a>
          <a href="/seated" className="nav-link">Seated Log</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
