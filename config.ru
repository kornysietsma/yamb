require 'rubygems'
require 'bundler/setup'

require 'sinatra/base'
require './yamb_app'

use Rack::ShowExceptions

run YambApp
