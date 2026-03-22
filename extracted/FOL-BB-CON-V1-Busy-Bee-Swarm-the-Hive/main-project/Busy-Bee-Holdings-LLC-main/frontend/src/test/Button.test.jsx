import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button').className).toContain('h-8');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button').className).toContain('h-10');

    rerender(<Button size="icon">Icon</Button>);
    // Check for square sizing (icon buttons are square)
    expect(screen.getByRole('button').className).toContain('w-9');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles click events', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole('button').click();
    expect(clicked).toBe(true);
  });
});
