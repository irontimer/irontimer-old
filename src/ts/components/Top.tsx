/** @format */

import { Component, For, Show } from "solid-js";
import { Link } from "solid-app-router";
import {
  generateScramble,
  getScramble,
  getScrambleType,
  setScramble,
  setScrambleType
} from "../state/scramble";

import { ScrambleType, SCRAMBLE_TYPES } from "../../constants/scramble-type";
import { Button } from "./Button";
import { getIsAnimating } from "./TimerStopwatch";

const pages = ["Timer", "Account", "Settings"];
const icons = ["fa-cube", "fa-user", "fa-cog"];

export const Top: Component = () => {
  return (
    <div class="top">
      <div class="logo">
        <div class="icon unselectable">test</div>
        <div class="title">
          <Link href={"/"} class="title-link">
            <h1 class="unselectable">IronTimer</h1>
          </Link>
        </div>
      </div>

      <div class="unselectable" id="scramble">
        {
          <Show
            when={getScramble() !== "" && !getIsAnimating()}
            fallback={
              <Button
                class="generate-scramble-button unselectable"
                onClick={() => setScramble(generateScramble(getScrambleType()))}
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
        class="unselectable"
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
              class="nav-item unselectable"
            >
              <i class={`fa-solid ${icons[getIndex()]}`}></i>
            </Link>
          )}
        </For>
      </div>
    </div>
  );
};
