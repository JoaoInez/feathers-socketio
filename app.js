const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");

const app = express(feathers());
const PORT = process.env.PORT || 3030;

class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create({ text, tech, viewer }) {
    const idea = {
      id: this.ideas.length,
      text,
      tech,
      viewer,
      time: moment().format("h:mm:ss a")
    };

    this.ideas.push(idea);

    return idea;
  }
}

app.use(express.json());
app.configure(socketio());
app.configure(express.rest());
app.use("/ideas", new IdeaService());
app.on("connection", conn => app.channel("stream").join(conn));
app.publish(data => app.channel("stream"));

app
  .listen(PORT)
  .on("listening", () => console.log(`Server running on ${PORT}`));
