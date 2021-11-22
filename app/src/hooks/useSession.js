import { useState, useEffect } from 'react';

function generateDeviceId() {
  const deviceId = Math.random().toString(36).substr(2, 8);

  window.localStorage.setItem('deviceId', deviceId)
}

function useSessions(taskId) {
  const [deviceId, setDeviceId] = useState();
  const [sessionId, setSessionId] = useState();

  const getDeviceId = () => {
    const storedId = window.localStorage.getItem('deviceId');

    return storedId || generateDeviceId();
  };

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, [])

  useEffect(() => {
    if (deviceId) {
      startSession();
    };
  }, [deviceId]);

  async function startSession() {
    const response = await fetch(
      `http://localhost:5000/tasks/${taskId}/sessions?device_id=${deviceId}`,
      {

        method: 'POST',
      }
    );
    const result = await response.json();
    const { session_id: sessionId } = result || {};
    if (sessionId) {
      window.localStorage.setItem('sessionId', sessionId);
      setSessionId(sessionId)
    }
  }

  async function stopSession() {
    await fetch(
      `http://localhost:5000/sessions/${sessionId}?device_id=${deviceId}`,
      {

        method: 'DELETE',
      }
    );

    window.localStorage.removeItem('sessionId');
  }

  if (!deviceId || !sessionId) { return {} }

  return { stopSession, startSession };
}

export default useSessions