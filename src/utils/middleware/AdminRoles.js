
export const roles = [
  {
    name: "owner",
    disallowedPaths: [],
  },
  {
    name: "accountant",
    disallowedPaths: ["bookings", "refunds", "withdraws", "trips", "hosts"],
  }
];
