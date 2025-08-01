require "sinatra"

set :public_folder, File.dirname(__FILE__) + "/public"

get "/" do
  send_file File.join(settings.public_folder, "index.html")
end
