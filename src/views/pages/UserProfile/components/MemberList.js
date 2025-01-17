import React from "react";
import { UncontrolledTooltip } from "reactstrap";
import Avatar from "@mui/material/Avatar";
import { stringAvatar } from "utils/functions";
import AvatarGroup from "@mui/material/AvatarGroup";

const MemberList = ({ members = [] }) => {
  return (
    // Avatar Group

    <AvatarGroup max={4} sx={{ justifyContent: "flex-start" }}>
      {members &&
        members.map((user, index) => (
          <>
            <a
              className="avatar avatar-sm"
              href="#pablo"
              id={`tooltip-avatar-user-${user.user_id}`}
              onClick={(e) => e.preventDefault()}
            >
              <Avatar {...stringAvatar(user.name || "unknow")} />
            </a>
            <UncontrolledTooltip
              delay={0}
              target={`tooltip-avatar-user-${user.user_id}`}
            >
              {user.name || "unknow"}
            </UncontrolledTooltip>
          </>
        ))}
    </AvatarGroup>
  );
};

export default MemberList;
