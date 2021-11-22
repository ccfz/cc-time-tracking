class AddTotalTimeToTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :total_time, :integer, default: 0
  end
end
