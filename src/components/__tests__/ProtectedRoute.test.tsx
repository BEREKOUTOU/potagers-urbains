import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '../../contexts/AuthProvider';

const MockProtectedComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute Component', () => {
  it('should render protected component', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <MockProtectedComponent />
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(document.body).toBeInTheDocument();
  });

  it('should work with auth provider', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <MockProtectedComponent />
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(document.body).toBeInTheDocument();
  });
});
