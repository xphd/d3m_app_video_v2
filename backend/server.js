var express = require("express");
var http = require("http");
var socketIO = require("socket.io");
var fs = require("fs");

var app = express();
var router = express.Router();

const BASE_URL = "http://localhost:3000/";
const STATIC_VIDEO_FOLDER_PATH = "public/";

// Add headers
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(express.static("public"));
var server = http.createServer(app);
var io = socketIO(server);
io.on("connection", socket => {
  console.log("Server: get Client");

  // listen to "getVideos" emmited from frontend
  socket.on("requestVideos", () => {
    console.log("requestVideos activated");
    // get the list of links to Video file in this server
    var videos = [];
    var index = 0

    fs.readdirSync(STATIC_VIDEO_FOLDER_PATH).forEach(subFolderPath => {
      var path = STATIC_VIDEO_FOLDER_PATH + subFolderPath;
      var stats = fs.statSync(path);
      if (stats.isDirectory(subFolderPath)) {
        fs.readdirSync(path).forEach(file => {
          var link = BASE_URL + subFolderPath + "/" + file;
          var video = {
            id : index,
            link:link
          };
          videos.push(video)
          index++;
        });
      } else {
        console.log(path + " is not a directory");
      }
    });
    videos[0];

    // emit "returnVideos" to the frontend with Videos
    socket.emit("responseVideos", videos);
    console.log("responseVideos activated");
  });
});

app.get("/", (req, res) => res.send("Hello"));
app.get("/world", (req, res) => res.send("Hello World!"));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
