require 'sinatra/base'
require "bundler"
Bundler.setup(:default)
Bundler.require(:default)
require 'ostruct'
require 'mongo'

PRJ_DIR = File.absolute_path(File.dirname(__FILE__))
require_all Dir.glob("#{File.join(PRJ_DIR, "lib", "*.rb")}")

class YambApp < Sinatra::Base
  set :views, 'views/'
  set :public, 'public/'
  set :static, true
  set :sessions, false
  set :show_exceptions, true # or maybe not?
  configure do
    config_file = File.join(PRJ_DIR, "config", "config.json")
    config_data = {}
    if File.exists?(config_file)
      config_data = JSON.parse(File.read(config_file))
    end
    ext_config = File.join(PRJ_DIR, "config", "config_#{YambApp.environment}")
    if File.exists?(ext_config)
      config_data.merge! JSON.parse(File.read(config_file))
    end
    set :config, OpenStruct.build_recursive(config_data)
  end

  get '/' do
    redirect "/index.html"
  end

  get '/:hostname.json' do
    content_type 'application/json', :charset => 'utf-8'
    begin
      $stderr.puts params.inspect
      hostname, port = params[:hostname].split ':'
      db = Mongo::Connection.new(hostname,port)
      return {
        :success => true,
        :hostname => hostname,
        :port => port || Mongo::Connection::DEFAULT_PORT,
        :server_info => db.server_info,
        :server_version => db.server_version,
        :databases => db.database_names
      }.to_json
    rescue Exception => e
      return {
        :success => false,
        :hostname => hostname,
        :port => port || Mongo::Connection::DEFAULT_PORT,
        :reason => {
                :class => e.class,
                :message => e.message
        }
      }.to_json
    end
  end
end

