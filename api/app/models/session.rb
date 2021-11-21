class Session < ApplicationRecord
  belongs_to :task

  has_many :devices, dependent: :destroy

  scope :active, -> { joins(:devices).distinct }
end
