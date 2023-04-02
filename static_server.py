import flask

app = flask.Flask(__name__, static_url_path='', static_folder="build")

@app.route("/")
def home():
  return flask.send_file("build/index.html")

#@app.route('/', defaults={'path': ''})
#@app.route("/<path:path>")
#def catch_stuff(path):
#  print(path)
#  return flask.send_from_directory("build", path)
  
if __name__ == "__main__":
  app.run("localhost", 3000)


