class TasksController < ApplicationController
  def index
    tasks = Task.all
    render json: { success: true, data: tasks }, status: 200
  end

  def report
    report = Task.generate_report

    render json: { success: true, data: report }, status: 200
  end

  def show
    task = Task.find(task_id)
    return render(json: { success: false, errors: 'Task not found' }) \
      if task.nil?

    render json: { success: true, data: task }, status: 200
  end

  def update
    task = Task.find(task_id)

    if task.submitted?
      return render(
        json: { success: false, errors: 'Task already submitted' },
        status: 403
      )
    end

    success = task.update(task_params)
    task.sessions.active.first.end_session
    task.update(total_time: task.compute_total_time)

    return render(
      json: {
        success: success,
        errors: task.errors,
        data: task
      },
      status: success ? 200 : 422
    )
  end

private

  def task_params
    params.require(:task).permit(
      :submitted,
      :answer
    )
  end

  def task_id
    params[:id]
  end
end
