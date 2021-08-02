import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "./firebase";
const Home = (props) => {
  const [questionInput, setQuestionInput] = useState("");
  const [pollID, setPollID] = useState("");
  //const [questionArray, setQuestionArray] = useState([]);
  const [buttonShow, setButtonShow] = useState(true);
  const [questionShow, setQuestionShow] = useState(true);
  const [completeQuestion, setCompleteQuestion] = useState(true);
  const [answerInput, setAnswerInput] = useState("");
  const [ poll, setPoll] = useState({ Yes: 0, No: 0 });
  const [ active, setActive ] = useState(false);

  const handleAnswerChange = (e) => {
    const { value } = e.target;
    setAnswerInput(value);
  };
  const handleQuestionChange = (e) => {
    const { value } = e.target;
    setQuestionInput(value);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    setQuestionInput(e.target[0].value);
    console.log(questionInput);
    if (questionInput !== "") {
      const dbRef = firebase.database().ref();
      const pollID = dbRef.push([questionInput, poll]).key;
      setQuestionInput("");
      setPollID(pollID);
      setQuestionShow(!questionShow);
      setCompleteQuestion(questionInput);
      setButtonShow(!buttonShow);
    } else {
      setActive(!active);
    }
    // console.log(buttonShow)
  };
  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };
  const handleRemoveClick = (e) => {
    const key = e.target.previousSibling.innerHTML;
    const tempPollObj = poll;
    delete tempPollObj[key];
    setPoll(tempPollObj);
    console.log(poll);
  };
  const handleBackButton = (keyToDelete) => {
    const dbRef = firebase.database().ref();
    dbRef.child(keyToDelete).remove();
    setQuestionInput("");
    setButtonShow(!buttonShow);
    setQuestionShow(!questionShow);
  };
  return (
    <div className="wrapper">
      <header>
        <h1>Voting App</h1>
      </header>
      <main>
        
        {questionShow ? null : (
          <div>
            <p>Question Preview:</p> 
            <p>{completeQuestion}</p>
            <ul>
              {poll.__proto__.constructor.keys(poll).map((item, i) => (
                <li key={i}>
                  <span className="input-label">{item}</span>
                  {<button onClick={handleRemoveClick}>x</button>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(() => {
          if (buttonShow) {
            return (
              <div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
                  libero expedita tenetur commodi voluptates repellat facilis provident
                  odio ea necessitatibus!
                </p>
                <form action="submit" onSubmit={handleQuestionSubmit}>
                  <div className="homeForm">
                    <label htmlFor="userquestionInput"></label>
                    <input
                      type="text"
                      name="userquestionInput"
                      id="userquestionInput"
                      onChange={handleQuestionChange}
                      value={questionInput}
                    />
                    <button type="submit">Create Poll</button>
                  </div>
                </form>
              </div>
            );
          } else {
            return (
              <div>
                <form action="submit" onSubmit={handleAnswerSubmit}>
                  <div>
                    <label htmlFor="userAnswerOptionInput"></label>
                    <input
                      type="text"
                      name="userAnswerOptionInput"
                      id="userAnswerOptionInput"
                      onChange={handleAnswerChange}
                      value={answerInput}
                    />
                    <button type="submit">Add Options</button>
                  </div>
                </form>
                <div className="directions">
                  <button type="button" onClick={() => handleBackButton(pollID)}className="startOverButton">Start Over</button>
                  <Link to={`${pollID}`}>
                    <button className="startPollButton">Start Poll</button>
                  </Link>
                </div>
              </div>
            );
          }
        })()}
        <div className={active ? null : "hide"}>
          <div className="modalBackground">
            <div className="modalContainer">
              <div className="closeButton">
                <button onClick={() => setActive(!active)}> X </button>
              </div>
              <div className="errorMessage">
                <p>Error message will go here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

};

export default Home;
