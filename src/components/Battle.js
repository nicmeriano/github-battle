import React, { useState, Fragment, useContext } from "react";
import {
  FaUserFriends,
  FaFighterJet,
  FaTrophy,
  FaTimesCircle
} from "react-icons/fa";
import ThemeContext from "../contexts/theme";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Instructions() {
  const theme = useContext(ThemeContext);
  return (
    <div className="instructions-container">
      <h1 className="center-text header-lg">Instructions</h1>
      <ol className="container-sm grid center-text battle-instructions">
        <li>
          <h3 className="header-sm">Enter two Github users</h3>
          <FaUserFriends className={`bg-${theme}`} color="#727272" size={140} />
        </li>
        <li>
          <h3 className="header-sm">Battle</h3>
          <FaFighterJet className={`bg-${theme}`} color="#727272" size={140} />
        </li>
        <li>
          <h3 className="header-sm">See the winners</h3>
          <FaTrophy
            className={`bg-${theme}`}
            color="rgb(255, 215, 0)"
            size={140}
          />
        </li>
      </ol>
    </div>
  );
}

function PlayerInput({ label, onSubmit }) {
  const theme = useContext(ThemeContext);
  const [username, setUsername] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(username);
  };

  const handleChange = event => {
    setUsername(event.target.value);
  };

  return (
    <form className="column player" onSubmit={handleSubmit}>
      <label htmlFor="username" className="player-label">
        {label}
      </label>
      <div className="row player-inputs">
        <input
          autoComplete="off"
          type="text"
          id="username"
          className={`input-${theme}`}
          value={username}
          placeholder="username"
          onChange={handleChange}
        />
        <button
          className={`btn ${theme === "light" ? "btn-dark" : "btn-light"}`}
          type="submit"
          disabled={!username}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

PlayerInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

function PlayerPreview({ username, onReset, label }) {
  const theme = useContext(ThemeContext);
  return (
    <div className="column player">
      <h3 className="player-label">{label}</h3>
      <div className={`row bg-${theme}`}>
        <div className="player-info">
          <img
            src={`https://github.com/${username}.png?size=200`}
            alt={`Avatar for ${username}`}
            className="avatar-small"
          />
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {username}
          </a>
        </div>
        <button className="btn-clear flex-center" onClick={onReset}>
          <FaTimesCircle color="rgb(194, 57, 42)" size={26} />
        </button>
      </div>
    </div>
  );
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default function Battle() {
  const [players, setPlayers] = useState({
    playerOne: null,
    playerTwo: null
  });

  const handleSubmit = (id, player) => {
    setPlayers(prev => ({
      ...prev,
      [id]: player
    }));
  };

  const handleReset = id => {
    setPlayers(prev => ({
      ...prev,
      [id]: null
    }));
  };

  const { playerOne, playerTwo } = players;

  return (
    <Fragment>
      <Instructions />

      <div className="players-container">
        <h1 className="center-text header-lg">Players</h1>
        <div className="row space-around">
          {playerOne === null ? (
            <PlayerInput
              onSubmit={player => handleSubmit("playerOne", player)}
              label={"Player One"}
            />
          ) : (
            <PlayerPreview
              username={playerOne}
              label="Player One"
              onReset={() => handleReset("playerOne")}
            />
          )}
          {playerTwo === null ? (
            <PlayerInput
              onSubmit={player => handleSubmit("playerTwo", player)}
              label={"Player Two"}
            />
          ) : (
            <PlayerPreview
              username={playerTwo}
              label="Player Two"
              onReset={() => handleReset("playerTwo")}
            />
          )}
        </div>
        {playerOne && playerTwo && (
          <Link
            className="btn btn-dark btn-space"
            to={{
              pathname: "/battle/results",
              search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`
            }}
          >
            Submit
          </Link>
        )}
      </div>
    </Fragment>
  );
}
