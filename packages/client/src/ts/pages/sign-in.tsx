import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { Button } from "../components/button";
import { signIn, signUp } from "../utils/auth";

export const SignIn: Component = () => {
  const [info, setInfo] = createStore({
    signUp: {
      email: "",
      password: "",
      username: "",
      confirmPassword: ""
    },
    signIn: {
      email: "",
      password: ""
    }
  });

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
            onChange={(e) => setInfo("signUp", "email", e.currentTarget.value)}
          />

          <label for="username" class="sign-up-form-input-label">
            Username
          </label>
          <input
            name="username"
            type="text"
            class="sign-up-form-input"
            placeholder="Enter username"
            onChange={(e) =>
              setInfo("signUp", "username", e.currentTarget.value)
            }
          />

          <label for="password" class="sign-up-form-input-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            class="sign-up-form-input"
            placeholder="Password"
            onChange={(e) =>
              setInfo("signUp", "password", e.currentTarget.value)
            }
          />

          <label for="password-confirm" class="sign-up-form-input-label">
            Confirm Password
          </label>
          <input
            name="password-confirm"
            type="password"
            class="sign-up-form-input"
            placeholder="Confirm Password"
            onChange={(e) =>
              setInfo("signUp", "confirmPassword", e.currentTarget.value)
            }
          />

          <Button
            class="sign-up-form-button"
            onClick={() =>
              signUp(
                info.signUp.email,
                info.signUp.username,
                info.signUp.password,
                info.signUp.confirmPassword
              )
            }
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
            onChange={(e) => setInfo("signIn", "email", e.currentTarget.value)}
          />

          <label for="password" class="sign-in-form-input-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            class="sign-in-form-input"
            placeholder="Password"
            onChange={(e) =>
              setInfo("signIn", "password", e.currentTarget.value)
            }
          />

          <Button
            class="sign-in-form-button"
            onClick={() => signIn(info.signIn.email, info.signIn.password)}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};
