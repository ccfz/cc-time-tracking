import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'

import TasksOverview from '../../TasksOverview'

beforeAll(() => jest.spyOn(window, 'fetch'))

function renderTasksOverview({ data = [], history } = {}) {
  window.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true,
      data
    }),
  })

  return render(
    <MemoryRouter history={history}>
      <TasksOverview />
    </MemoryRouter>
  );
}

describe('TasksOverview', () => {
  it('renders the tasks title', async () => {
    renderTasksOverview();

    const title = await screen.findByText('Tasks')
    expect(title).toBeTruthy();
  });

  it('renders the tasks', async () => {
    const tasks = [
      { id: 1, instructions: 'Write Lord of the Rings' }
    ]
    renderTasksOverview({ data: tasks });

    const task = await screen.findByText('Write Lord of the Rings')
    expect(task).toBeTruthy();
  });

  describe('when a task is clicked', () => {
    it('navigates to that tasks', async () => {
      const tasks = [
        { id: 123, instructions: 'Write Lord of the Rings' }
      ]

      renderTasksOverview({ data: tasks });

      const task = await screen.findByText(/Write Lord of the Rings/i)
      expect(task.href).toMatch(/\/123/i)
    });
  });
});
