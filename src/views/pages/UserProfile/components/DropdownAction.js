import React from "react";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
const DropdownAction = () => {
  return (
    <>
      <UncontrolledDropdown>
        <DropdownToggle
          className="btn-icon-only text-light"
          href="#pablo"
          role="button"
          size="sm"
          color=""
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-ellipsis-v" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-arrow" right>
          <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
            Fund details
          </DropdownItem>
          <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
            Add Member
          </DropdownItem>
          <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
            Add Project
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  );
};
export default DropdownAction;
