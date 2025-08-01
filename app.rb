require "sinatra"

set :public_folder, File.dirname(__FILE__) + "/public"

# Serve static files from assets directory
get "/assets/*" do
  send_file File.join(File.dirname(__FILE__), params[:splat].first)
end

get "/" do
  send_file File.join(settings.public_folder, "index.html")
end
