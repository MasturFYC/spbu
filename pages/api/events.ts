import withSession from "../../lib/session";
import fetchJson from "../../lib/fetch-json";

export default withSession(async (req, res) => {
  const user = req.session.get("user");

  if (!user?.isLoggedIn) {
    res.status(401).end();
    return;
  }

  const url = '/api/login';

  try {
    // we check that the user exists on GitHub and store some data in session
    const events = await fetchJson(url);
    res.json(events);
  } catch (error) {
    //const { response: fetchResponse } = error;
    res.status(500).json({error: 'Error Login Events'}); //error.message});
  }
});