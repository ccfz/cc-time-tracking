require 'rails_helper'

RSpec.describe Task, type: :request do
  describe 'get tasks_report' do
    it "creates a session for the task with a start time and device id" do
      task = create(:task)
      other_task = create(:task)
      create(:session,
             task: task,
             start_time: Time.new(2007, 11, 1, 15, 0, 0),
             end_time: Time.new(2007, 11, 1, 15, 14, 0))
      create(:session,
             task: task,
             start_time: Time.new(2007, 11, 1, 15, 15, 0),
             end_time: Time.new(2007, 11, 1, 15, 30, 0))
      create(:session,
             task: other_task,
             start_time: Time.new(2007, 11, 1, 15, 0, 0),
             end_time: Time.new(2007, 11, 1, 15, 20, 0))

      get "/tasks_report"

      parsed_body = JSON.parse(response.body)
      expect(parsed_body["data"]).to eq({
        "total_time" => 48,
        "avg_per_task" => 24,
        "avg_per_session" => 16
      })
    end
  end

  describe 'put task' do
    it "response with the submitted task and total time" do
      task = create(:task)
      other_task = create(:task)
      active_session = create(:session,
             task: task,
             start_time: Time.new
            )
      create(:session,
             task: task,
             start_time: Time.new(2007, 11, 1, 15, 0, 0),
             end_time: Time.new(2007, 11, 1, 15, 14, 0))
      create(:session,
             task: task,
             start_time: Time.new(2007, 11, 1, 15, 15, 0),
             end_time: Time.new(2007, 11, 1, 15, 30, 0))
      create(:session,
             task: other_task,
             start_time: Time.new(2007, 11, 1, 15, 0, 0),
             end_time: Time.new(2007, 11, 1, 15, 20, 0))
      create(:device, session: active_session)

      put "/tasks/#{task.id}", { params: { task: { answer: 'Hello world' } } }

      response_data = JSON.parse(response.body)["data"]
      expect(response_data["total_time"]).to eq(29)
      expect(response_data["answer"]).to eq('Hello world')
    end
  end
end
