import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnapshotType } from '@/lib/generated/client';
import { SnapshotForm, type SnapshotFormData } from './SnapshotForm';

describe('SnapshotForm', () => {
  const mockVideoId = 'video-123';
  const availableTypes = [
    SnapshotType.ONE_HOUR,
    SnapshotType.THREE_HOUR,
    SnapshotType.SIX_HOUR,
  ];

  it('should render all analytics fields', () => {
    const onSubmit = vi.fn();
    render(<SnapshotForm videoId={mockVideoId} availableTypes={availableTypes} onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/snapshot type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^views/i)).toBeInTheDocument();
    expect(screen.getByText(/total play time/i)).toBeInTheDocument();
    expect(screen.getByText(/avg watch time/i)).toBeInTheDocument();
    expect(screen.getByText(/completion rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^likes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^comments/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^shares/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^favorites/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new followers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile views/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reach/i)).toBeInTheDocument();
  });

  it('should populate snapshot type dropdown with available types', () => {
    const onSubmit = vi.fn();
    render(<SnapshotForm videoId={mockVideoId} availableTypes={availableTypes} onSubmit={onSubmit} />);

    const typeSelect = screen.getByLabelText(/snapshot type/i);
    const options = Array.from(typeSelect.querySelectorAll('option'));

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('1 Hour');
    expect(options[1]).toHaveTextContent('3 Hours');
    expect(options[2]).toHaveTextContent('6 Hours');
  });

  it('should populate form with default values', () => {
    const onSubmit = vi.fn();
    const defaultValues: Partial<SnapshotFormData> = {
      snapshotType: SnapshotType.THREE_HOUR,
      views: 5000,
      likes: 250,
    };

    render(
      <SnapshotForm
        videoId={mockVideoId}
        availableTypes={availableTypes}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByLabelText(/snapshot type/i)).toHaveValue(SnapshotType.THREE_HOUR);
    expect(screen.getByLabelText(/^views/i)).toHaveValue(5000);
    expect(screen.getByLabelText(/^likes/i)).toHaveValue(250);
  });

  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<SnapshotForm videoId={mockVideoId} availableTypes={availableTypes} onSubmit={onSubmit} />);

    // Select snapshot type
    const typeSelect = screen.getByLabelText(/snapshot type/i);
    await user.selectOptions(typeSelect, SnapshotType.THREE_HOUR);

    // Fill views
    const viewsInput = screen.getByLabelText(/^views/i);
    await user.clear(viewsInput);
    await user.type(viewsInput, '10000');

    // Fill likes
    const likesInput = screen.getByLabelText(/^likes/i);
    await user.clear(likesInput);
    await user.type(likesInput, '500');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save snapshot/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          snapshotType: SnapshotType.THREE_HOUR,
          views: 10000,
          likes: 500,
        })
      );
    });
  });

  it('should display delta from previous snapshot', () => {
    const onSubmit = vi.fn();
    const previousSnapshot: SnapshotFormData = {
      snapshotType: SnapshotType.ONE_HOUR,
      views: 5000,
      likes: 200,
      comments: 50,
      shares: 30,
      favorites: 40,
      totalPlayTimeSeconds: 10000,
      avgWatchTimeSeconds: 20,
    };

    const defaultValues: Partial<SnapshotFormData> = {
      views: 7500,
      likes: 350,
      comments: 50,
      shares: 25,
      favorites: 60,
      totalPlayTimeSeconds: 15000,
      avgWatchTimeSeconds: 22,
    };

    render(
      <SnapshotForm
        videoId={mockVideoId}
        availableTypes={availableTypes}
        defaultValues={defaultValues}
        previousSnapshot={previousSnapshot}
        onSubmit={onSubmit}
      />
    );

    // Views delta: 7500 - 5000 = +2500
    const viewsLabel = screen.getByLabelText(/^views/i).parentElement;
    expect(viewsLabel).toHaveTextContent('(+2,500)');

    // Likes delta: 350 - 200 = +150
    const likesLabel = screen.getByLabelText(/^likes/i).parentElement;
    expect(likesLabel).toHaveTextContent('(+150)');

    // Comments delta: 50 - 50 = 0
    const commentsLabel = screen.getByLabelText(/^comments/i).parentElement;
    expect(commentsLabel).toHaveTextContent('(0)');

    // Shares delta: 25 - 30 = -5
    const sharesLabel = screen.getByLabelText(/^shares/i).parentElement;
    expect(sharesLabel).toHaveTextContent('(-5)');
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <SnapshotForm
        videoId={mockVideoId}
        availableTypes={availableTypes}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should disable form while submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(data: SnapshotFormData) => Promise<void>>(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<SnapshotForm videoId={mockVideoId} availableTypes={availableTypes} onSubmit={onSubmit} />);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save snapshot/i });
    await user.click(submitButton);

    // Button should be disabled and show "Saving..."
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/saving/i);

    // Inputs should be disabled
    expect(screen.getByLabelText(/snapshot type/i)).toBeDisabled();
    expect(screen.getByLabelText(/^views/i)).toBeDisabled();
  });

  it('should display error message when submission fails', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error('Submission failed'));

    render(<SnapshotForm videoId={mockVideoId} availableTypes={availableTypes} onSubmit={onSubmit} />);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save snapshot/i });
    await user.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });
  });

  it('should handle time inputs via TimeInput component', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<SnapshotForm videoId={mockVideoId} availableTypes={availableTypes} onSubmit={onSubmit} />);

    // Total Play Time section has TimeInput (hours, minutes, seconds)
    // Get all Hours inputs (one for Total Play Time, one for Avg Watch Time)
    const hoursInputs = screen.getAllByLabelText('Hours');
    const totalPlayTimeHoursInput = hoursInputs[0]; // First one is Total Play Time

    await user.clear(totalPlayTimeHoursInput);
    await user.type(totalPlayTimeHoursInput, '2');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save snapshot/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          totalPlayTimeSeconds: 7200, // 2 hours = 7200 seconds
        })
      );
    });
  });

  it('should use first available type as default', () => {
    const onSubmit = vi.fn();
    render(<SnapshotForm videoId={mockVideoId} availableTypes={availableTypes} onSubmit={onSubmit} />);

    const typeSelect = screen.getByLabelText(/snapshot type/i);
    expect(typeSelect).toHaveValue(SnapshotType.ONE_HOUR);
  });
});
