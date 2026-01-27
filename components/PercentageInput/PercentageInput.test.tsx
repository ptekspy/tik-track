import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PercentageInput } from './PercentageInput';

describe('PercentageInput', () => {
  it('should render with default value of 0%', () => {
    const onChange = vi.fn();
    render(<PercentageInput onChange={onChange} />);

    const input = screen.getByLabelText('Percentage');
    expect(input).toHaveValue(0);
  });

  it('should convert decimal value to percentage display', () => {
    const onChange = vi.fn();
    render(<PercentageInput value={0.1055} onChange={onChange} />);

    const input = screen.getByLabelText('Percentage');
    expect(input).toHaveValue(10.55);
  });

  it('should call onChange with decimal value on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PercentageInput onChange={onChange} />);

    const input = screen.getByLabelText('Percentage');
    await user.clear(input);
    await user.type(input, '25.5');
    await user.tab(); // Trigger blur

    expect(onChange).toHaveBeenCalledWith(0.255);
  });

  it('should call onChange with decimal value on Enter key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PercentageInput onChange={onChange} />);

    const input = screen.getByLabelText('Percentage');
    await user.clear(input);
    await user.type(input, '50{Enter}');

    expect(onChange).toHaveBeenCalledWith(0.5);
  });

  it('should clamp value to max (100 by default)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PercentageInput onChange={onChange} />);

    const input = screen.getByLabelText('Percentage');
    await user.clear(input);
    await user.type(input, '150');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith(1); // 100% = 1.0
    expect(input).toHaveValue(100);
  });

  it('should clamp value to min (0 by default)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PercentageInput onChange={onChange} />);

    const input = screen.getByLabelText('Percentage');
    await user.clear(input);
    await user.type(input, '-10');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith(0);
    expect(input).toHaveValue(0);
  });

  it('should respect custom min and max', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PercentageInput onChange={onChange} min={10} max={90} />);

    const input = screen.getByLabelText('Percentage');
    
    // Test below min
    await user.clear(input);
    await user.type(input, '5');
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(0.1); // 10% = 0.1
    
    // Test above max
    await user.clear(input);
    await user.type(input, '95');
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(0.9); // 90% = 0.9
  });

  it('should handle disabled state', () => {
    const onChange = vi.fn();
    render(<PercentageInput onChange={onChange} disabled />);

    const input = screen.getByLabelText('Percentage');
    expect(input).toBeDisabled();
  });

  it('should update display when value prop changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(<PercentageInput value={0.25} onChange={onChange} />);

    expect(screen.getByLabelText('Percentage')).toHaveValue(25);

    rerender(<PercentageInput value={0.75} onChange={onChange} />);

    expect(screen.getByLabelText('Percentage')).toHaveValue(75);
  });

  it('should format value to 2 decimal places on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PercentageInput onChange={onChange} />);

    const input = screen.getByLabelText('Percentage');
    await user.clear(input);
    await user.type(input, '33.333333');
    await user.tab();

    expect(input).toHaveValue(33.33);
  });

  it('should handle empty input as 0', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PercentageInput value={0.5} onChange={onChange} />);

    const input = screen.getByLabelText('Percentage');
    await user.clear(input);
    await user.tab();

    expect(onChange).toHaveBeenCalledWith(0);
    expect(input).toHaveValue(0);
  });

  it('should apply custom className', () => {
    const onChange = vi.fn();
    const { container } = render(<PercentageInput onChange={onChange} className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
