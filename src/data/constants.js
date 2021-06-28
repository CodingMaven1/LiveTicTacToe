const prod = {
    url: process.env.REACT_APP_PRODURL,
  };

const dev = {
    url: "http://localhost:5000/",
};

export const config = process.env.REACT_APP_ENV === "production" ? prod : dev