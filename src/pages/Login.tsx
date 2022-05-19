/** @format */

import { signInWithEmailAndPassword } from "firebase/auth";
import { Component } from "solid-js";
import { auth, signUp } from "../functions/auth";
import { createUser } from "../functions/client";
import "./Login.scss";

export const Login: Component = () => {
  return (
    <div class="login-page">
      <div class="sign-up">
        <form
          class="sign-up-form"
          onSubmit={async (e) => {
            e.preventDefault();

            const email = e.currentTarget.email.value as string;
            const username = e.currentTarget.username.value as string;
            const password = e.currentTarget.password.value as string;
            const confirmPassword = e.currentTarget["password-confirm"]
              .value as string;

            if (password !== confirmPassword) {
              alert("Passwords do not match");

              return;
            }

            const user = await signUp(email, password).catch(() => {
              alert("Error signing up");

              return undefined;
            });

            if (user !== undefined) {
              await createUser(email, username, user.uid);
            }

            window.location.reload();
          }}
        >
          <h1 class="sign-up-form-title">Sign Up</h1>

          <label for="email" class="sign-up-form-input-label">
            Email address
          </label>
          <input
            name="email"
            type="email"
            class="sign-up-form-input"
            placeholder="Enter email"
          />

          <label for="username" class="sign-up-form-input-label">
            Username
          </label>
          <input
            name="username"
            type="text"
            class="sign-up-form-input"
            placeholder="Enter username"
          />

          <label for="password" class="sign-up-form-input-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            class="sign-up-form-input"
            placeholder="Password"
          />

          <label for="password-confirm" class="sign-up-form-input-label">
            Confirm Password
          </label>
          <input
            name="password-confirm"
            type="password"
            class="sign-up-form-input"
            placeholder="Confirm Password"
          />

          <button class="sign-up-form-button">Sign Up</button>
        </form>
      </div>
      <div class="log-in">
        <form
          class="log-in-form"
          onSubmit={(e) => {
            e.preventDefault();

            const email = e.currentTarget.email.value as string;
            const password = e.currentTarget.password.value as string;

            signInWithEmailAndPassword(auth, email, password).catch((err) => {
              console.log(err);

              alert("Error signing in");
            });

            e.currentTarget.reset();

            window.location.reload();
          }}
        >
          <h1 class="log-in-form-title">Log In</h1>

          <label for="email" class="log-in-form-input-label">
            Email address
          </label>
          <input
            name="email"
            type="email"
            class="log-in-form-input"
            placeholder="Enter email"
          />

          <label for="password" class="log-in-form-input-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            class="log-in-form-input"
            placeholder="Password"
          />

          <button class="log-in-form-button">Log In</button>
        </form>
      </div>
    </div>
  );
};
