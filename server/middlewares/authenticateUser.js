module.exports = (req,res,next) => {
  if (!req.session.user.admin) {
    return res.status(403).send("You shouldn't be here");
  } else {
    next(); 
  }
}