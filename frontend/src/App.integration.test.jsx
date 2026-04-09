import { render, screen } from '@testing-library/react';

const mockAresCommandPage = jest.fn(({ initialTab }) => (
  <div data-testid="ares-page">TAB:{initialTab || 'route-driven'}</div>
));

jest.mock('./pages/ares/AresCommandPage', () => ({
  __esModule: true,
  default: (props) => mockAresCommandPage(props),
}));

jest.mock('./ui/StarField', () => ({
  __esModule: true,
  default: () => <div data-testid="starfield" />,
}));

describe('App integration', () => {
  beforeEach(() => {
    mockAresCommandPage.mockClear();
  });

  test('renders root route with apod initialTab', async () => {
    window.history.pushState({}, 'Root', '/');

    const { default: App } = await import('./App.jsx');
    render(<App />);

    expect(screen.getByTestId('starfield')).toBeInTheDocument();
    expect(screen.getByTestId('ares-page')).toHaveTextContent('TAB:apod');
  });

  test('renders tab route without forcing initialTab prop', async () => {
    window.history.pushState({}, 'Live', '/live');

    const { default: App } = await import('./App.jsx');
    render(<App />);

    expect(screen.getByTestId('ares-page')).toHaveTextContent('TAB:route-driven');
  });
});
