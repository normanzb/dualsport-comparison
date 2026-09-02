"use client";

import { useEffect, useRef } from "react";

/**
 * Onchain comments via the Ethereum Comments Protocol.
 *
 * `targetUri` is hardcoded to the live URL rather than read from
 * `window.location`, because the URI is the thread's identity: pointing it at
 * localhost or a project-page path would open a second, empty thread that nobody
 * ever sees again.
 */
const TARGET_URI = "https://bikes.norm.im/";
const EMBED_ORIGIN = "https://embed.ethcomments.xyz";

/**
 * Theme blob generated with the configurator at
 * docs.ethcomments.xyz/integration-options/embed-comments, mapping the widget's
 * tokens onto this site's palette: background #0b0c0e, foreground #eef0f3,
 * secondary #171a1f, border #262a31, muted #9096a0, ring and links #ff7a1a,
 * input #121418, IBM Plex Mono, zero radius, and a zero-size headline: the
 * widget prints its own "Comments" title, which duplicated this section's
 * heading, and the theme is the only place the embed exposes to suppress it.
 *
 * Its light and dark palettes are set to the same dark values on purpose. The
 * iframe follows the visitor's own colour-scheme preference, not the parent
 * page's, so leaving the light palette alone would drop a white widget into a
 * black page for anyone whose OS is set to light.
 */
const THEME =
  "N4IgLgFgpgtlIC5QGMD2AbVAnAzo06AlgOYRj4gBGAhsgNbFaoCuAdgCaIgDEADJb2S94AGhAAzbFEYsOXblCjje4gMw" +
  "gxtNGzABaKO0J6irOvPHiA7NQCM1DSAAOWQjGpYAnvMXK1D567uHrqSWNJMbJwIPPyCwg44UGgcQfI2lnY24glJqCmeI" +
  "VIykd5KKupi7FA4YFjMyGCEAG7w0QriACxdHQ5VNXUNzVCFYcVybeLUk5MOMMxgBiPhslE8AJy8awBs1LwOLqzE5la29" +
  "mKU2FVY8gBMWzfUqjYOF1hXhcjMeBMndg6ErEc8zSNxsHRsAA5-oD5ksxqsFGU-ABfSruMxIKi0BgRcYxARCUQSIq4hE" +
  "%2BcoOLSyPQGIy6EwYngWax-MQBNyeUq%2BCpOFwc4KhZYlNqxQk5ZLsVJtdKZbJiRISoJw0lcimVaq1eqNFreTrdXoa" +
  "gba4aC%2BHmKYW2bzRamlVtDbbXb7AFHH4ss5US5Qa5tO4PJ4vL1YD5fY7u6FA8jS0HgqFiAGR5UrVUo1HE1hR0CSDMA" +
  "MWoMEI6C8mJwHhqsC4AB0QABJABCAFkAAQABXQUAAHk2G3lUNWRE3mIRdDBezhHLQoAPR6xUOPJyA0zhCAAvaoUGiJCj" +
  "LtdcGxhGAOExQAASUBIZD3ADoAKyLsTepjBnDIMJQVi6Rpgdvb1etEA2LeB5HgCp7nqQUYAVeNz3iAsCOGAwQvm%2BH5" +
  "fj%2BJZ-teN7AWIx5nhekGATBabQNQ7DHr%2Bu7RLwOEgHh4GXtRsEdt8oA7v%2BvBXpY2EVrhoH4RBe6wTgh4YVRICc" +
  "RC3G0fRBHXjcd7IkpYioJA3oUFgZGEKG1G0Uwqm6BO7CGIcugtFgjTINQ6BcHsYj6XoRkmcQugQNgq55GA1m2YuabUI4" +
  "jhcNZNn2VAtCNHk3wANqgE01nMP%2BRB0EShDJFwpEWYuAC6oX9KlYANtQHauMwMAAMKedQoFYAA6oQ7CQIgmpTiAxDU" +
  "DgADKjiRdgOAQIQgXRG1ODtjgOC6LOjlhP5zioC0nBiG5qB0Dmig1e4rAugAKhAYR9Rg7AAKo4FENjytgjSHBQ1nEO5k" +
  "CiSAyC7b2mDEKl3mLapGlhYMeRcElRJNBgpVQA2UBeZKXkANJQMWIBA%2BgIO%2BciQA";

/** Nothing renders until the widget reports its height, so start with a usable one. */
const MIN_HEIGHT = 520;

export function Comments() {
  const frame = useRef<HTMLIFrameElement>(null);

  // Their own embedScript.js does this, but it is served off their docs domain.
  // The contract is two lines of postMessage, so we listen for it ourselves
  // rather than take a third-party script on every page load.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== EMBED_ORIGIN) return;
      if (event.data?.type !== "@ecp.eth/sdk/embed/resize") return;
      const height = Number(event.data.height);
      if (!Number.isFinite(height) || height <= 0 || !frame.current) return;
      // no floor here: MIN_HEIGHT is only the pre-message guess, and clamping to
      // it left 300px of dead space under an empty thread
      frame.current.style.height = `${height}px`;
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const src = `${EMBED_ORIGIN}/?targetUri=${encodeURIComponent(TARGET_URI)}&config=${THEME}`;

  return (
    <section className="mt-14 border-t border-hair pt-10 lg:mt-20">
      <h2 className="font-display text-3xl leading-none md:text-4xl">Comments</h2>
      <p className="mt-3 max-w-xl text-[12px] leading-relaxed text-ink-dim">
        Ridden one of these, or spent a winter wrenching on one? What you know from the saddle is
        worth more than any spec sheet on this page. Comments live onchain, so your crypto wallet is
        your identity here: no account, no password, nothing to sign up for.
      </p>
      <iframe
        ref={frame}
        src={src}
        title="Comments"
        loading="lazy"
        className="mt-6 w-full border-none"
        style={{ height: MIN_HEIGHT }}
      />
    </section>
  );
}
