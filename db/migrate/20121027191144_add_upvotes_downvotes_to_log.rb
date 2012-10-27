class AddUpvotesDownvotesToLog < ActiveRecord::Migration
  def change
    add_column :logs, :upvotes,   :integer, :null => false, :default => 0
    add_column :logs, :downvotes, :integer, :null => false, :default => 0
  end
end
