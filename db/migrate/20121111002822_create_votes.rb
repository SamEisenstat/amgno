class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.references :log
      t.string :ip
      t.string :vote_type

      t.timestamps
    end
  end
end
