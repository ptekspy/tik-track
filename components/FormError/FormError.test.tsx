import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormError } from './FormError';

describe('FormError', () => {
  it('should render nothing when error is undefined', () => {
    const { container } = render(<FormError />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when error is empty string', () => {
    const { container } = render(<FormError error="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when error is empty array', () => {
    const { container } = render(<FormError error={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render single error as paragraph', () => {
    render(<FormError error="This is an error" />);
    
    const errorText = screen.getByText('This is an error');
    expect(errorText.tagName).toBe('P');
  });

  it('should render single error from array as paragraph', () => {
    render(<FormError error={['Single error in array']} />);
    
    const errorText = screen.getByText('Single error in array');
    expect(errorText.tagName).toBe('P');
  });

  it('should render multiple errors as list', () => {
    render(<FormError error={['Error 1', 'Error 2', 'Error 3']} />);
    
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
    expect(screen.getByText('Error 3')).toBeInTheDocument();
    
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(3);
  });

  it('should have role="alert" for accessibility', () => {
    render(<FormError error="Error message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should apply red text styling', () => {
    render(<FormError error="Error message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('text-red-600');
  });

  it('should apply custom className', () => {
    render(<FormError error="Error message" className="custom-class" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });
});
