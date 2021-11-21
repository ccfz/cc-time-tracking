class SessionsController < ApplicationController
  def create
    task = Task.find(task_id)
    if task.submitted
      render json: { success: true }, status: :ok
    else
      session = task.sessions.active.first_or_create!(start_time: Time.now)
      session.devices.find_or_create_by!(device_id: device_id)

      render json: { success: true, session_id: session.id }, status: :ok
    end
  end

  def destroy
    session = Session.find(id)
    session.devices.find_by(device_id: device_id).destroy
    session.update!(end_time: Time.now) unless session.devices.any?

    render json: { success: true }, status: :ok
  end

  def task_id
    params[:task_id]
  end

  def id
    params[:id]
  end

  def device_id
    params[:device_id]
  end
end
