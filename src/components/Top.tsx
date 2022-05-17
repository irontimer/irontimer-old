/** @format */

import { Component, For } from "solid-js";
import { Link } from "solid-app-router";
import "./Top.scss";

const pages = ["Timer", "Home", "Account", "Login"];

const icons = [
  "fa-solid fa-cube",
  "fa-solid fa-house",
  "fa-solid fa-user",
  "fa-solid fa-right-to-bracket"
];

export const Top: Component = () => {
  return (
    <div class="top">
      <div class="logo">
        <div class="icon">test</div>
        <div class="title">
          <Link href={"/"} class="title-link">
            <h1>IronTimer</h1>
          </Link>
        </div>
      </div>

      <div class="nav">
        <For each={pages}>
          {(page) => (
            <Link href={`/${page.toLowerCase()}`} class="nav-item">
              <div>
                <i class={icons[pages.indexOf(page)]}></i>
              </div>
            </Link>
          )}
        </For>
      </div>
      <div class="space"></div>
      <div class="config"></div>
    </div>
  );
};
