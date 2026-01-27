import { describe, it, expect } from 'vitest';
import { hashtagSchema, hashtagArraySchema } from './hashtag';

describe('Hashtag Schemas', () => {
  describe('hashtagSchema', () => {
    it('should validate a valid hashtag', () => {
      const result = hashtagSchema.parse('fyp');

      expect(result).toBe('fyp');
    });

    it('should convert to lowercase', () => {
      const result = hashtagSchema.parse('FYP');

      expect(result).toBe('fyp');
    });

    it('should trim whitespace', () => {
      const result = hashtagSchema.parse('  fyp  ');

      expect(result).toBe('fyp');
    });

    it('should allow numbers', () => {
      const result = hashtagSchema.parse('fyp2024');

      expect(result).toBe('fyp2024');
    });

    it('should allow underscores', () => {
      const result = hashtagSchema.parse('for_you_page');

      expect(result).toBe('for_you_page');
    });

    it('should reject empty hashtag', () => {
      expect(() => hashtagSchema.parse('')).toThrow('Hashtag cannot be empty');
    });

    it('should reject hashtag with spaces', () => {
      expect(() => hashtagSchema.parse('for you')).toThrow(
        'Hashtag can only contain lowercase letters, numbers, and underscores'
      );
    });

    it('should reject hashtag with special characters', () => {
      expect(() => hashtagSchema.parse('fyp!')).toThrow(
        'Hashtag can only contain lowercase letters, numbers, and underscores'
      );
    });

    it('should reject hashtag with # symbol', () => {
      expect(() => hashtagSchema.parse('#fyp')).toThrow(
        'Hashtag can only contain lowercase letters, numbers, and underscores'
      );
    });

    it('should reject hashtag longer than 50 characters', () => {
      const longHashtag = 'a'.repeat(51);

      expect(() => hashtagSchema.parse(longHashtag)).toThrow(
        'Hashtag must be less than 50 characters'
      );
    });

    it('should accept hashtag with exactly 50 characters', () => {
      const hashtag = 'a'.repeat(50);

      const result = hashtagSchema.parse(hashtag);

      expect(result).toBe(hashtag);
    });
  });

  describe('hashtagArraySchema', () => {
    it('should validate an array of hashtags', () => {
      const input = ['fyp', 'viral', 'comedy'];

      const result = hashtagArraySchema.parse(input);

      expect(result).toEqual(['fyp', 'viral', 'comedy']);
    });

    it('should validate empty array', () => {
      const result = hashtagArraySchema.parse([]);

      expect(result).toEqual([]);
    });

    it('should convert all hashtags to lowercase', () => {
      const input = ['FYP', 'ViRaL', 'COMEDY'];

      const result = hashtagArraySchema.parse(input);

      expect(result).toEqual(['fyp', 'viral', 'comedy']);
    });

    it('should reject array with more than 30 hashtags', () => {
      const input = Array(31).fill('hashtag');

      expect(() => hashtagArraySchema.parse(input)).toThrow('Maximum 30 hashtags allowed');
    });

    it('should reject array with invalid hashtags', () => {
      const input = ['fyp', 'invalid hashtag', 'comedy'];

      expect(() => hashtagArraySchema.parse(input)).toThrow(
        'Hashtag can only contain lowercase letters, numbers, and underscores'
      );
    });

    it('should accept array with exactly 30 hashtags', () => {
      const input = Array(30)
        .fill(0)
        .map((_, i) => `hashtag${i}`);

      const result = hashtagArraySchema.parse(input);

      expect(result).toHaveLength(30);
    });
  });
});
