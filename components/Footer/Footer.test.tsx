import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('should render the footer', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should display the TikTrack logo', () => {
    render(<Footer />);
    const logo = screen.getByAltText('TikTrack');
    expect(logo).toBeInTheDocument();
  });

  it('should have Product links', () => {
    render(<Footer />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('should have Company links', () => {
    render(<Footer />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should have Legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  it('should have correct links', () => {
    render(<Footer />);
    const featureLink = screen.getByRole('link', { name: 'Features' });
    expect(featureLink).toHaveAttribute('href', '/features');
  });

  it('should display copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('© 2026 tik-track. All rights reserved.')).toBeInTheDocument();
  });

  it('should display footer description', () => {
    render(<Footer />);
    expect(screen.getByText('Track your TikTok success with real-time analytics.')).toBeInTheDocument();
  });
});
