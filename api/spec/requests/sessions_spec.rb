require 'rails_helper'

RSpec.describe Session, type: :request do
  describe 'POST tasks/:id/sessions' do
    before do
      current_time = Time.now
      Timecop.freeze(current_time)
    end

    after do
      Timecop.return
    end

    it "creates a session for the task with a start time and device id" do
      task = create(:task)

      post "/tasks/#{task.id}/sessions", params: { device_id: '123abc' }

      session = Session.find_by(task: task)
      expect(session.start_time).to eq(Time.now)
      expect(Device.find_by(session: session).device_id).to eq('123abc')
    end

    it "returns the session id" do
      task = create(:task)

      post "/tasks/#{task.id}/sessions"

      session = Session.find_by(task: task)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["session_id"]).to eq(session.id)
    end

    context "when there is an active session" do
      context "when the device is new" do
        it "saves the device with the existing session" do
          task = create(:task)
          session = create(:session, task: task)
          create(:device, session: session, device_id: '123abc')

          post "/tasks/#{task.id}/sessions", params: { device_id: '456abc' }

          session = Session.find_by(task: task)
          expect(Device.find_by(device_id: '456abc').session.id).to eq(session.id)
        end
      end

      context "when the device is known" do
        it "returns ok" do
          task = create(:task)
          session = create(:session, task: task)
          create(:device, session: session, device_id: '123abc')

          post "/tasks/#{task.id}/sessions", params: { device_id: '123abc' }

          session = Session.find_by(task: task)
          expect(task.sessions.count).to eq(1);
          expect(session.devices.count).to eq(1);
          parsed_body = JSON.parse(response.body)
          expect(parsed_body["session_id"]).to eq(session.id)
        end
      end
    end

    context "when the received session is expired" do
      it "creates a new session with the device" do
        task = create(:task)
        inactive_session = create(:session, task: task, end_time: Time.now)

        post "/tasks/#{task.id}/sessions", params: { device_id: '456abc' }

        session = Session.active.find_by(task: task)
        expect(session.id).not_to eq(inactive_session.id)
        expect(Device.find_by(device_id: '456abc').session.id).to eq(session.id)
      end
    end

    context "when the received task is submitted" do
      it "returns ok without a session id" do
        task = create(:task, submitted: true, answer: 'some text')
        create(:session, task: task, end_time: Time.now)

        post "/tasks/#{task.id}/sessions", params: { device_id: '456abc' }

        session = Session.find_by(task: task)
        expect(task.sessions.count).to eq(1);
        expect(session.devices.count).to eq(0);
      end
    end
  end

  describe 'sessions/:id' do
    before do
      current_time = Time.now
      Timecop.freeze(current_time)
    end

    after do
      Timecop.return
    end

    it "removes the device from the session" do
      session = create(:session)
      create(:device, session: session, device_id: '123abc')
      create(:device, session: session, device_id: '456abc')

      delete "/sessions/#{session.id}", params: { device_id: '123abc' }

      expect(session.reload.end_time).to eq(nil)
    end

    context "when the session has no more devices" do
      it "ends the session" do
        session = create(:session)
        create(:device, session: session, device_id: '123abc')

        delete "/sessions/#{session.id}", params: { device_id: '123abc' }

        expect(session.reload.end_time).to eq(Time.now)
      end
    end
  end
end
