// import model from "../models/dbmodels.js"

export const homePage = (req, res) => {
    res.render('index.ejs' );
}

export const room = (req, res) => {
    res.render('createRoom.ejs');
}