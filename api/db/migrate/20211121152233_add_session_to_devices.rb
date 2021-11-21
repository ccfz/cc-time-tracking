class AddSessionToDevices < ActiveRecord::Migration[5.2]
  def change
    add_reference :devices, :session, foreign_key: true
  end
end
