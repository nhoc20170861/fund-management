import React from "react";
import { UncontrolledTooltip } from "reactstrap";
import Avatar from "@mui/material/Avatar";
import { stringAvatar } from "utils/functions";
import AvatarGroup from "@mui/material/AvatarGroup";

const MemberList = ({ users: userList = [], members = [] }) => {
  // Chuyển đổi các giá trị trong mảng members từ chuỗi sang số
  const memberIds = members.map((member) => parseInt(member, 10));
  const filteredUsers = userList.filter((user) => memberIds.includes(user.id));

  return (
    // Avatar Group

    <AvatarGroup max={4} sx={{ justifyContent: "flex-start" }}>
      {filteredUsers &&
        filteredUsers.map((user, index) => (
          <>
            <a
              className="avatar avatar-sm"
              href="#pablo"
              id={`tooltip${user.id}`}
              onClick={(e) => e.preventDefault()}
            >
              <Avatar {...stringAvatar(user.username || "name")} />
            </a>
            <UncontrolledTooltip delay={0} target={`tooltip${user.id}`}>
              {user.username || "name"}
            </UncontrolledTooltip>
          </>
        ))}
    </AvatarGroup>
  );
};

export default MemberList;
