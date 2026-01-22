import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../useFavorites';
import { useAuth } from '@/contexts/AuthContextBase';

jest.mock('@/contexts/AuthContextBase');

describe('useFavorites Hook', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, username: 'testuser', email: 'test@test.com' },
      token: 'test-token',
    });

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty favorites', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toBeDefined();
  });

  it('should add favorite', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await result.current.addFavorite('garden', 1);
    });

    expect(global.fetch).toHaveBeenCalled();
  });

  it('should remove favorite', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await result.current.removeFavorite(1);
    });

    expect(global.fetch).toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      try {
        await result.current.addFavorite('garden', 1);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  it('should return isLoading state', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { result } = renderHook(() => useFavorites());
    expect(result.current.isLoading).toBeDefined();
  });

  it('should have refetch method', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await result.current.refetch();
    });

    expect(global.fetch).toHaveBeenCalled();
  });

  it('should handle unauthenticated user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
    });

    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toBeDefined();
  });

  it('should not make API calls when user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
    });

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await result.current.addFavorite('garden', 1);
    });

    // Should not call fetch if no user
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
