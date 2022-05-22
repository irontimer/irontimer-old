/** @format */

import { Navigate } from "solid-app-router";
import { Component, Show } from "solid-js";
import { auth } from "../functions/auth";
import "./Account.scss";

export const Account: Component = () => {
  return (
    <div class="account-page">
      <Show when={auth.currentUser === null}>
        <Navigate href="/sign-in" />
      </Show>

      <button
        class="logout-button"
        onClick={() => {
          auth.signOut();

          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};
