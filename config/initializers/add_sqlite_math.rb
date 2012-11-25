# In which we hack ActiveRecord to allow us to run code before each connection
# is established. The point of this atrocity is to allow sqlite to do math,
# such as the sqrt function.
class ActiveRecord::ConnectionAdapters::ConnectionPool
  private
  alias old_new_connection new_connection
  def new_connection(*args, &proc)
    conn = old_new_connection(*args, &proc)

    rc = conn.raw_connection
    rc.enable_load_extension 1
    rc.load_extension "etc/sqlite-math/libsqlitemath.so"
    rc.enable_load_extension 0

    conn
  end
end
