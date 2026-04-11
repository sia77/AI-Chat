import ReactGA from "react-ga4";

export const initGA = () => {
    ReactGA.initialize("G-JY07NDVLGY");
}

export const logPageView = (url:string) => {
    ReactGA.send({hitType: "pageview", page: url});
}