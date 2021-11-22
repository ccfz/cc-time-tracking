class Session < ApplicationRecord
  belongs_to :task

  has_many :devices, dependent: :destroy

  scope :active, -> { joins(:devices).distinct }

  def end_session
    self.devices.destroy_all
    self.update(end_time: Time.now)
  end
end
