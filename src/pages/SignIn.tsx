/** @format */

import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Component } from "solid-js";
import { auth, signUp } from "../functions/auth";
import { createUser } from "../functions/client";
import "./SignIn.scss";

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

          <button
            class="sign-up-form-button"
            onClick={async () => {
              if (signUpPassword !== signUpConfirmPassword) {
                alert("Passwords do not match");

                return;
              }

              const user = await signUp(signUpEmail, signUpPassword).catch(
                () => {
                  alert("Error signing up");

                  return undefined;
                }
              );

              if (user !== undefined) {
                await createUser(signUpEmail, signUpUsername, user.uid);
              }
            }}
          >
            Sign Up
          </button>
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

          <button
            class="sign-in-form-button"
            onClick={() => {
              signInWithEmailAndPassword(
                auth,
                signInEmail,
                signInPassword
              ).catch((err: FirebaseError) => {
                console.error(err.code, err.message);

                alert(`Error signing in\n${err.code}\n${err.message}`);
              });
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
