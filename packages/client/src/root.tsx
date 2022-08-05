// @refresh reload
import { JSX, Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts
} from "solid-start";

export default function Root(): JSX.Element {
  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="theme-color" content="#000000" />
        <Meta
          name="description"
          content="A minimalistic and customizable Rubik's Cube Timing website, built with modern technologies and frequently updated."
        />
        <Meta
          name="keywords"
          content="Rubik's Cube, Timing, Timing Website, Timing App, Rubik's Cube Timing, Rubik's Cube Timing Website, Rubik's Cube Timing App, Rubik's Cube Timing App, Cubing, Cuber, Cubers, Cube Timer, Cube Timer Website, Cube Timing Website, Cube Timer App, Cube Timing App, IronTimer, Iron Timer"
        />
        <Meta name="author" content="Ferotiq" />
        <Link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
        <script
          src="https://kit.fontawesome.com/28f314eb43.js"
          crossorigin="anonymous"
        ></script>
        <Scripts />
      </Head>
      <Body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </Body>
    </Html>
  );
}
