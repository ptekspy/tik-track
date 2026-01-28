import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';
import * as videosDAL from '@/lib/dal/videos';
import { mockVideoDraft, mockUser } from '@/lib/testing/mocks';

// Mock the auth
vi.mock('@/lib/auth/server', () => ({
  getUser: vi.fn(),
}));

// Mock the videos DAL
vi.mock('@/lib/dal/videos', () => ({
  findVideosByStatus: vi.fn(),
}));

// Mock the channels DAL
vi.mock('@/lib/dal/channels', () => ({
  findAllChannels: vi.fn(),
  findDefaultChannel: vi.fn(),
}));

// Mock the notifications
vi.mock('@/lib/notifications/getNotifications', () => ({
  getNotifications: vi.fn(),
}));

// Mock the client component
vi.mock('./NavigationClient', () => ({
  NavigationClient: ({ draftCount, channels, currentChannelId }: any) => (
    <div 
      data-testid="navigation-client" 
      data-draft-count={draftCount}
      data-channel-count={channels?.length || 0}
      data-current-channel-id={currentChannelId}
    >
      Navigation Client (Draft Count: {draftCount})
    </div>
  ),
}));

import { getUser } from '@/lib/auth/server';
import { getNotifications } from '@/lib/notifications/getNotifications';
import { findAllChannels, findDefaultChannel } from '@/lib/dal/channels';
import { MOCK_CHANNEL_ID } from '@/lib/testing/mocks';

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUser).mockResolvedValue(mockUser);
    vi.mocked(getNotifications).mockResolvedValue([]);
    vi.mocked(findAllChannels).mockResolvedValue([{
      id: MOCK_CHANNEL_ID,
      userId: mockUser.id,
      name: 'Main Channel',
      handle: 'mainhandle',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
    vi.mocked(findDefaultChannel).mockResolvedValue({
      id: MOCK_CHANNEL_ID,
      userId: mockUser.id,
      name: 'Main Channel',
      handle: 'mainhandle',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should fetch draft count and render NavigationClient', async () => {
    vi.spyOn(videosDAL, 'findVideosByStatus').mockResolvedValue([mockVideoDraft]);

    const component = await Navigation();
    const { container } = render(component);

    expect(videosDAL.findVideosByStatus).toHaveBeenCalledWith('DRAFT', mockUser.id);
    expect(container.querySelector('[data-testid="navigation-client"]')).toHaveAttribute(
      'data-draft-count',
      '1'
    );
  });

  it('should pass zero draft count when no drafts exist', async () => {
    vi.spyOn(videosDAL, 'findVideosByStatus').mockResolvedValue([]);

    const component = await Navigation();
    const { container } = render(component);

    expect(container.querySelector('[data-testid="navigation-client"]')).toHaveAttribute(
      'data-draft-count',
      '0'
    );
  });

  it('should pass correct draft count for multiple drafts', async () => {
    vi.spyOn(videosDAL, 'findVideosByStatus').mockResolvedValue([
      mockVideoDraft,
      { ...mockVideoDraft, id: 'draft-2' },
      { ...mockVideoDraft, id: 'draft-3' },
    ]);

    const component = await Navigation();
    const { container } = render(component);

    expect(container.querySelector('[data-testid="navigation-client"]')).toHaveAttribute(
      'data-draft-count',
      '3'
    );
  });
});
