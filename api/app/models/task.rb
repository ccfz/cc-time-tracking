class Task < ApplicationRecord
  belongs_to :user

  has_many :sessions, dependent: :destroy

  validates :answer, presence: true, if: :submitted?

  def self.generate_report
    total_time = Task.joins(:sessions)
                   .select("sum((julianday(end_time) - julianday(start_time)))
                             * 24 * 60 as total_time")

    {
      total_time: total_time.first.total_time.floor,
      avg_per_task: (total_time.first.total_time / Task.count).floor,
      avg_per_session: (total_time.first.total_time / Session.count).floor
    }
  end
end
