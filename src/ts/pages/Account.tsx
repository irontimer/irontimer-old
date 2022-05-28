/** @format */

import { Navigate } from "solid-app-router";
import { Component, Show } from "solid-js";
import { Button } from "../components/Button";
import { auth } from "../functions/auth";

export const Account: Component = () => {
  return (
    <div class="account-page">
      <Show when={auth.currentUser === null}>
        <Navigate href="/sign-in" />
      </Show>

      <Button
        class="logout-button"
        onClick={() => {
          auth.signOut();

          window.location.reload();
        }}
      >
        Logout
      </Button>
    </div>
  );
};
