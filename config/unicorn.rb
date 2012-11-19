app_root = File.expand_path(File.dirname(File.dirname(__FILE__)))

worker_processes 2
working_directory app_root

# This loads the application in the master process before forking
# worker processes
# Read more about it here:
# http://unicorn.bogomips.org/Unicorn/Configurator.html
preload_app true

timeout 30

# This is where we specify the socket.
# We will point the upstream Nginx module to this socket later on
listen app_root + "/tmp/sockets/unicorn.sock", :backlog => 64

pid app_root + "/tmp/pids/unicorn.pid"

# Set the path of the log files inside the log folder of the testapp
stderr_path app_root + "/log/unicorn.stderr.log"
stdout_path app_root + "/log/unicorn.stdout.log"

before_fork do |server, worker|
# This option works in together with preload_app true setting
# What is does is prevent the master process from holding
# the database connection
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!

  old_pid = app_root + '/tmp/pids/unicorn.pid.oldbin'
  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      puts "Old master already dead"
    end
  end
end

after_fork do |server, worker|
  # Here we are establishing the connection after forking worker
  # processes
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end
