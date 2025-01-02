import { render, screen } from '@testing-library/react';
import { HistoryList } from '../HistoryList';

jest.mock('@chronicle-sync/core', () => ({
  getDatabase: jest.fn().mockResolvedValue({
    history: {
      find: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            id: '1',
            url: 'https://example.com',
            title: 'Example Site',
            timestamp: new Date('2023-01-01').getTime(),
            deviceId: 'test-device',
          },
        ]),
      }),
    },
  }),
}));

describe('HistoryList', () => {
  it('should render loading state initially', () => {
    render(<HistoryList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render history entries', async () => {
    render(<HistoryList />);
    const link = await screen.findByText('Example Site');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
  });
});