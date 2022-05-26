/** @format */

import { Component, For, Show } from "solid-js";
import { Link } from "solid-app-router";
import {
  getScramble,
  getScrambleType,
  setScrambleType
} from "../state/scramble";
import "./Top.scss";
import { ScrambleType, SCRAMBLE_TYPES } from "../constants/scramble-type";
import { Button } from "./Button";

const pages = ["Timer", "Account", "Settings"];
const icons = ["fa-cube", "fa-user", "fa-cog"];

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

      <div id="scramble">
        {
          <Show
            when={getScramble() !== ""}
            fallback={
              <Button
                class="generate-scramble-button"
                onClick={() => setScrambleType(getScrambleType())}
              >
                Generate Scramble
              </Button>
            }
          >
            {getScramble()}
          </Show>
        }
      </div>
      <select
        id="scramble-type"
        onChange={(e) => {
          const val = e.currentTarget.value as ScrambleType;

          setScrambleType(val);
        }}
      >
        <For each={SCRAMBLE_TYPES}>
          {(type) => <option value={type}>{type}</option>}
        </For>
      </select>

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
