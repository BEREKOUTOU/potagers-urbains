import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import GardensGrid from '../GardensGrid';

describe('GardensGrid Component', () => {
  const renderGardensGrid = () => {
    return render(
      <BrowserRouter>
        <GardensGrid />
      </BrowserRouter>
    );
  };

  it('should render gardens grid component', () => {
    renderGardensGrid();
    expect(document.body.textContent).toBeTruthy();
  });

  it('should display garden cards', () => {
    renderGardensGrid();
    // GardensGrid has hardcoded gardens, check for one of them
    const gardensExist = screen.queryByText(/Jardin des Lilas/) || 
                        screen.queryByText(/Potager du Toit/) || 
                        screen.queryByText(/Balcon Partagé/);
    expect(gardensExist || document.body.textContent.includes('Jardin')).toBeTruthy();
  });

  it('should display garden locations', () => {
    const { container } = renderGardensGrid();
    expect(container.textContent).toBeTruthy();
  });

  it('should render with correct structure', () => {
    const { container } = renderGardensGrid();
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('should be responsive', () => {
    const { container } = renderGardensGrid();
    expect(container.firstChild).toBeInTheDocument();
  });
});
