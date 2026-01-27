import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mergeHashtagsAction } from './actions';
import * as mergeHashtagsModule from '@/lib/services/mergeHashtags';
import { mockHashtag } from '@/lib/testing/mocks';

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Hashtag Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mergeHashtagsAction', () => {
    it('should merge hashtags successfully', async () => {
      const result = {
        targetHashtag: mockHashtag,
        movedVideos: 5,
      };

      vi.spyOn(mergeHashtagsModule, 'mergeHashtags').mockResolvedValue(result);

      const actionResult = await mergeHashtagsAction('oldtag', 'newtag');

      expect(actionResult.success).toBe(true);
      expect(actionResult.data).toEqual(result);
      expect(actionResult.error).toBeUndefined();
      expect(mergeHashtagsModule.mergeHashtags).toHaveBeenCalledWith('oldtag', 'newtag');
    });

    it('should handle source hashtag not found', async () => {
      const error = new Error('Source hashtag oldtag not found');
      vi.spyOn(mergeHashtagsModule, 'mergeHashtags').mockRejectedValue(error);

      const result = await mergeHashtagsAction('oldtag', 'newtag');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Source hashtag oldtag not found');
    });

    it('should handle same source and target', async () => {
      const error = new Error('Source and target hashtags must be different');
      vi.spyOn(mergeHashtagsModule, 'mergeHashtags').mockRejectedValue(error);

      const result = await mergeHashtagsAction('tag', 'tag');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Source and target hashtags must be different');
    });

    it('should handle target hashtag creation', async () => {
      const result = {
        targetHashtag: mockHashtag,
        movedVideos: 3,
      };

      vi.spyOn(mergeHashtagsModule, 'mergeHashtags').mockResolvedValue(result);

      const actionResult = await mergeHashtagsAction('oldtag', 'newuniquetag');

      expect(actionResult.success).toBe(true);
      expect(actionResult.data).toEqual(result);
    });

    it('should handle unknown errors', async () => {
      vi.spyOn(mergeHashtagsModule, 'mergeHashtags').mockRejectedValue('Unknown error');

      const result = await mergeHashtagsAction('oldtag', 'newtag');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to merge hashtags');
    });
  });
});
