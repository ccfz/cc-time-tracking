import { renderHook, act } from '@testing-library/react-hooks';
import useSession from '../../hooks/useSession';
import { localStorageMock } from '../support/localStorageMock';

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })
  jest.spyOn(window, 'fetch')
})

describe('useSessions', () => {
  afterEach(() => {
    window.localStorage.clear();
  })

  describe("when storage has no device", () => {
    it("creates and saves a device", async () => {
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true
        }),
      })

      renderHook(() => useSession('taskId:569'));

      expect(window.localStorage.getItem('deviceId')).not.toBeNull();
    });
  });

  it("creates and saves a session for the device", async () => {
    const deviceId = "deviceId:456";
    const taskId = "taskId:569"

    window.localStorage.setItem('deviceId', deviceId)
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        session_id: 'sessionId1234'
      }),
    })

    const { waitForNextUpdate } = renderHook(() => useSession(taskId));

    await act(() => waitForNextUpdate())

    expect(window.fetch).toHaveBeenCalledWith(
      `http://localhost:5000/tasks/${taskId}/sessions?device_id=${deviceId}`,
      { method: 'POST' }
    )
    expect(window.localStorage.getItem('sessionId')).toEqual('sessionId1234');
  });

  it("returns a stop session function", async () => {
    const sessionId = 'sessionId123'
    const deviceId = 'deviceId456'
    window.localStorage.setItem('sessionId', sessionId)
    window.localStorage.setItem('deviceId', deviceId)

    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        session_id: sessionId
      }),
    })

    const { result, waitForNextUpdate } = renderHook(() => useSession('taskId'));
    await act(() => waitForNextUpdate())
    window.fetch.mockClear();
    result.current.stopSession();

    expect(window.fetch).toHaveBeenCalledWith(
      `http://localhost:5000/sessions/${sessionId}?device_id=${deviceId}`,
      { method: 'DELETE' }
    )
  });

  it("returns a start session function", async () => {
    const deviceId = "deviceId:456";
    const taskId = "taskId:569"

    window.localStorage.setItem('deviceId', deviceId)
    window.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        session_id: 'sessionId1234'
      }),
    })

    const { result, waitForNextUpdate } = renderHook(() => useSession(taskId));
    await act(() => waitForNextUpdate())
    window.fetch.mockClear();
    result.current.startSession()
    await act(() => waitForNextUpdate())

    expect(window.fetch).toHaveBeenCalledWith(
      `http://localhost:5000/tasks/${taskId}/sessions?device_id=${deviceId}`,
      { method: 'POST' }
    )
    expect(window.localStorage.getItem('sessionId')).toEqual('sessionId1234');
  });
});