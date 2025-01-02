import { render, screen, act } from '@testing-library/react';
import { HistoryList } from '../HistoryList';

const mockExec = jest.fn();
jest.mock('@chronicle-sync/core', () => ({
  getDatabase: jest.fn().mockResolvedValue({
    history: {
      find: () => ({
        exec: mockExec,
      }),
    },
  }),
}));

describe('HistoryList', () => {
  beforeEach(() => {
    mockExec.mockReset();
  });

  it('should render loading state initially', async () => {
    mockExec.mockImplementation(() => new Promise(() => {})); // Never resolves
    await act(async () => {
      render(<HistoryList />);
    });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render history entries', async () => {
    mockExec.mockResolvedValue([
      {
        id: '1',
        url: 'https://example.com',
        title: 'Example Site',
        timestamp: new Date('2023-01-01').getTime(),
        deviceId: 'test-device',
      },
    ]);
    render(<HistoryList />);
    const link = await screen.findByText('Example Site');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
  });
});
