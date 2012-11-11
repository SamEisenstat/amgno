class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.references :log
      t.string :report_type
      t.text :message

      t.timestamps
    end
  end
end
