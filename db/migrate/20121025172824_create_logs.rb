class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.string :url,        :null => false
      t.string :public_url, :null => false
      t.text :transcript
      t.boolean :reported,  :null => false

      t.timestamps
    end
  end
end
