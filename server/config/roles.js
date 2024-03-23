const allRoles = {
  User: [],
  VenueOwner: ["PostVenues"],
  Admin: ["ManageUsers", "PostVenues"],
};

const roles = Object.keys(allRoles);
const permissions = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  permissions,
};
