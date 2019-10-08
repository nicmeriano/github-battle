import React, { Fragment, useEffect, useReducer } from "react";
import { battle } from "../utils/api";
import {
  FaCompass,
  FaBriefcase,
  FaUsers,
  FaUserFriends,
  FaUser
} from "react-icons/fa";
import Card from "./Card";
import Loading from "./Loading";
import Tooltip from "./Tooltip";
import PropTypes from "prop-types";
import queryString from "query-string";
import { Link } from "react-router-dom";

function ProfileList({ profile }) {
  return (
    <ul className="card-list">
      <li>
        <FaUser color="rgb(239, 115, 115)" size={22} />
        {profile.name}
      </li>
      {profile.location && (
        <li>
          <Tooltip text="User's location">
            <FaCompass color="rgb(144, 115, 255)" size={22} />
            {profile.location}
          </Tooltip>
        </li>
      )}
      {profile.company && (
        <li>
          <Tooltip text="User's company">
            <FaBriefcase color="#795548" size={22} />
            {profile.company}
          </Tooltip>
        </li>
      )}
      <li>
        <FaUsers color="rgb(129, 195, 245)" size={22} />
        {profile.followers.toLocaleString()} followers
      </li>
      <li>
        <FaUserFriends color="rgb(64, 183, 95)" size={22} />
        {profile.following.toLocaleString()} following
      </li>
    </ul>
  );
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired
};

function battleReducer(state, action) {
  if (action.type === "success") {
    return {
      winner: action.winner,
      loser: action.loser,
      error: null,
      loading: false
    };
  } else if (action.type === "error") {
    return {
      ...state,
      error: action.error.message,
      loading: false
    };
  } else {
    throw new Error(`That action type is not valid`);
  }
}

export default function Results({ location }) {
  const { playerOne, playerTwo } = queryString.parse(location.search);
  const [state, dispatch] = useReducer(battleReducer, {
    winner: null,
    loser: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    battle([playerOne, playerTwo])
      .then(([winner, loser]) => {
        dispatch({ type: "success", winner, loser });
      })
      .catch(error => {
        dispatch({ type: "error", error });
      });
  }, [playerOne, playerTwo]);

  const { winner, loser, error, loading } = state;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return (
    <Fragment>
      <div className="grid space-around container-sm">
        <Card
          header={winner.score === loser.score ? "Tie" : "Winner"}
          subheader={`Score: ${winner.score.toLocaleString()}`}
          avatar={winner.profile.avatar_url}
          href={winner.profile.html_url}
          name={winner.profile.login}
        >
          <ProfileList profile={winner.profile} />
        </Card>
        <Card
          header={winner.score === loser.score ? "Tie" : "Loser"}
          subheader={`Score: ${loser.score.toLocaleString()}`}
          avatar={loser.profile.avatar_url}
          href={loser.profile.html_url}
          name={loser.profile.login}
        >
          <ProfileList profile={loser.profile} />
        </Card>
      </div>
      <Link className="btn btn-dark btn-space" to="/battle">
        Reset
      </Link>
    </Fragment>
  );
}
