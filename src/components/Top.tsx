/** @format */

import { Component, For } from "solid-js";
import { Link } from "solid-app-router";
import { getScramble } from "../signal/scramble";
import "./Top.scss";

const pages = ["Timer", "Account"];
const icons = ["fa-cube", "fa-user"];

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

      <div id="scramble">{getScramble().join(" ")}</div>

      <div class="nav">
        <For each={pages}>
          {(page, getIndex) => (
            <Link
              href={page === "Timer" ? "/" : `/${page.toLowerCase()}`}
              class="nav-item"
            >
              <i class={`fa-solid ${icons[getIndex()]}`}></i>
            </Link>
          )}
        </For>
      </div>
      <div class="space"></div>
      <div class="config"></div>
    </div>
  );
};
