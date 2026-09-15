<script lang="ts">
  import { asset } from '$app/paths'
  import { onMount } from 'svelte'
  import PackageIcon from '@lucide/svelte/icons/package'
  import PackageOpenIcon from '@lucide/svelte/icons/package-open'
  import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw'
  import LogoMark from '$lib/components/site/LogoMark.svelte'
  import { cn } from '$lib/utils'

  // Interactive CSS 3D model of the big box edition. No WebGL needed:
  // six faces plus a hinged lid rendered with preserve-3d. Pointer drag
  // orbits the model, hovering adds a parallax tilt on a separate
  // wrapper so it never fights the base rotation, double-click or the
  // O key toggles the lid, and arrow keys orbit for keyboard users.
  let { class: className }: { class?: string } = $props()

  const HOME_RX = -14
  const HOME_RY = -22

  let rx = $state(HOME_RX)
  let ry = $state(HOME_RY)
  let open = $state(false)
  let dragging = $state(false)
  let interacted = $state(false)
  let swayEl = $state<HTMLElement>()
  // Browsers without CSS 3D get a static poster instead of broken faces.
  let supports3d = $state(true)

  onMount(() => {
    supports3d =
      CSS.supports('transform-style', 'preserve-3d') && CSS.supports('perspective', '1300px')
  })

  function onPointerDown(e: PointerEvent) {
    // Toolbar buttons handle their own clicks; let them keep the pointer.
    if ((e.target as HTMLElement).closest('.toolbar')) return
    dragging = true
    interacted = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    interacted = true
    if (dragging) {
      ry += e.movementX * 0.45
      rx = Math.min(75, Math.max(-75, rx - e.movementY * 0.45))
      return
    }
    // Parallax tilt: normalized cursor position drives a small offset
    // on the sway wrapper, eased by its CSS transition.
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    swayEl?.style.setProperty('--prx', `${(-ny * 7).toFixed(2)}deg`)
    swayEl?.style.setProperty('--pry', `${(nx * 10).toFixed(2)}deg`)
  }

  function onPointerUp() {
    dragging = false
  }

  function onPointerLeave() {
    dragging = false
    swayEl?.style.setProperty('--prx', '0deg')
    swayEl?.style.setProperty('--pry', '0deg')
  }

  function onKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 24 : 12
    if (e.key === 'ArrowLeft') ry -= step
    else if (e.key === 'ArrowRight') ry += step
    else if (e.key === 'ArrowUp') rx = Math.max(-75, rx - step / 2)
    else if (e.key === 'ArrowDown') rx = Math.min(75, rx + step / 2)
    else if (e.key === 'o' || e.key === 'O') open = !open
    else return
    interacted = true
    e.preventDefault()
  }

  function reset() {
    rx = HOME_RX
    ry = HOME_RY
    open = false
    interacted = true
  }
</script>

<div class={cn('select-none', className)}>
  {#if !supports3d}
    <div class="fallback">
      <img
        src={asset('/store/big-box.webp')}
        alt="Melovian limited edition big box"
        width="300"
        height="400"
        loading="lazy"
      />
      <p class="hint">Your browser lacks CSS 3D support, so this is a still render.</p>
    </div>
  {:else}
    <!-- The stage is a real interactive widget: pointer drag orbits the
       model, double-click opens the lid, and arrow keys plus the O key
       give keyboard users the same controls. role=application is the
       honest role for it. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
    <div
      class={cn('stage', dragging && 'dragging', !interacted && 'idle', open && 'is-open')}
      role="application"
      aria-label="Interactive 3D model of the Melovian limited edition box. Drag or use arrow keys to rotate. Press O or double-click to open and close the lid."
      tabindex="0"
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointercancel={onPointerUp}
      onpointerleave={onPointerLeave}
      ondblclick={() => (open = !open)}
      onkeydown={onKeyDown}
    >
      <div class="scene" aria-hidden="true">
        <div class="sway" bind:this={swayEl}>
          <div class="box" class:open style="--rx: {rx}deg; --ry: {ry}deg">
            <!-- Shell faces -->
            <div class="face back">
              <div class="back-inner">
                <span class="back-stamp">v1.0</span>
                <p class="back-title">MELOVIAN</p>
                <p class="back-tag">Your music library, one app.</p>
                <ul class="back-list">
                  <li>Navidrome and Subsonic servers</li>
                  <li>Local folders, no account needed</li>
                  <li>Listen together and device handoff</li>
                  <li>Desktop, mobile, and web</li>
                </ul>
                <div class="back-contents">
                  <p class="back-contents-title">BOX CONTENTS</p>
                  <p>Install disc, USB drive, numbered sticker</p>
                </div>
                <p class="back-fine">Apache-2.0 · melovian-hq · Made for the shelf</p>
              </div>
            </div>
            <div class="face spine">
              <span class="spine-logo"><LogoMark class="size-5" /></span>
              <span class="spine-text">MELOVIAN · LIMITED EDITION · NUMBERED</span>
            </div>
            <div class="face edge"></div>
            <div class="face top"><span class="top-text">MELOVIAN</span></div>
            <div class="face bottom"></div>

            <!-- Interior: disc on the upper tray, USB along the bottom -->
            <div class="interior">
              <div class="tray-logo" aria-hidden="true"><LogoMark class="size-24" /></div>
              <div class="disc-well"></div>
              <svg class="disc" viewBox="0 0 200 200">
                <defs>
                  <radialGradient id="discBase" cx="42%" cy="34%" r="85%">
                    <stop offset="0%" stop-color="#241d33" />
                    <stop offset="55%" stop-color="#171224" />
                    <stop offset="100%" stop-color="#0b0812" />
                  </radialGradient>
                  <linearGradient id="discMark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#c9a4ff" />
                    <stop offset="1" stop-color="#a468f3" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="97" fill="url(#discBase)" />
                <!-- Fine pressed grooves -->
                <g fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1">
                  <circle cx="100" cy="100" r="93" />
                  <circle cx="100" cy="100" r="88" />
                  <circle cx="100" cy="100" r="83" />
                  <circle cx="100" cy="100" r="78" />
                  <circle cx="100" cy="100" r="73" />
                  <circle cx="100" cy="100" r="68" />
                </g>
                <ellipse
                  cx="72"
                  cy="52"
                  rx="52"
                  ry="16"
                  fill="rgba(255,255,255,0.07)"
                  transform="rotate(-24 72 52)"
                />
                <!-- Printed mark and type -->
                <path
                  fill="url(#discMark)"
                  d="M199.68 839.68 L199.68 184.32 L512.00 498.89 L824.32 184.32 L824.32 839.68 L689.15 839.68 L689.15 367.82 L512.00 656.18 L334.85 367.82 L334.85 839.68 Z"
                  transform="translate(100 78) scale(0.062) translate(-512 -512)"
                />
                <text
                  x="100"
                  y="128"
                  text-anchor="middle"
                  font-size="15"
                  font-weight="800"
                  letter-spacing="4"
                  fill="#f2edfb"
                  font-family="inherit"
                >
                  MELOVIAN
                </text>
                <text
                  x="100"
                  y="144"
                  text-anchor="middle"
                  font-size="7.5"
                  font-weight="600"
                  letter-spacing="2.6"
                  fill="#9b8cc2"
                  font-family="inherit"
                >
                  INSTALL DISC · LIMITED EDITION
                </text>
                <!-- Rim and hub -->
                <circle
                  cx="100"
                  cy="100"
                  r="96.5"
                  fill="none"
                  stroke="rgba(164,104,243,0.55)"
                  stroke-width="1.5"
                />
                <circle cx="100" cy="100" r="27" fill="none" stroke="rgba(255,255,255,0.14)" />
                <circle cx="100" cy="100" r="19" fill="none" stroke="rgba(255,255,255,0.2)" />
                <circle cx="100" cy="100" r="13" fill="#050409" />
                <circle
                  cx="100"
                  cy="100"
                  r="13"
                  fill="none"
                  stroke="rgba(164,104,243,0.5)"
                  stroke-width="1.5"
                />
              </svg>
              <div class="usb">
                <span class="usb-connector"><i></i><i></i></span>
                <span class="usb-body">
                  <LogoMark class="size-4" />
                  <span class="usb-text">MELOVIAN</span>
                </span>
              </div>
            </div>

            <!-- Lid, hinged on the spine edge -->
            <div class="lid">
              <div class="lid-front">
                <div class="cover-texture"></div>
                <div class="cover-glow"></div>
                <div class="cover-logo"><LogoMark class="size-16" /></div>
                <p class="cover-name">MELOVIAN</p>
                <p class="cover-tag">Your music library, one app.</p>
                <p class="cover-edition">LIMITED EDITION</p>
                <div class="cover-eq" aria-hidden="true">
                  <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i
                  ></i>
                </div>
                <p class="cover-foot">DISC + USB INSIDE · NUMBERED COPY</p>
              </div>
              <div class="lid-inside">
                <div class="inside-mark" aria-hidden="true"><LogoMark class="size-12" /></div>
                <p class="inside-title">Thanks for keeping physical media alive.</p>
                <p class="inside-sub">Every box in this run is numbered.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="shadow"></div>
      </div>

      <div class="toolbar">
        <button
          type="button"
          class="tool"
          aria-expanded={open}
          aria-label={open ? 'Close the box' : 'Open the box'}
          title={open ? 'Close the box' : 'Open the box'}
          onclick={(e) => {
            e.stopPropagation()
            open = !open
            interacted = true
          }}
          ondblclick={(e) => e.stopPropagation()}
        >
          {#if open}
            <PackageIcon class="size-4" />
          {:else}
            <PackageOpenIcon class="size-4" />
          {/if}
        </button>
        <button
          type="button"
          class="tool"
          aria-label="Reset view"
          title="Reset view"
          onclick={(e) => {
            e.stopPropagation()
            reset()
          }}
          ondblclick={(e) => e.stopPropagation()}
        >
          <RotateCcwIcon class="size-4" />
        </button>
      </div>
      <p class="hint">Drag to orbit · Double-click opens · Arrow keys · O</p>
    </div>
  {/if}
</div>

<style>
  /* Static poster for browsers without preserve-3d support. */
  .fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem 0 3.5rem;
    background:
      radial-gradient(70% 55% at 50% 38%, rgba(164, 104, 243, 0.14), transparent 70%),
      radial-gradient(50% 30% at 50% 88%, rgba(164, 104, 243, 0.08), transparent 70%);
  }
  .fallback img {
    width: 300px;
    height: auto;
    border-radius: 6px;
    filter: drop-shadow(0 24px 30px rgba(0, 0, 0, 0.35));
  }
  .fallback .hint {
    position: static;
    margin-top: 1.25rem;
    pointer-events: auto;
  }

  /* Stage reserves layout space so the model never shifts content. */
  .stage {
    position: relative;
    padding: 2.5rem 0 3.5rem;
    outline: none;
    touch-action: none;
    cursor: grab;
    background:
      radial-gradient(70% 55% at 50% 38%, rgba(164, 104, 243, 0.14), transparent 70%),
      radial-gradient(50% 30% at 50% 88%, rgba(164, 104, 243, 0.08), transparent 70%);
  }
  .stage.dragging {
    cursor: grabbing;
  }
  .stage:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
    border-radius: var(--radius);
  }

  .scene {
    position: relative;
    width: 300px;
    height: 400px;
    margin: 0 auto;
    perspective: 1300px;
    transition: translate 0.9s cubic-bezier(0.7, 0, 0.25, 1);
  }
  /* An open lid swings left; shift the model so it stays in frame. */
  .is-open .scene {
    translate: 90px 0;
  }

  /* Sway wrapper carries idle animation and hover parallax, so it
     never writes the same transform the drag rotation owns. */
  .sway {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateX(var(--prx, 0deg)) rotateY(var(--pry, 0deg));
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .dragging .sway {
    transition: none;
  }
  .idle .sway {
    animation: sway 9s ease-in-out infinite alternate;
  }
  @keyframes sway {
    from {
      transform: rotateY(-6deg);
    }
    to {
      transform: rotateY(8deg);
    }
  }

  .box {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: rotateX(var(--rx)) rotateY(var(--ry));
    transition: transform 0.18s ease-out;
  }
  .dragging .box {
    transition: none;
  }

  .face {
    position: absolute;
    left: 50%;
    top: 50%;
    background: linear-gradient(160deg, #17141f 0%, #0d0b13 60%, #171320 100%);
    border: 1px solid rgba(164, 104, 243, 0.18);
  }
  .back {
    width: 300px;
    height: 400px;
    margin: -200px 0 0 -150px;
    transform: rotateY(180deg) translateZ(24px);
  }
  .spine {
    width: 48px;
    height: 400px;
    margin: -200px 0 0 -24px;
    transform: rotateY(-90deg) translateZ(150px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 0;
    gap: 12px;
    background: linear-gradient(90deg, #0d0b13, #181226 50%, #0d0b13);
  }
  .edge {
    width: 48px;
    height: 400px;
    margin: -200px 0 0 -24px;
    transform: rotateY(90deg) translateZ(150px);
    background: linear-gradient(90deg, #0d0b13, #151020 50%, #0a0810);
  }
  .top {
    width: 300px;
    height: 48px;
    margin: -24px 0 0 -150px;
    transform: rotateX(90deg) translateZ(200px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #1c1628, #0d0b13);
  }
  .bottom {
    width: 300px;
    height: 48px;
    margin: -24px 0 0 -150px;
    transform: rotateX(-90deg) translateZ(200px);
  }

  .spine-text {
    writing-mode: vertical-rl;
    font-size: 10px;
    letter-spacing: 0.22em;
    color: #b9a3e8;
    font-weight: 600;
  }
  .top-text {
    font-size: 11px;
    letter-spacing: 0.3em;
    color: #8f7db8;
    font-weight: 600;
  }

  /* Back cover */
  .back-inner {
    position: absolute;
    inset: 0;
    padding: 22px;
    display: flex;
    flex-direction: column;
    color: #cfc8e2;
    font-size: 11px;
    background: linear-gradient(160deg, #17131f 0%, #0c0a12 70%);
  }
  .back-title {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.18em;
    color: #ece7f8;
  }
  .back-tag {
    color: #a468f3;
    margin-top: 2px;
    font-size: 11px;
  }
  .back-list {
    margin-top: 16px;
    display: grid;
    gap: 6px;
    list-style: none;
    padding: 0;
  }
  .back-list li::before {
    content: '▸ ';
    color: #a468f3;
  }
  .back-contents {
    margin-top: 16px;
    border-top: 1px solid rgba(164, 104, 243, 0.25);
    padding-top: 10px;
    line-height: 1.5;
  }
  .back-contents-title {
    font-size: 9px;
    letter-spacing: 0.2em;
    color: #8f7db8;
    margin-bottom: 3px;
  }
  .back-stamp {
    position: absolute;
    top: 14px;
    right: 14px;
    padding: 3px 7px;
    border: 1px solid rgba(164, 104, 243, 0.5);
    border-radius: 3px;
    font-size: 9px;
    font-weight: 700;
    color: #a468f3;
    background: rgba(164, 104, 243, 0.08);
  }
  .back-fine {
    margin-top: auto;
    font-size: 8px;
    color: #6f628e;
  }

  /* Interior tray: disc owns the top, USB sits along the bottom. */
  .interior {
    position: absolute;
    inset: 8px;
    transform: translateZ(-6px);
    background:
      radial-gradient(60% 45% at 50% 30%, rgba(164, 104, 243, 0.12), transparent 70%),
      linear-gradient(170deg, #14111c, #0a0910);
    border: 1px solid rgba(164, 104, 243, 0.12);
    border-radius: 4px;
  }
  .tray-logo {
    position: absolute;
    left: 50%;
    bottom: 66px;
    margin-left: -48px;
    color: rgba(164, 104, 243, 0.1);
  }
  .disc-well {
    position: absolute;
    top: 14px;
    left: 50%;
    width: 196px;
    height: 196px;
    margin-left: -98px;
    border-radius: 50%;
    background: radial-gradient(circle, #05040a 52%, #191423 100%);
    box-shadow: inset 0 3px 12px rgba(0, 0, 0, 0.85);
  }
  .disc {
    position: absolute;
    top: 16px;
    left: 50%;
    width: 192px;
    height: 192px;
    margin-left: -96px;
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.55));
  }
  .usb {
    position: absolute;
    bottom: 22px;
    left: 50%;
    margin-left: -62px;
    display: flex;
    align-items: center;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
  }
  .usb-connector {
    width: 30px;
    height: 20px;
    border-radius: 2px 0 0 2px;
    background: linear-gradient(180deg, #d0d0da, #8a8a98 55%, #b0b0bc);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    padding: 4px 0;
  }
  .usb-connector i {
    width: 16px;
    height: 4px;
    border-radius: 1px;
    background: #4a4a56;
  }
  .usb-body {
    width: 94px;
    height: 34px;
    border-radius: 0 7px 7px 0;
    background: linear-gradient(160deg, #2b2238, #151020);
    border: 1px solid rgba(164, 104, 243, 0.45);
    border-left: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: #a468f3;
  }
  .usb-text {
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: #b9a3e8;
  }

  /* Lid: front cover hinged on the spine edge. */
  .lid {
    position: absolute;
    inset: 0;
    transform: translateZ(24px) rotateY(0deg);
    transform-origin: 0% 50%;
    transform-style: preserve-3d;
    transition: transform 0.9s cubic-bezier(0.7, 0, 0.25, 1);
  }
  .open .lid {
    transform: translateZ(24px) rotateY(-115deg);
  }
  .lid-front,
  .lid-inside {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border: 1px solid rgba(164, 104, 243, 0.3);
    overflow: hidden;
  }
  .lid-front {
    background:
      radial-gradient(120% 70% at 50% 100%, rgba(164, 104, 243, 0.32), transparent 60%),
      linear-gradient(165deg, #1a1426 0%, #0d0a14 55%, #1b1226 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 20px 20px;
  }
  .cover-texture {
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.016) 0 1px, transparent 1px 3px),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.016) 0 1px, transparent 1px 3px);
    pointer-events: none;
  }
  .lid-inside {
    transform: rotateY(180deg);
    background:
      radial-gradient(90% 60% at 50% 0%, rgba(164, 104, 243, 0.16), transparent 65%),
      linear-gradient(160deg, #201a30, #121020);
    padding: 26px;
    color: #cfc8e2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .inside-mark {
    color: rgba(164, 104, 243, 0.35);
    margin: 18px 0;
  }
  .inside-title {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    color: #ece7f8;
  }
  .inside-sub {
    margin-top: 10px;
    font-size: 10px;
    color: #8f7db8;
  }

  .cover-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(60% 40% at 50% 30%, rgba(164, 104, 243, 0.22), transparent 70%);
    pointer-events: none;
  }
  .cover-logo {
    margin-top: 30px;
    color: #a468f3;
    filter: drop-shadow(0 0 18px rgba(164, 104, 243, 0.55));
  }
  .cover-name {
    margin-top: 14px;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: 0.28em;
    color: #f2edfb;
    text-indent: 0.28em;
  }
  .cover-tag {
    margin-top: 6px;
    font-size: 11px;
    color: #a89bc9;
  }
  .cover-edition {
    margin-top: 24px;
    padding: 4px 14px;
    border: 1px solid rgba(212, 175, 95, 0.6);
    border-radius: 2px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: #d4af5f;
    text-indent: 0.3em;
    background: rgba(212, 175, 95, 0.06);
  }
  .cover-foot {
    position: absolute;
    bottom: 16px;
    font-size: 8px;
    letter-spacing: 0.18em;
    color: #6f628e;
  }
  .cover-eq {
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 5px;
    height: 34px;
    opacity: 0.55;
  }
  .cover-eq i {
    width: 6px;
    border-radius: 2px 2px 0 0;
    background: linear-gradient(180deg, #a468f3, rgba(164, 104, 243, 0.15));
  }
  .cover-eq i:nth-child(1) {
    height: 30%;
  }
  .cover-eq i:nth-child(2) {
    height: 55%;
  }
  .cover-eq i:nth-child(3) {
    height: 80%;
  }
  .cover-eq i:nth-child(4) {
    height: 45%;
  }
  .cover-eq i:nth-child(5) {
    height: 95%;
  }
  .cover-eq i:nth-child(6) {
    height: 60%;
  }
  .cover-eq i:nth-child(7) {
    height: 35%;
  }
  .cover-eq i:nth-child(8) {
    height: 75%;
  }
  .cover-eq i:nth-child(9) {
    height: 50%;
  }
  .cover-eq i:nth-child(10) {
    height: 85%;
  }
  .cover-eq i:nth-child(11) {
    height: 40%;
  }
  .cover-eq i:nth-child(12) {
    height: 65%;
  }

  .shadow {
    position: absolute;
    left: 50%;
    bottom: -46px;
    width: 260px;
    height: 40px;
    margin-left: -130px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.55), transparent 65%);
    transform: translateZ(-1px);
  }

  /* Floating icon toolbar on the render window. */
  .toolbar {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 6px;
    padding: 5px;
    border-radius: 10px;
    background: color-mix(in oklab, var(--card) 80%, transparent);
    border: 1px solid var(--border);
    backdrop-filter: blur(8px);
  }
  .tool {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 7px;
    color: var(--muted-foreground);
    transition:
      color 0.15s,
      background 0.15s;
  }
  .tool:hover {
    color: var(--foreground);
    background: var(--muted);
  }
  .tool:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }

  .hint {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 11px;
    color: var(--muted-foreground);
    pointer-events: none;
  }

  @media (max-width: 420px) {
    .scene {
      transform: scale(0.78);
      transform-origin: top center;
      margin-bottom: -70px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .idle .sway {
      animation: none;
    }
    .lid,
    .box,
    .sway {
      transition-duration: 0.01s;
    }
  }
</style>
