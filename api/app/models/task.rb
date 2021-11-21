class Task < ApplicationRecord
  belongs_to :user

  has_many :sessions, dependent: :destroy

  validates :answer, presence: true, if: :submitted?
end
