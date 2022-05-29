/** @format */

import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Component } from "solid-js";
import { Button } from "../components/Button";
import { auth, signUp } from "../functions/auth";
import API from "../api-client";
import { addNotification } from "../state/notifications";

export const SignIn: Component = () => {
  let signUpEmail = "";
  let signUpUsername = "";
  let signUpPassword = "";
  let signUpConfirmPassword = "";

  let signInEmail = "";
  let signInPassword = "";

  return (
    <div class="signin-page">
      <div class="sign-up">
        <div class="sign-up-form">
          <h1 class="sign-up-form-title">Sign Up</h1>

          <label for="email" class="sign-up-form-input-label">
            Email address
          </label>
          <input
            name="email"
            type="email"
            class="sign-up-form-input"
            placeholder="Enter email"
            onChange={(e) => (signUpEmail = e.currentTarget.value)}
          />

          <label for="username" class="sign-up-form-input-label">
            Username
          </label>
          <input
            name="username"
            type="text"
            class="sign-up-form-input"
            placeholder="Enter username"
            onChange={(e) => (signUpUsername = e.currentTarget.value)}
          />

          <label for="password" class="sign-up-form-input-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            class="sign-up-form-input"
            placeholder="Password"
            onChange={(e) => (signUpPassword = e.currentTarget.value)}
          />

          <label for="password-confirm" class="sign-up-form-input-label">
            Confirm Password
          </label>
          <input
            name="password-confirm"
            type="password"
            class="sign-up-form-input"
            placeholder="Confirm Password"
            onChange={(e) => (signUpConfirmPassword = e.currentTarget.value)}
          />

          <Button
            class="sign-up-form-button"
            onClick={async () => {
              if (signUpPassword !== signUpConfirmPassword) {
                addNotification({
                  type: "error",
                  message: "Passwords do not match"
                });

                return;
              }

              const isValid = await API.users.getNameAvailability(
                signUpUsername
              );

              if (isValid.status !== 200) {
                addNotification({
                  type: "error",
                  message: "Username is invalid or already taken"
                });

                return;
              }

              const user = await signUp(signUpEmail, signUpPassword).catch(
                () => {
                  addNotification({
                    type: "error",
                    message: "Error signing up"
                  });

                  return undefined;
                }
              );

              if (user !== undefined) {
                API.users
                  .create(signUpUsername, signUpEmail, user?.uid)
                  .catch((err) => {
                    console.log(err);

                    addNotification({ type: "error", message: err.message });

                    auth.currentUser?.delete();
                  });
              }
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
      <div class="sign-in">
        <div class="sign-in-form">
          <h1 class="sign-in-form-title">Sign In</h1>

          <label for="email" class="sign-in-form-input-label">
            Email address
          </label>
          <input
            name="email"
            type="email"
            class="sign-in-form-input"
            placeholder="Enter email"
            onChange={(e) => (signInEmail = e.currentTarget.value)}
          />

          <label for="password" class="sign-in-form-input-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            class="sign-in-form-input"
            placeholder="Password"
            onChange={(e) => (signInPassword = e.currentTarget.value)}
          />

          <Button
            class="sign-in-form-button"
            onClick={() => {
              signInWithEmailAndPassword(
                auth,
                signInEmail,
                signInPassword
              ).catch((err: FirebaseError) => {
                console.error(err.code, err.message);

                addNotification({
                  type: "error",
                  message: `Error signing in\n${err.code}\n${err.message}`
                });
              });
            }}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};
