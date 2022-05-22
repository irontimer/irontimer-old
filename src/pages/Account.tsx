/** @format */

import { Component } from "solid-js";
import { auth } from "../functions/auth";
import "./Account.scss";

export const Account: Component = () => {
  return (
    <div class="account-page">
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
