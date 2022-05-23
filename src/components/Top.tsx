/** @format */

import { Component, For } from "solid-js";
import { Link } from "solid-app-router";
import { generateScramble, getScramble, setScramble } from "../state/scramble";
import "./Top.scss";
import { Puzzle, PuzzleType } from "../structures/Puzzle";
import { getPuzzle, setPuzzle } from "../state/puzzle";

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

      <div id="scramble">{getScramble().join(" ")}</div>
      <select
        id="scramble-type"
        onChange={(e) => {
          const val = e.currentTarget.value;

          let type: PuzzleType = "Cube";
          let size = 3;

          switch (val) {
            case "3x3":
            case "3x3bf":
            case "3x3oh":
            case "3x3fm":
            case "3x3ft":
            case "3x3mbf":
              type = "Cube";
              size = 3;
              break;
            case "4x4":
            case "4x4bf":
            case "4x4oh":
              type = "Cube";
              size = 4;
              break;
            case "5x5":
            case "5x5bf":
            case "5x5oh":
              type = "Cube";
              size = 5;
              break;
            case "6x6":
              type = "Cube";
              size = 6;
              break;
            case "7x7":
              type = "Cube";
              size = 7;
              break;
            case "megaminx":
              type = "Megaminx";
              size = 3;
              break;
            case "pyraminx":
              type = "Pyraminx";
              size = 3;
              break;
          }

          setPuzzle(new Puzzle(type, size));

          setScramble(generateScramble(getPuzzle()));
        }}
      >
        <option value="3x3">3x3x3</option>
        <option value="3x3bf">3x3x3 Blindfolded</option>
        <option value="3x3oh">3x3x3 One-handed</option>
        <option value="3x3fm">3x3x3 Fewest Moves</option>
        <option value="3x3ft">3x3x3 With Feet</option>
        <option value="3x3mbf">3x3x3 Multi-Blindfold</option>
        <option value="4x4">4x4x4</option>
        <option value="4x4bf">4x4x4 Blindfolded</option>
        <option value="4x4oh">4x4x4 One-handed</option>
        <option value="5x5">5x5x5</option>
        <option value="5x5bf">5x5x5 Blindfolded</option>
        <option value="5x5oh">5x5x5 One-handed</option>
        <option value="6x6">6x6x6</option>
        <option value="7x7">7x7x7</option>
        <option value="megaminx">Megaminx</option>
        <option value="pyraminx">Pyraminx</option>
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
