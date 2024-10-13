import React from "react";
import { UncontrolledTooltip } from "reactstrap";
const AvatarGroup = () => {
  return (
    <div className="avatar-group">
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id="tooltip731399078"
        onClick={(e) => e.preventDefault()}
      >
        <img
          alt="..."
          className="rounded-circle"
          src={require("assets/img/theme/team-1-800x800.jpg")}
        />
      </a>
      <UncontrolledTooltip delay={0} target="tooltip731399078">
        Ryan Tompson
      </UncontrolledTooltip>
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id="tooltip491083084"
        onClick={(e) => e.preventDefault()}
      >
        <img
          alt="..."
          className="rounded-circle"
          src={require("assets/img/theme/team-2-800x800.jpg")}
        />
      </a>
      <UncontrolledTooltip delay={0} target="tooltip491083084">
        Romina Hadid
      </UncontrolledTooltip>
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id="tooltip528540780"
        onClick={(e) => e.preventDefault()}
      >
        <img
          alt="..."
          className="rounded-circle"
          src={require("assets/img/theme/team-3-800x800.jpg")}
        />
      </a>
      <UncontrolledTooltip delay={0} target="tooltip528540780">
        Alexander Smith
      </UncontrolledTooltip>
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id="tooltip237898869"
        onClick={(e) => e.preventDefault()}
      >
        <img
          alt="..."
          className="rounded-circle"
          src={require("assets/img/theme/team-4-800x800.jpg")}
        />
      </a>
      <UncontrolledTooltip delay={0} target="tooltip237898869">
        Jessica Doe
      </UncontrolledTooltip>
    </div>
  );
};

export default AvatarGroup;
