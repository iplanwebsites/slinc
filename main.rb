require 'bundler/setup'
require 'sinatra'

configure do
	Rack::Mime::MIME_TYPES[".manifest"] = "text/cache-manifest"
end

get '/' do
	# redirect '/clock.html'
	erb :index
end

get '/page2.php' do
	 redirect '/'
	# For old site redirection...
end

