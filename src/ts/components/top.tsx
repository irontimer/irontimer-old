import { Component, For, Match, Show, Switch } from "solid-js";
import { Link } from "solid-app-router";
import { getScramble, setAndGenerateScramble } from "../state/scramble";
import { SCRAMBLE_TYPES, ScrambleType } from "../../constants/scramble-type";
import { Button } from "./button";
import { isTiming } from "../state/timing";
import { setCurrentSession } from "../state/session";
import { isSavingSolve } from "../state/solve";
import { Icon } from "./icon";

const pages = ["Timer", "Account", "Settings"];
const icons = ["cube", "user", "cog"];

export const Top: Component = () => {
  const generateScrambleButton = (
    <Button
      class="generate-scramble-button unselectable"
      onClick={() => setAndGenerateScramble()}
    >
      Generate Scramble
    </Button>
  );

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
        <Switch fallback={generateScrambleButton}>
          <Match when={isSavingSolve()}>Loading...</Match>
          <Match when={isTiming()}>{""}</Match>
          <Match when={getScramble() === ""}>{generateScrambleButton}</Match>
          <Match when={getScramble() !== ""}>{getScramble()}</Match>
        </Switch>
      </div>
      <div id="scramble-type">
        <Show when={!isTiming()}>
          <select
            id="scramble-type-select"
            class="unselectable"
            onChange={(e) => {
              const val = e.currentTarget.value as ScrambleType;

              setCurrentSession("scrambleType", val);
            }}
          >
            <For each={SCRAMBLE_TYPES}>
              {(type) => <option value={type}>{type}</option>}
            </For>
          </select>
        </Show>
      </div>

      <div id="nav">
        <For each={pages}>
          {(page, getIndex) => (
            <Link
              href={page === "Timer" ? "/" : `/${page.toLowerCase()}`}
              class="nav-item unselectable"
              aria-label={`Go to ${page}`}
            >
              <Icon icon={icons[getIndex()]} />
            </Link>
          )}
        </For>
      </div>
    </div>
  );
};
