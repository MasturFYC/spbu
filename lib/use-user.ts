import { useEffect } from "react";
import Router from "next/router";
import useSWR, { KeyedMutator } from "swr";
import { iUserLogin } from "../components/interfaces";

type useUserReturnType = {
  user: iUserLogin | undefined;
  mutateUser: KeyedMutator<iUserLogin>;
}

export default function useUser({
  redirectTo = "",
  redirectIfFound = false,
} = {}): useUserReturnType {
  const { data: user, mutate: mutateUser } = useSWR<iUserLogin, (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>>("/api/user");

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
}