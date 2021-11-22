import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'

import TaskSubmit from '../../TaskSubmit';
import useSession from '../../hooks/useSession';

jest.mock("../../hooks/useSession");
beforeAll(() => jest.spyOn(window, 'fetch'))

function renderTaskSubmit({ data = [], history } = {}) {
  window.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true,
      data
    }),
  })

  return render(
    <MemoryRouter history={history}>
      <TaskSubmit />
    </MemoryRouter>
  );
}

describe('TaskSubmit', () => {
  describe('when the back button is pressed', () => {
    it('stops the current task session', async () => {
      const stopSession = jest.fn();
      useSession.mockReturnValue({ stopSession })
      renderTaskSubmit();

      const backButton = await screen.findByText('Back');
      fireEvent.click(backButton);

      expect(stopSession).toHaveBeenCalled();
    });
  });

  describe('when the submit button is pressed', () => {
    it('stops the current task session', async () => {
      window.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { success: true }
        }),
      })
      const stopSession = jest.fn();
      useSession.mockReturnValue({ stopSession })
      renderTaskSubmit();

      await waitFor(() => {
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        expect(stopSession).toHaveBeenCalled();
      })
    });
  });

  describe('when the window becomes blurred', () => {
    it('stops the current task session', async () => {
      const stopSession = jest.fn();
      useSession.mockReturnValue({ stopSession })
      renderTaskSubmit();
      await screen.findByText('Back');

      fireEvent.blur(window)

      expect(stopSession).toHaveBeenCalled();
    });
  })

  describe('when the window becomes focused', () => {
    it('start the current task session', async () => {
      const startSession = jest.fn();
      useSession.mockReturnValue({ startSession })
      renderTaskSubmit();
      await screen.findByText('Back');

      fireEvent.focus(window)

      expect(startSession).toHaveBeenCalled();
    });
  })
});
