import express from "express";
import bodyParser from "body-parser";

import { connect as mongooseConnect } from "./db/mongoose-connection";
import { version } from "./config";
import Question from "./models/Question";

const app = express();
app.use(bodyParser.json());

app.get("/api/home", function(req, res) {
  res.status(200).send("Welcome to questions server!");
});

app.get("/api/version", function(req, res) {
  res.status(200).send(version);
});

// POST route to register a user
app.post("/api/add_question", async (req, res) => {
  try {
    /*    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();*/
    const { email, name, question, photo } = req.body;
    const q = new Question({ email, name, question, photo });
    await q.save();
    res.status(200).send("You question is add");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error add you question please try again.");
  }
});

app.post("/api/get_questions", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw "email is empty";
    const questions = await Question.find({ email }).exec();
    if (!questions) {
      res.status(401).send("email not found");
    }
    res.status(200).send(questions);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Error get you questions please try again. err ${err}`);
  }
});

app.get("/api/get_all_questions", async (req, res) => {
  try {
    const questions = await Question.find({}).exec();
    if (!questions) {
      res.status(401).send("questions not found");
    }
    res.status(200).send(questions);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Error get you questions please try again. err ${err}`);
  }
});


app.post('/api/add_answer', async (req, res) => {
  try {
    const { _id, email, answer, name, photo } = req.body;
    if(!email) throw "email is empty"
    if(!_id) throw "id is empty"
    const question = await Question.findOne({ _id }).exec()
    if(!question) throw "question not found"
    question.answers.push({
      fromEmail: email,
      answer,
      name,
      photo,
    })
    await question.save()
    res.status(200).send(question);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error add you answer please try again.");
  }
})

app.post('/api/delete_question', async (req, res) => {
  try{
    const { _id } = req.body;
    if(!_id) throw "id is empty"
    await Question.deleteOne({ _id }).exec()
    res.status(200).send("OK");
  } catch(err) {
    console.log(err);
    res.status(500).send("Error add you answer please try again.");
  }
}

/*
app.post("/api/authenticate", async (req, res) => {
  const { email, password } = req.body;
  console.log(`email:${email} password:${password}`);
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      res.status(401).json({
        error: "Incorrect email or password (44)",
      });
      return;
    }
    const same = await user.isCorrectPassword(password);
    if (!same) {
      res.status(401).json({
        error: "Incorrect email or password (56)",
      });
      return;
    }
    const payload = { email };
    const token = jwt.sign(payload, secret, {
      expiresIn: "1h",
    });
    res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal error please try again",
    });
  }
});*/

const connect = async () => {
  try {
    await mongooseConnect();
    let port = process.env.PORT;
    if (!port) {
      port = 3001;
    }
    await app.listen(port);

    console.log("listening on port 3001");
  } catch (err) {
    console.log(err);
  }
};

connect();
