import React, {
  Fragment,
  useState,
  useEffect,
  useReducer,
  useRef
} from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle
} from "react-icons/fa";
import Loading from "./Loading";
import Card from "./Card";
import Tooltip from "./Tooltip";

function LanguagesNav({ selected, setLanguage }) {
  const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];

  return (
    <ul className="flex-center">
      {languages.map(language => (
        <li key={language}>
          <button
            className="btn-clear nav-link"
            style={language === selected ? { color: "red" } : null}
            name={language}
            onClick={() => {
              setLanguage(language);
            }}
          >
            {language}
          </button>
        </li>
      ))}
    </ul>
  );
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired
};

function ReposGrid({ repos }) {
  return (
    <ul className="grid space-around">
      {repos.map((repo, index) => {
        const {
          id,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues
        } = repo;
        const { login, avatar_url } = owner;
        return (
          <li key={id}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
                  <Tooltip text="Github username">
                    <FaUser color="rgb(255, 191, 116)" size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color="rgb(255, 215, 0)" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="rgb(129, 195, 245)" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="rgb(241, 138, 147)" size={22} />
                  {open_issues.toLocaleString()} open issues
                </li>
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired
};

function popularReducer(state, action) {
  if (action.type === "success") {
    return {
      ...state,
      [action.language]: action.repos,
      error: null
    };
  } else if (action.type === "error") {
    return {
      ...state,
      error: action.error.message
    };
  } else {
    throw new Error("That action type is not supported");
  }
}

export default function Popular() {
  const [language, setLanguage] = useState("All");

  const fetchedLanguages = useRef([]);

  const [state, dispatch] = useReducer(popularReducer, {
    repos: {},
    error: null
  });

  useEffect(() => {
    if (!fetchedLanguages.current.includes(language)) {
      fetchedLanguages.current.push(language);

      fetchPopularRepos(language)
        .then(repos => dispatch({ type: "success", language, repos }))
        .catch(error => dispatch({ type: "error", error }));
    }
  }, [fetchedLanguages, language]);

  const isLoading = () => {
    return !state[language] && state.error === null;
  };

  return (
    <Fragment>
      <LanguagesNav selected={language} setLanguage={setLanguage} />

      {isLoading() && <Loading />}
      {state.error && <p className="center-text error">{state.error}</p>}
      {state[language] && <ReposGrid repos={state[language]} />}
    </Fragment>
  );
}
