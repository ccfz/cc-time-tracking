class AddTaskToSessions < ActiveRecord::Migration[5.2]
  def change
    add_reference :sessions, :task, foreign_key: true
  end
end
