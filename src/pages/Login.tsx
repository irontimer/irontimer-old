/** @format */

import { signInWithEmailAndPassword } from "firebase/auth";
import { Component } from "solid-js";
import { auth, signUp } from "../functions/auth";
import { createUser } from "../functions/client";
import "./Login.scss";

export const Login: Component = () => {
  let signUpEmail = "";
  let signUpUsername = "";
  let signUpPassword = "";
  let signUpConfirmPassword = "";

  let signInEmail = "";
  let signInPassword = "";

  return (
    <div class="login-page">
      <div class="sign-up">
        <form
          class="sign-up-form"
          onSubmit={async (e) => {
            e.preventDefault();

            if (signUpPassword !== signUpConfirmPassword) {
              alert("Passwords do not match");

              return;
            }

            const user = await signUp(signUpEmail, signUpPassword).catch(() => {
              alert("Error signing up");

              return undefined;
            });

            if (user !== undefined) {
              await createUser(signUpEmail, signUpUsername, user.uid);
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
            ref={(el) => (signUpEmail = el.value)}
          />

          <label for="username" class="sign-up-form-input-label">
            Username
          </label>
          <input
            name="username"
            type="text"
            class="sign-up-form-input"
            placeholder="Enter username"
            ref={(el) => (signUpUsername = el.value)}
          />

          <label for="password" class="sign-up-form-input-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            class="sign-up-form-input"
            placeholder="Password"
            ref={(el) => (signUpPassword = el.value)}
          />

          <label for="password-confirm" class="sign-up-form-input-label">
            Confirm Password
          </label>
          <input
            name="password-confirm"
            type="password"
            class="sign-up-form-input"
            placeholder="Confirm Password"
            ref={(el) => (signUpConfirmPassword = el.value)}
          />

          <button class="sign-up-form-button">Sign Up</button>
        </form>
      </div>
      <div class="log-in">
        <form
          class="log-in-form"
          onSubmit={(e) => {
            e.preventDefault();

            signInWithEmailAndPassword(auth, signInEmail, signInPassword).catch(
              (err) => {
                console.log(err);

                alert("Error signing in");
              }
            );

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
            ref={(el) => (signInEmail = el.value)}
          />

          <label for="password" class="log-in-form-input-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            class="log-in-form-input"
            placeholder="Password"
            ref={(el) => (signInPassword = el.value)}
          />

          <button class="log-in-form-button">Log In</button>
        </form>
      </div>
    </div>
  );
};
