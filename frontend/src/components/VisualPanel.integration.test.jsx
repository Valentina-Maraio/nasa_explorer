import { fireEvent, render, screen } from '@testing-library/react';
import VisualPanel from './VisualPanel.jsx';

function baseProps(overrides = {}) {
  return {
    activeTab: 'apod',
    apod: {
      title: 'Andromeda',
      explanation: 'Long explanation',
      media_type: 'image',
      date: '2026-04-08',
    },
    apodLoading: false,
    apodError: null,
    epic: null,
    neo: { closestObject: { absoluteMagnitude: 21.8 }, hazardousCount: 1, elementCount: 2 },
    manifest: null,
    today: '2026-04-08',
    primaryFeed: {
      type: 'image',
      url: 'https://img/test.jpg',
      title: 'Andromeda',
      subtitle: '2026-04-08',
    },
    fetchApod: jest.fn(),
    formatNumber: (n) => String(n),
    ...overrides,
  };
}

describe('VisualPanel integration', () => {
  test('renders feed and opens/closes APOD dialog', () => {
    render(<VisualPanel {...baseProps()} />);

    expect(screen.getByText('VISUAL RECONNAISSANCE')).toBeInTheDocument();
    expect(screen.getByText('Andromeda')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Open image description/i }));
    expect(screen.getByText('Long explanation')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Close image description/i }));
    expect(screen.queryByText('Long explanation')).not.toBeInTheDocument();
  });

  test('renders video iframe when feed type is video', () => {
    render(
      <VisualPanel
        {...baseProps({
          primaryFeed: {
            type: 'video',
            url: 'https://video.test/embed',
            title: 'Video feed',
            subtitle: 'Live',
          },
          apod: {
            title: 'Video feed',
            explanation: 'Video explanation',
            media_type: 'video',
            date: '2026-04-08',
          },
        })}
      />,
    );

    expect(screen.getByTitle('Video feed')).toBeInTheDocument();
  });

  test('renders mars detail panel when activeTab is mars', () => {
    render(
      <VisualPanel
        {...baseProps({
          activeTab: 'mars',
          manifest: {
            status: 'active',
            maxDate: '2026-04-08',
            latestPhotos: { cameras: ['MAST', 'NAV'] },
          },
        })}
      />,
    );

    expect(screen.getByText('MARS RECON DETAILS')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
