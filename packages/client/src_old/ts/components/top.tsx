import type { IconName } from "@fortawesome/fontawesome-common-types";
import { Link } from "solid-app-router";
import { Component, For, Match, Switch } from "solid-js";
import { getScramble, setAndGenerateScramble } from "../state/scramble";
import { isSavingSolve } from "../state/solve";
import { isTiming } from "../state/timing";
import { Button } from "./button";
import { Icon } from "./icon";

const pages: Record<string, IconName> = {
  Timer: "cube",
  Account: "user",
  Settings: "cog"
};

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

      <div id="nav">
        <For each={Object.keys(pages)}>
          {(page) => (
            <Link
              href={page === "Timer" ? "/" : `/${page.toLowerCase()}`}
              class="nav-item unselectable"
              aria-label={`Go to ${page}`}
            >
              <Icon icon={pages[page]} />
            </Link>
          )}
        </For>
      </div>
    </div>
  );
};
