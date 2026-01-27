import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoStatus } from '@/lib/generated/client';
import { VideoForm, type VideoFormData } from './VideoForm';

describe('VideoForm', () => {
  it('should render all required fields', () => {
    const onSubmit = vi.fn();
    render(<VideoForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Script *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
    expect(screen.getByText('Video Length *')).toBeInTheDocument(); // Label exists, but not connected to input
    expect(screen.getByLabelText('Status *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save video/i })).toBeInTheDocument();
  });

  it('should populate form with default values', () => {
    const onSubmit = vi.fn();
    const defaultValues: Partial<VideoFormData> = {
      title: 'Test Video',
      script: 'Test script',
      description: 'Test description',
      status: VideoStatus.DRAFT,
    };

    render(<VideoForm onSubmit={onSubmit} defaultValues={defaultValues} />);

    expect(screen.getByLabelText('Title *')).toHaveValue('Test Video');
    expect(screen.getByLabelText('Script *')).toHaveValue('Test script');
    expect(screen.getByLabelText('Description *')).toHaveValue('Test description');
    expect(screen.getByLabelText('Status *')).toHaveValue(VideoStatus.DRAFT);
  });

  it('should show post date field when status is PUBLISHED', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<VideoForm onSubmit={onSubmit} />);

    // Initially should not show post date (status=DRAFT)
    expect(screen.queryByLabelText('Post Date *')).not.toBeInTheDocument();

    // Change to PUBLISHED
    const statusSelect = screen.getByLabelText('Status *');
    await user.selectOptions(statusSelect, VideoStatus.PUBLISHED);

    // Should now show post date
    expect(screen.getByLabelText('Post Date *')).toBeInTheDocument();
  });

  it('should show analytics section when status is PUBLISHED', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<VideoForm onSubmit={onSubmit} />);

    // Initially should not show analytics section
    expect(screen.queryByText(/initial analytics/i)).not.toBeInTheDocument();

    // Change to PUBLISHED
    const statusSelect = screen.getByLabelText('Status *');
    await user.selectOptions(statusSelect, VideoStatus.PUBLISHED);

    // Should now show analytics section
    expect(screen.getByText(/initial analytics/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Views')).toBeInTheDocument();
    expect(screen.getByLabelText('Likes')).toBeInTheDocument();
  });

  it('should require title, script, and description', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<VideoForm onSubmit={onSubmit} />);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /save video/i });
    await user.click(submitButton);

    // Should not call onSubmit
    expect(onSubmit).not.toHaveBeenCalled();

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/script is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it('should require post date when status is PUBLISHED', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<VideoForm onSubmit={onSubmit} />);

    // Fill required fields
    await user.type(screen.getByLabelText('Title *'), 'Test Video');
    await user.type(screen.getByLabelText('Script *'), 'Test script');
    await user.type(screen.getByLabelText('Description *'), 'Test description');

    // Change to PUBLISHED
    const statusSelect = screen.getByLabelText('Status *');
    await user.selectOptions(statusSelect, VideoStatus.PUBLISHED);

    // Try to submit without post date
    const submitButton = screen.getByRole('button', { name: /save video/i });
    await user.click(submitButton);

    // Should not call onSubmit
    expect(onSubmit).not.toHaveBeenCalled();

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/post date is required/i)).toBeInTheDocument();
    });
  });

  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<VideoForm onSubmit={onSubmit} />);

    // Fill required fields
    await user.type(screen.getByLabelText(/^title/i), 'Test Video');
    await user.type(screen.getByLabelText(/^script \*/i), 'Test script');
    await user.type(screen.getByLabelText(/^description/i), 'Test description');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save video/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Video',
          script: 'Test script',
          description: 'Test description',
          status: VideoStatus.DRAFT,
        })
      );
    });
  });

  it('should submit with first snapshot data when provided', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<VideoForm onSubmit={onSubmit} />);

    // Fill required fields
    await user.type(screen.getByLabelText('Title *'), 'Test Video');
    await user.type(screen.getByLabelText('Script *'), 'Test script');
    await user.type(screen.getByLabelText('Description *'), 'Test description');

    // Change to PUBLISHED
    const statusSelect = screen.getByLabelText('Status *');
    await user.selectOptions(statusSelect, VideoStatus.PUBLISHED);

    // Fill post date
    const postDateInput = screen.getByLabelText('Post Date *');
    await user.type(postDateInput, '2026-01-27T12:00');

    // Fill some analytics
    const viewsInput = screen.getByLabelText('Views');
    await user.clear(viewsInput);
    await user.type(viewsInput, '1000');

    const likesInput = screen.getByLabelText('Likes');
    await user.clear(likesInput);
    await user.type(likesInput, '50');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save video/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Video',
          status: VideoStatus.PUBLISHED,
          postDate: '2026-01-27T12:00',
          firstSnapshot: expect.objectContaining({
            views: 1000,
            likes: 50,
          }),
        })
      );
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<VideoForm onSubmit={onSubmit} onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should disable form while submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<VideoForm onSubmit={onSubmit} />);

    // Fill required fields
    await user.type(screen.getByLabelText(/^title/i), 'Test Video');
    await user.type(screen.getByLabelText(/^script \*/i), 'Test script');
    await user.type(screen.getByLabelText(/^description/i), 'Test description');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save video/i });
    await user.click(submitButton);

    // Button should be disabled and show "Saving..."
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/saving/i);

    // Inputs should be disabled
    expect(screen.getByLabelText('Title *')).toBeDisabled();
    expect(screen.getByLabelText('Script *')).toBeDisabled();
  });

  it('should display error message when submission fails', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error('Submission failed'));

    render(<VideoForm onSubmit={onSubmit} />);

    // Fill required fields
    await user.type(screen.getByLabelText(/^title/i), 'Test Video');
    await user.type(screen.getByLabelText(/^script \*/i), 'Test script');
    await user.type(screen.getByLabelText(/^description/i), 'Test description');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save video/i });
    await user.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });
  });

  it('should handle hashtag input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<VideoForm onSubmit={onSubmit} />);

    // Fill required fields
    await user.type(screen.getByLabelText('Title *'), 'Test Video');
    await user.type(screen.getByLabelText('Script *'), 'Test script');
    await user.type(screen.getByLabelText('Description *'), 'Test description');

    // Add hashtags (HashtagInput is tested separately, just verify integration)
    const hashtagInput = screen.getByPlaceholderText(/add hashtag/i);
    await user.type(hashtagInput, 'fyp{Enter}');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save video/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          hashtags: ['fyp'],
        })
      );
    });
  });
});
