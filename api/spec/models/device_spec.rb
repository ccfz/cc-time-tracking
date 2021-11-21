require 'rails_helper'

RSpec.describe Device, type: :model do
  it 'has a valid factory' do
    device = build(:device)

    expect(device).to be_valid
  end
end
