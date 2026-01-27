import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavigationClient } from './NavigationClient';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

const { usePathname } = await import('next/navigation');

describe('NavigationClient', () => {
  it('should render navigation with all links', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={0} />);

    expect(screen.getByText('TikTrack')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'New Video' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Drafts' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hashtags' })).toBeInTheDocument();
  });

  it('should render draft badge when drafts exist', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should not render draft badge when no drafts exist', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={0} />);

    // Should not have badge with number 0
    const draftLink = screen.getByRole('link', { name: 'Drafts' });
    expect(draftLink).not.toHaveTextContent('0');
  });

  it('should highlight active route - dashboard', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={0} />);

    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(dashboardLink).toHaveClass('border-blue-500');
    expect(dashboardLink).toHaveClass('text-gray-900');
  });

  it('should highlight active route - new video', () => {
    vi.mocked(usePathname).mockReturnValue('/videos/new');

    render(<NavigationClient draftCount={0} />);

    const newVideoLink = screen.getByRole('link', { name: 'New Video' });
    expect(newVideoLink).toHaveClass('border-blue-500');
  });

  it('should highlight active route - drafts', () => {
    vi.mocked(usePathname).mockReturnValue('/drafts');

    render(<NavigationClient draftCount={3} />);

    const draftsLink = screen.getByRole('link', { name: /drafts/i });
    expect(draftsLink).toHaveClass('border-blue-500');
  });

  it('should highlight active route - hashtags', () => {
    vi.mocked(usePathname).mockReturnValue('/hashtags');

    render(<NavigationClient draftCount={0} />);

    const hashtagsLink = screen.getByRole('link', { name: 'Hashtags' });
    expect(hashtagsLink).toHaveClass('border-blue-500');
  });

  it('should highlight when on nested route under /videos', () => {
    vi.mocked(usePathname).mockReturnValue('/videos/new/step2');

    render(<NavigationClient draftCount={0} />);

    const newVideoLink = screen.getByRole('link', { name: 'New Video' });
    // /videos/new/step2 starts with /videos/new so it should be active
    expect(newVideoLink).toHaveClass('border-blue-500');
  });

  it('should not highlight inactive routes', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={0} />);

    const hashtagsLink = screen.getByRole('link', { name: 'Hashtags' });
    expect(hashtagsLink).toHaveClass('border-transparent');
    expect(hashtagsLink).toHaveClass('text-gray-500');
  });

  it('should render TikTrack logo as link to dashboard', () => {
    vi.mocked(usePathname).mockReturnValue('/hashtags');

    render(<NavigationClient draftCount={0} />);

    const logoLinks = screen.getAllByRole('link', { name: 'TikTrack' });
    expect(logoLinks[0]).toHaveAttribute('href', '/dashboard');
  });

  it('should have correct href attributes', () => {
    vi.mocked(usePathname).mockReturnValue('/');

    render(<NavigationClient draftCount={0} />);

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'New Video' })).toHaveAttribute('href', '/videos/new');
    expect(screen.getByRole('link', { name: 'Drafts' })).toHaveAttribute('href', '/drafts');
    expect(screen.getByRole('link', { name: 'Hashtags' })).toHaveAttribute('href', '/hashtags');
  });
});
