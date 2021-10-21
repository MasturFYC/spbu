import withSession from "../../lib/session";

export default withSession(async (req, res) => {

  //const user = req.session.get("user");
  //req.session.unset('user');
  //req.session.destroy();
  //delete user.login;
  //delete user.role;
  //req.session.set('user', { ...user, isLoggedIn: false }); // = null;
  req.session.destroy();
  // await req.session.save();
  //console.log(req.session.get("user"));
  res.setHeader("cache-control", "no-store, max-age=0");
  res.status(200).json({ isLoggedIn: false });

});