import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';
import * as videosDAL from '@/lib/dal/videos';
import { mockVideoDraft } from '@/lib/testing/mocks';

// Mock the videos DAL
vi.mock('@/lib/dal/videos', () => ({
  findVideosByStatus: vi.fn(),
}));

// Mock the client component
vi.mock('./NavigationClient', () => ({
  NavigationClient: ({ draftCount }: { draftCount: number }) => (
    <div data-testid="navigation-client" data-draft-count={draftCount}>
      Navigation Client (Draft Count: {draftCount})
    </div>
  ),
}));

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch draft count and render NavigationClient', async () => {
    vi.spyOn(videosDAL, 'findVideosByStatus').mockResolvedValue([mockVideoDraft]);

    const component = await Navigation();
    const { container } = render(component);

    expect(videosDAL.findVideosByStatus).toHaveBeenCalledWith('DRAFT');
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
