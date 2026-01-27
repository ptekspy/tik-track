import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashtagActions } from './HashtagActions';
import { mockHashtag1, mockHashtag2, mockHashtag3 } from '@/lib/testing/mocks';

describe('HashtagActions', () => {
  it('should render merge form', () => {
    render(<HashtagActions hashtags={[mockHashtag1]} />);

    expect(screen.getByRole('heading', { name: /merge hashtags/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/source tag/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target tag/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /merge hashtags/i })).toBeInTheDocument();
  });

  it('should render all hashtags in source tag dropdown', () => {
    render(<HashtagActions hashtags={[mockHashtag1, mockHashtag2, mockHashtag3]} />);

    const sourceSelect = screen.getByLabelText(/source tag/i);
    expect(sourceSelect).toBeInTheDocument();

    // Check options - mockHashtag1=productivity, mockHashtag2=tips, mockHashtag3=tiktok
    expect(screen.getByRole('option', { name: '#productivity' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '#tips' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '#tiktok' })).toBeInTheDocument();
  });

  it('should have merge button disabled when no tags selected', () => {
    render(<HashtagActions hashtags={[mockHashtag1]} />);

    const button = screen.getByRole('button', { name: /merge hashtags/i });
    expect(button).toBeDisabled();
  });

  it('should call onMerge with correct tags when form is submitted', async () => {
    const user = userEvent.setup();
    const onMerge = vi.fn<(sourceTag: string, targetTag: string) => Promise<void>>().mockResolvedValue(undefined);

    render(<HashtagActions hashtags={[mockHashtag1, mockHashtag2]} onMerge={onMerge} />);

    // Select source tag
    await user.selectOptions(screen.getByLabelText(/source tag/i), 'productivity');

    // Enter target tag
    await user.type(screen.getByLabelText(/target tag/i), 'tips');

    // Submit form
    await user.click(screen.getByRole('button', { name: /merge hashtags/i }));

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledWith('productivity', 'tips');
    });
  });

  it('should display success message after successful merge', async () => {
    const user = userEvent.setup();
    const onMerge = vi.fn<(sourceTag: string, targetTag: string) => Promise<void>>().mockResolvedValue(undefined);

    render(<HashtagActions hashtags={[mockHashtag1]} onMerge={onMerge} />);

    await user.selectOptions(screen.getByLabelText(/source tag/i), 'productivity');
    await user.type(screen.getByLabelText(/target tag/i), 'tips');
    await user.click(screen.getByRole('button', { name: /merge hashtags/i }));

    await waitFor(() => {
      expect(screen.getByText(/successfully merged #productivity into #tips/i)).toBeInTheDocument();
    });
  });

  it('should display error message when merge fails', async () => {
    const user = userEvent.setup();
    const onMerge = vi.fn().mockRejectedValue(new Error('Database error'));

    render(<HashtagActions hashtags={[mockHashtag1]} onMerge={onMerge} />);

    await user.selectOptions(screen.getByLabelText(/source tag/i), 'productivity');
    await user.type(screen.getByLabelText(/target tag/i), 'tips');
    await user.click(screen.getByRole('button', { name: /merge hashtags/i }));

    await waitFor(() => {
      expect(screen.getByText(/database error/i)).toBeInTheDocument();
    });
  });

  it('should show error when source and target are the same', async () => {
    const user = userEvent.setup();
    const onMerge = vi.fn();

    render(<HashtagActions hashtags={[mockHashtag1]} onMerge={onMerge} />);

    await user.selectOptions(screen.getByLabelText(/source tag/i), 'productivity');
    await user.type(screen.getByLabelText(/target tag/i), 'productivity');
    await user.click(screen.getByRole('button', { name: /merge hashtags/i }));

    await waitFor(() => {
      expect(screen.getByText(/source and target tags must be different/i)).toBeInTheDocument();
    });

    expect(onMerge).not.toHaveBeenCalled();
  });

  it('should show error when required fields are empty', async () => {
    const user = userEvent.setup();
    const onMerge = vi.fn();

    render(<HashtagActions hashtags={[mockHashtag1]} onMerge={onMerge} />);

    await user.selectOptions(screen.getByLabelText(/source tag/i), 'productivity');
    // Don't fill target tag
    await user.click(screen.getByRole('button', { name: /merge hashtags/i }));

    // Button should still be disabled
    expect(onMerge).not.toHaveBeenCalled();
  });

  it('should convert target tag to lowercase', async () => {
    const user = userEvent.setup();
    const onMerge = vi.fn<(sourceTag: string, targetTag: string) => Promise<void>>().mockResolvedValue(undefined);

    render(<HashtagActions hashtags={[mockHashtag1]} onMerge={onMerge} />);

    await user.selectOptions(screen.getByLabelText(/source tag/i), 'productivity');
    await user.type(screen.getByLabelText(/target tag/i), 'UPPERCASE');
    await user.click(screen.getByRole('button', { name: /merge hashtags/i }));

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledWith('productivity', 'uppercase');
    });
  });

  it('should clear form after successful merge', async () => {
    const user = userEvent.setup();
    const onMerge = vi.fn<(sourceTag: string, targetTag: string) => Promise<void>>().mockResolvedValue(undefined);

    render(<HashtagActions hashtags={[mockHashtag1]} onMerge={onMerge} />);

    await user.selectOptions(screen.getByLabelText(/source tag/i), 'productivity');
    await user.type(screen.getByLabelText(/target tag/i), 'tips');
    await user.click(screen.getByRole('button', { name: /merge hashtags/i }));

    await waitFor(() => {
      const sourceSelect = screen.getByLabelText(/source tag/i) as HTMLSelectElement;
      const targetInput = screen.getByLabelText(/target tag/i) as HTMLInputElement;
      
      expect(sourceSelect.value).toBe('');
      expect(targetInput.value).toBe('');
    });
  });

  it('should disable form during submission', async () => {
    const user = userEvent.setup();
    const onMerge = vi.fn<(sourceTag: string, targetTag: string) => Promise<void>>(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<HashtagActions hashtags={[mockHashtag1]} onMerge={onMerge} />);

    await user.selectOptions(screen.getByLabelText(/source tag/i), 'productivity');
    await user.type(screen.getByLabelText(/target tag/i), 'tips');
    await user.click(screen.getByRole('button', { name: /merge hashtags/i }));

    // Check button shows loading state
    expect(screen.getByRole('button', { name: /merging/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /merging/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /merge hashtags/i })).toBeInTheDocument();
    });
  });

  it('should render instructions about how merging works', () => {
    render(<HashtagActions hashtags={[mockHashtag1]} />);

    expect(screen.getByText(/how merging works/i)).toBeInTheDocument();
    expect(screen.getByText(/all videos tagged with the source tag/i)).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
  });
});
