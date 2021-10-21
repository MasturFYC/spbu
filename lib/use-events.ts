import useSWR from "swr";

export default function useEvents(user: { isLoggedIn: any; }) {
  const { data: events } = useSWR(user?.isLoggedIn && `/api/events`);

  const loadingEvents = events === undefined;

  return { events, loadingEvents };
}