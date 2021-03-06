require "socket"
require "json"
require "pp"
require "open-uri"
require "uri"
require "resque"
require "redis"
require "camera_api"
require "fabnavi_utils"
require "base64"
require "date"

require "rexml/document"
require "aws-sdk"

include Fabnavi

$host = "10.0.0.1"
$port = 10000

module Gdworker
  class App < Padrino::Application
    use ActiveRecord::ConnectionAdapters::ConnectionManagement
    register ScssInitializer
    register Padrino::Mailer
    register Padrino::Helpers

    enable:sessions
    disable:protect_from_csrf

    Resque.redis = Redis.new
    before do
      @authorName = session[:authorName] ||= nil
      @authorEmail = session[:email] ||= nil
      @projectName = session[:projectName] ||= nil
    end

    get '/' do
      session[:projectName] = nil
      @email = session[:email] ||= "null"
      @name = "null"
      if not @email == "null" then
        author = Author.find_by(:email => @email)
        @email = "\""+@email+"\""
        if author == nil then
          @name = "\"UNREGISTERED\""
        else
          @name = "\""+author.name.to_s+"\""
        end
      end
      begin 
        @projects= Project.authenticated_project_list(@authorName)
      rescue
        @projects= Project.project_list_default
      end
      render 'project/index' 
    end

    get "/project/:author/:project/" do
      id = Project.find_project(params[:author],params[:project]).id
      @picturesData= Picture.pictures_list(id)
      @projectData = {:author=> params[:author],:projectName => params[:project]}
      if @projectData == nil then
        render 'errors/404'
      else 
        render 'project/project'
      end
    end

    get "/add/:author/:project/" do
      unless session[:authorName] == params[:author] then redirect_to '/'; return end
      id = Project.find_project(params[:author],params[:project]).id
      @picturesData= Picture.pictures_list(id)
      @projectData = {:author=> params[:author],:projectName => params[:project]}
      if @projectData == nil then
        render 'errors/404'
      else 
        render 'project/add'
      end
    end

    get "/ref/:author/:project/" do
      id = Project.find_project(params[:author],params[:project]).id
      @picturesData= Picture.pictures_list(id)
      @projectData = {:author=> params[:author],:projectName => params[:project]}
      if @projectData == nil then
        render 'errors/404'
      else 
        render 'project/ref'
      end
    end

    get "/edit/:author/:project/" do
      unless session[:authorName] == params[:author] then redirect_to '/'; return end
      id = Project.find_project(params[:author],params[:project]).id
      @picturesData= Picture.pictures_list(id)
      @projectData = {:author=> params[:author],:projectName => params[:project]}
      if @projectData == nil then
        render 'errors/404'
      else 
        render 'project/edit'
      end
    end

    get "/new" do
      session[:projectName] = nil
      if session[:authorName] == nil then
        redirect_to "/"
      else 
        flash[:notice] = "Start"
        @authorName = session[:authorName]
        render 'project/newProject'
      end
    end

    get "/status/:author/:project" do
      unless @authorName == params[:author] then redirect_to "/" ; end
      if Project.find_project(@authorName,params[:project]).class == Project then
        session[:projectName] = params[:project]
        @projectName = params[:project]
      end 
      render 'project/status'
    end

    not_found do
      render 'errors/404'
    end

    get "/test" do
      render 'test/project_page_test'
    end
  end
end
