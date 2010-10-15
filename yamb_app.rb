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

  def with_error_handler(context)
    begin
      yield
    rescue Exception => e
      return {
        :success => false,
        :payload => {
          :message => "#{e.class} : #{e.message} #{context}"
        }
      }.to_json
    end
  end

  get '/:hostname.json' do
    content_type 'application/json', :charset => 'utf-8'
    $stderr.puts params.inspect
    hostname, port = params[:hostname].split ':'
    with_error_handler("accessing #{hostname}:#{port}") do
      server = Mongo::Connection.new(hostname,port)
      return {
        :success => true,
        :payload => {
          :hostname => hostname,
          :port => port || Mongo::Connection::DEFAULT_PORT,
          :server_info => server.server_info,
          :server_version => server.server_version,
          :databases => server.database_names
        }
      }.to_json
    end
  end

  get '/:hostname/:db.json' do
    content_type 'application/json', :charset => 'utf-8'
    $stderr.puts params.inspect
    hostname, port = params[:hostname].split ':'
    db_name = params[:db]
    with_error_handler("accessing #{hostname}:#{port} db #{db_name}") do
      server = Mongo::Connection.new(hostname,port)
      db = server.db(db_name)
      return {
        :success => true,
        :payload => {
          :hostname => hostname,
          :port => port || Mongo::Connection::DEFAULT_PORT,
          :server_info => server.server_info,
          :server_version => server.server_version,
          :database => db_name,
          :collections => db.collections.collect {|c| {:name => c.name, :count => c.count } }
        }
      }.to_json
    end
  end


end

