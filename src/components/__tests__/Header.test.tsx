import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from '../Header';
import { AuthProvider } from '../../contexts/AuthProvider';

describe('Header Component', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render header with navigation links', () => {
    renderHeader();
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should display logo text', () => {
    renderHeader();
    
    const logoElement = screen.queryByText(/green city/i);
    expect(logoElement).toBeInTheDocument();
  });

  it('should have navigation menu', () => {
    renderHeader();
    
    const navElements = screen.queryAllByRole('link');
    expect(navElements.length).toBeGreaterThan(0);
  });

  it('should display appropriate links when not authenticated', () => {
    renderHeader();
    
    const loginLink = screen.queryByText(/login/i);
    const signupLink = screen.queryByText(/sign up/i);
    
    expect(loginLink || signupLink).toBeInTheDocument();
  });

  it('should be responsive', () => {
    renderHeader();
    
    const header = screen.getByRole('navigation');
    expect(header).toHaveClass('flex', 'justify-between', 'items-center');
  });
});
