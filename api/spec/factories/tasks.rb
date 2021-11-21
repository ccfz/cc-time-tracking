FactoryBot.define do
  factory :task do
    instructions { 'Write Lord of the Rings' }
    user { create(:user) }
  end
end
