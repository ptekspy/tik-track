import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeInput } from './TimeInput';

describe('TimeInput', () => {
  it('should render with default value of 0 seconds', () => {
    const onChange = vi.fn();
    render(<TimeInput onChange={onChange} />);

    const hoursInput = screen.getByLabelText('Hours');
    const minutesInput = screen.getByLabelText('Minutes');
    const secondsInput = screen.getByLabelText('Seconds');

    expect(hoursInput).toHaveValue(0);
    expect(minutesInput).toHaveValue(0);
    expect(secondsInput).toHaveValue(0);
  });

  it('should convert value prop to hours, minutes, seconds', () => {
    const onChange = vi.fn();
    // 3665 seconds = 1h 1m 5s
    render(<TimeInput value={3665} onChange={onChange} />);

    expect(screen.getByLabelText('Hours')).toHaveValue(1);
    expect(screen.getByLabelText('Minutes')).toHaveValue(1);
    expect(screen.getByLabelText('Seconds')).toHaveValue(5);
  });

  it('should call onChange with total seconds when hours change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimeInput value={0} onChange={onChange} />);

    const hoursInput = screen.getByLabelText('Hours');
    await user.clear(hoursInput);
    await user.type(hoursInput, '2');

    expect(onChange).toHaveBeenCalledWith(7200); // 2 hours = 7200 seconds
  });

  it('should call onChange with total seconds when minutes change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimeInput value={3600} onChange={onChange} />); // 1 hour

    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '30');

    expect(onChange).toHaveBeenCalledWith(5400); // 1h 30m = 5400 seconds
  });

  it('should call onChange with total seconds when seconds change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimeInput value={3600} onChange={onChange} />); // 1 hour

    const secondsInput = screen.getByLabelText('Seconds');
    await user.clear(secondsInput);
    await user.type(secondsInput, '45');

    expect(onChange).toHaveBeenCalledWith(3645); // 1h 0m 45s = 3645 seconds
  });

  it('should enforce maximum of 59 for minutes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimeInput onChange={onChange} />);

    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '99');

    // Should be clamped to 59
    expect(onChange).toHaveBeenCalledWith(59 * 60); // 59 minutes
  });

  it('should enforce maximum of 59 for seconds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimeInput onChange={onChange} />);

    const secondsInput = screen.getByLabelText('Seconds');
    await user.clear(secondsInput);
    await user.type(secondsInput, '99');

    // Should be clamped to 59
    expect(onChange).toHaveBeenCalledWith(59); // 59 seconds
  });

  it('should handle disabled state', () => {
    const onChange = vi.fn();
    render(<TimeInput onChange={onChange} disabled />);

    const hoursInput = screen.getByLabelText('Hours');
    const minutesInput = screen.getByLabelText('Minutes');
    const secondsInput = screen.getByLabelText('Seconds');

    expect(hoursInput).toBeDisabled();
    expect(minutesInput).toBeDisabled();
    expect(secondsInput).toBeDisabled();
  });

  it('should update display when value prop changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(<TimeInput value={3600} onChange={onChange} />);

    expect(screen.getByLabelText('Hours')).toHaveValue(1);
    expect(screen.getByLabelText('Minutes')).toHaveValue(0);
    expect(screen.getByLabelText('Seconds')).toHaveValue(0);

    // Change value to 7265 seconds (2h 1m 5s)
    rerender(<TimeInput value={7265} onChange={onChange} />);

    expect(screen.getByLabelText('Hours')).toHaveValue(2);
    expect(screen.getByLabelText('Minutes')).toHaveValue(1);
    expect(screen.getByLabelText('Seconds')).toHaveValue(5);
  });

  it('should apply custom className', () => {
    const onChange = vi.fn();
    const { container } = render(<TimeInput onChange={onChange} className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
