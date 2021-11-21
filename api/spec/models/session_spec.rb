require 'rails_helper'

RSpec.describe Session, type: :model do
  it 'has a valid factory' do
    session = build(:session)

    expect(session).to be_valid
  end

  describe ".active" do
    it "returns session with devices" do
      task = create(:task)
      create(:session, task: task)
      session = create(:session, task: task)
      create(:device, session: session, device_id: '123abc')
      create(:device, session: session, device_id: '456abc')

      expect(task.sessions.active).to contain_exactly(session)
    end
  end
end
