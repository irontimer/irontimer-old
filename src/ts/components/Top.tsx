/** @format */

import { Component, For, Match, Show, Switch } from "solid-js";
import { Link } from "solid-app-router";
import {
  getScramble,
  setAndGenerateScramble,
  setScrambleType
} from "../state/scramble";
import { SCRAMBLE_TYPES } from "../../constants/scramble-type";
import { Button } from "./Button";
import { isTiming } from "./TimerStopwatch";
import { ScrambleType } from "../../types";

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
        <Switch fallback="">
          <Match when={getScramble() === "" && !isTiming()}>
            <Button
              class="generate-scramble-button unselectable"
              onClick={() => setAndGenerateScramble()}
            >
              Generate Scramble
            </Button>
          </Match>
          <Match when={isTiming()}>{""}</Match>
          <Match when={getScramble() !== ""}>{getScramble()}</Match>
        </Switch>
      </div>
      <div id="scramble-type">
        <Show when={!isTiming()}>
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
        </Show>
      </div>

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
