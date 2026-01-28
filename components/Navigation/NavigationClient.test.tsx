import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavigationClient } from './NavigationClient';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

const { usePathname } = await import('next/navigation');

const mockNotifications = [];
const mockChannels = [{
  id: 'channel-1',
  userId: 'user-1',
  name: 'Main Channel',
  handle: 'mainhandle',
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}];
const mockCurrentChannelId = 'channel-1';

describe('NavigationClient', () => {
  it('should render navigation with all links', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    expect(screen.getByAltText('TikTrack Logo')).toBeInTheDocument();
    const dashboardLinks = screen.getAllByRole('link', { name: /Dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThan(0);
    const newVideoLinks = screen.getAllByRole('link', { name: /New Video/i });
    expect(newVideoLinks.length).toBeGreaterThan(0);
    const draftsLinks = screen.getAllByRole('link', { name: /Drafts/i });
    expect(draftsLinks.length).toBeGreaterThan(0);
    const hashtagsLinks = screen.getAllByRole('link', { name: /Hashtags/i });
    expect(hashtagsLinks.length).toBeGreaterThan(0);
  });

  it('should render draft badge when drafts exist', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={5} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const badges = screen.getAllByText('5');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should not render draft badge when no drafts exist', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    // Should not have badge element
    const badgeElements = screen.queryAllByText('0');
    // Check none of them are badges in the nav
    badgeElements.forEach(el => {
      expect(el).not.toHaveClass('bg-[#25f4ee]');
    });
  });

  it('should highlight active route - dashboard', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const dashboardLinks = screen.getAllByRole('link', { name: /Dashboard/i });
    // Check if any dashboard link has text-white class (desktop nav) or is in active gradient container
    const hasActiveLink = dashboardLinks.some(link => 
      link.className.includes('text-white') || 
      (link.className.includes('bg-gradient-to-r') && link.className.includes('from-[#fe2c55]'))
    );
    expect(hasActiveLink).toBe(true);
  });

  it('should highlight active route - new video', () => {
    vi.mocked(usePathname).mockReturnValue('/videos/new');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const newVideoLinks = screen.getAllByRole('link', { name: /New Video/i });
    const desktopLink = newVideoLinks[0];
    expect(desktopLink.className).toContain('text-white');
  });

  it('should highlight active route - drafts', () => {
    vi.mocked(usePathname).mockReturnValue('/drafts');

    render(<NavigationClient draftCount={3} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const draftsLinks = screen.getAllByRole('link', { name: /drafts/i });
    const desktopLink = draftsLinks[0];
    expect(desktopLink.className).toContain('text-white');
  });

  it('should highlight active route - hashtags', () => {
    vi.mocked(usePathname).mockReturnValue('/hashtags');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const hashtagsLinks = screen.getAllByRole('link', { name: /Hashtags/i });
    const desktopLink = hashtagsLinks[0];
    expect(desktopLink.className).toContain('text-white');
  });

  it('should highlight when on nested route under /videos', () => {
    vi.mocked(usePathname).mockReturnValue('/videos/new/step2');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const newVideoLinks = screen.getAllByRole('link', { name: /New Video/i });
    const desktopLink = newVideoLinks[0];
    // /videos/new/step2 starts with /videos/new so it should be active
    expect(desktopLink.className).toContain('text-white');
  });

  it('should not highlight inactive routes', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const hashtagsLinks = screen.getAllByRole('link', { name: /Hashtags/i });
    const desktopLink = hashtagsLinks[0];
    // Inactive links should have text-gray-600 not gradient
    expect(desktopLink.className).not.toContain('from-[#fe2c55]');
    expect(desktopLink.className).toContain('text-gray-600');
  });

  it('should render TikTrack logo as link to dashboard', () => {
    vi.mocked(usePathname).mockReturnValue('/hashtags');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const logo = screen.getByAltText('TikTrack Logo');
    const logoLink = logo.closest('a');
    expect(logoLink).toHaveAttribute('href', '/dashboard');
  });

  it('should have correct href attributes', () => {
    vi.mocked(usePathname).mockReturnValue('/');

    render(<NavigationClient draftCount={0} notifications={mockNotifications} channels={mockChannels} currentChannelId={mockCurrentChannelId} />);

    const dashboardLinks = screen.getAllByRole('link', { name: /Dashboard/i });
    expect(dashboardLinks[0]).toHaveAttribute('href', '/dashboard');
    const newVideoLinks = screen.getAllByRole('link', { name: /New Video/i });
    expect(newVideoLinks[0]).toHaveAttribute('href', '/videos/new');
    const draftsLinks = screen.getAllByRole('link', { name: /Drafts/i });
    expect(draftsLinks[0]).toHaveAttribute('href', '/drafts');
    const hashtagsLinks = screen.getAllByRole('link', { name: /Hashtags/i });
    expect(hashtagsLinks[0]).toHaveAttribute('href', '/hashtags');
  });
});
