import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'

import Report from '../../Report'

beforeAll(() => jest.spyOn(window, 'fetch'))

function renderReport({ data = [], history } = {}) {
  window.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true,
      data: {
        total_time: 48,
        avg_per_task: 24,
        avg_per_session: 16
      }
    }),
  })

  return render(
    <MemoryRouter history={history}>
      <Report />
    </MemoryRouter>
  );
}

describe('TasksOverview', () => {
  it('renders the tasks title', async () => {
    renderReport();

    const title = await screen.findByText('Report Page')
    expect(title).toBeTruthy();
  });

  it('renders a back button', async () => {
    renderReport();

    const title = await screen.findByText('Back')
    expect(title).toBeTruthy();
  });

  it('renders the report', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          total_time: 100,
          avg_per_task: 25,
          avg_per_session: 10
        }
      }),
    })
    renderReport();

    await waitFor(() => {
      expect(screen.getByText('All times in minutes')).toBeTruthy();
      expect(screen.getByText('Total time spend: 100')).toBeTruthy();
      expect(screen.getByText('Avg. time per task: 25')).toBeTruthy();
      expect(
        screen.getByText('Avg. time per session: 10')
      ).toBeTruthy();

    })
  });
});