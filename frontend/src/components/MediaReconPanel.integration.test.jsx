import { fireEvent, render, screen } from '@testing-library/react';
import MediaReconPanel from './MediaReconPanel.jsx';

function buildProps(overrides = {}) {
  return {
    mediaQuery: 'nebula',
    mediaResults: [
      { nasa_id: 'A1', title: 'Nebula 1', thumbnail: 'https://img/1.jpg' },
      { nasa_id: 'A2', title: 'Nebula 2', thumbnail: '' },
    ],
    mediaLoading: false,
    selectedMediaAsset: 'A1',
    mediaError: null,
    handleMediaQueryChange: jest.fn(),
    handleMediaSubmit: jest.fn((e) => e.preventDefault()),
    handleMediaSelect: jest.fn(),
    searchMedia: jest.fn(),
    mediaCurrentPage: 2,
    mediaTotalPages: 4,
    mediaTotalResults: 42,
    handleMediaPageChange: jest.fn(),
    formatNumber: (n) => String(n),
    ...overrides,
  };
}

describe('MediaReconPanel integration', () => {
  test('renders results and selects media item', () => {
    const props = buildProps();
    render(<MediaReconPanel {...props} />);

    expect(screen.getByText('MEDIA RECONNAISSANCE')).toBeInTheDocument();
    expect(screen.getByText('42 RESULTS')).toBeInTheDocument();
    expect(screen.getByText('PAGE 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Nebula 2/i }));
    expect(props.handleMediaSelect).toHaveBeenCalledWith('A2');
  });

  test('submits search and paginates', () => {
    const props = buildProps();
    render(<MediaReconPanel {...props} />);

    fireEvent.submit(screen.getByRole('button', { name: /EXECUTE SEARCH/i }).closest('form'));
    expect(props.handleMediaSubmit).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(props.handleMediaPageChange).toHaveBeenCalledWith(3);
  });

  test('renders error and retries current query/page', () => {
    const props = buildProps({ mediaError: 'boom' });
    render(<MediaReconPanel {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /RETRY/i }));
    expect(props.searchMedia).toHaveBeenCalledWith('nebula', 2);
  });
});
