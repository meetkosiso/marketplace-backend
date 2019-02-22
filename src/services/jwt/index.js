

export const jwtSecret = process.env.JWT_SECRET || "SOME hidden key";

// Retrieve token from request header
export const getToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};
