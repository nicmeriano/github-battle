import React from "react";
import PropTypes from "prop-types";

export default function Card({
  header,
  subheader,
  avatar,
  href,
  name,
  children
}) {
  return (
    <div className={`card`}>
      <img src={avatar} alt={`Avatar for ${name}`} className="avatar" />
      {subheader && <h4 className="center-text">{subheader}</h4>}
      <h5 className="center-text">
        <a href={href} className="link">
          <span className="rank">{header}</span>
          {name}
        </a>
      </h5>
      {children}
    </div>
  );
}

Card.propTypes = {
  header: PropTypes.string.isRequired,
  subheader: PropTypes.string,
  avatar: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
