import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashtagInput } from './HashtagInput';

describe('HashtagInput', () => {
  it('should render empty input', () => {
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    expect(input).toBeInTheDocument();
  });

  it('should display existing tags', () => {
    const onChange = vi.fn();
    render(<HashtagInput value={['productivity', 'tips']} onChange={onChange} />);

    expect(screen.getByText('#productivity')).toBeInTheDocument();
    expect(screen.getByText('#tips')).toBeInTheDocument();
  });

  it('should add tag on Enter key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, 'newtag{Enter}');

    expect(onChange).toHaveBeenCalledWith(['newtag']);
  });

  it('should add tag on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, 'newtag');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith(['newtag']);
  });

  it('should convert tags to lowercase', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, 'UPPERCASE{Enter}');

    expect(onChange).toHaveBeenCalledWith(['uppercase']);
  });

  it('should trim whitespace from tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, '  spaces  {Enter}');

    expect(onChange).toHaveBeenCalledWith(['spaces']);
  });

  it('should remove leading # from tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, '#hashtag{Enter}');

    expect(onChange).toHaveBeenCalledWith(['hashtag']);
  });

  it('should not add duplicate tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={['existing']} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, 'existing{Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not add empty tags', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, '   {Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should remove tag when X button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={['tag1', 'tag2']} onChange={onChange} />);

    const removeButton = screen.getByLabelText('Remove tag1');
    await user.click(removeButton);

    expect(onChange).toHaveBeenCalledWith(['tag2']);
  });

  it('should remove last tag on Backspace when input is empty', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={['tag1', 'tag2']} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.click(input);
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenCalledWith(['tag1']);
  });

  it('should not remove tag on Backspace when input has value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={['tag1']} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, 'text{Backspace}');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should respect maxTags limit', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={['tag1', 'tag2']} onChange={onChange} maxTags={2} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, 'tag3{Enter}');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should display tag count when maxTags is set', () => {
    const onChange = vi.fn();
    render(<HashtagInput value={['tag1']} onChange={onChange} maxTags={5} />);

    expect(screen.getByText('1 / 5 tags')).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    const onChange = vi.fn();
    render(<HashtagInput value={['tag1']} onChange={onChange} disabled />);

    const input = screen.getByLabelText('Hashtag input');
    expect(input).toBeDisabled();

    // Remove button should not be present when disabled
    expect(screen.queryByLabelText('Remove tag1')).not.toBeInTheDocument();
  });

  it('should clear input after adding tag', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} />);

    const input = screen.getByLabelText('Hashtag input');
    await user.type(input, 'newtag{Enter}');

    expect(input).toHaveValue('');
  });

  it('should apply custom className', () => {
    const onChange = vi.fn();
    const { container } = render(<HashtagInput value={[]} onChange={onChange} className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should use custom placeholder', () => {
    const onChange = vi.fn();
    render(<HashtagInput value={[]} onChange={onChange} placeholder="Custom placeholder" />);

    const input = screen.getByLabelText('Hashtag input');
    expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
  });
});
