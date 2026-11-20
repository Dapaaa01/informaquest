// ==========================================
// 12. ENGINE 3D (THREE.JS OBJEK TUNGGAL)
// ==========================================
let scene, camera, renderer, controls;
let singleObjectsMap = {};
let rotatingObjects = [];
let activePartMesh = null;
let threeInitialized = false;

function createSurfaceTex(bg, border, title, sub, fg = "#ffffff") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = border;
  ctx.lineWidth = 14;
  ctx.strokeRect(18, 18, 476, 476);

  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 2;
  for (let i = 40; i < 480; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 24);
    ctx.lineTo(i, 488);
    ctx.stroke();
  }

  ctx.fillStyle = fg;
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, 256, 232);
  if (sub) {
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 24px monospace";
    ctx.fillText(sub, 256, 286);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function buildSingleQuizModels(targetScene) {
  const mSteel = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.78, roughness: 0.24 });
  const mDark = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.45, roughness: 0.48 });
  const mSilver = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.88, roughness: 0.18 });
  const mGold = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.92, roughness: 0.15 });
  const mCopper = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.86, roughness: 0.22 });
  const mPcbGreen = new THREE.MeshStandardMaterial({ color: 0x065f46, metalness: 0.35, roughness: 0.45 });
  const mBlueGlow = new THREE.MeshStandardMaterial({ color: 0x4da2ff, emissive: 0x2563eb, emissiveIntensity: 0.85, roughness: 0.2 });
  const mGreenGlow = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.85, roughness: 0.2 });
  const mRedGlow = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8, roughness: 0.2 });
  const mPurpleGlow = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.85, roughness: 0.2 });
  const mGlass = new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.32, roughness: 0.08 });

  function reg(id, group) {
    group.visible = false;
    singleObjectsMap[id] = group;
    targetScene.add(group);
  }

  // LEVEL 1: HARDWARE
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 2.1), mPcbGreen));
    for (let x = -0.85; x <= 0.85; x += 0.24) {
      for (let z = -0.85; z <= 0.85; z += 0.24) {
        if (Math.abs(x) < 0.25 && Math.abs(z) < 0.25) continue;
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 10), mGold);
        pad.position.set(x, -0.07, z);
        g.add(pad);
      }
    }
    const ihs = new THREE.Mesh(
      new THREE.BoxGeometry(1.62, 0.22, 1.62),
      new THREE.MeshStandardMaterial({ map: createSurfaceTex("#cbd5e1", "#4da2ff", "INTEL / AMD", "24-CORE CPU", "#0f172a"), metalness: 0.85, roughness: 0.2 })
    );
    ihs.position.y = 0.15;
    g.add(ihs);
    reg("l1-cpu", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.85, 0.08), mDark));
    const goldEdge = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.12, 0.09), mGold);
    goldEdge.position.y = -0.45;
    g.add(goldEdge);
    for (let i = 0; i < 8; i++) {
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.12), mSteel);
      chip.position.set(-1.26 + i * 0.36, -0.05, 0);
      g.add(chip);
    }
    const shroud = new THREE.Mesh(
      new THREE.BoxGeometry(3.25, 0.65, 0.22),
      new THREE.MeshStandardMaterial({ map: createSurfaceTex("#1e293b", "#38bdf8", "DDR5 RAM", "6400 MT/s", "#f8fafc"), metalness: 0.8, roughness: 0.25 })
    );
    shroud.position.y = 0.12;
    g.add(shroud);
    const rgb = new THREE.Mesh(new THREE.BoxGeometry(3.26, 0.14, 0.24), mBlueGlow);
    rgb.position.y = 0.48;
    g.add(rgb);
    reg("l1-ram", g);
  }
  {
    const g = new THREE.Group();
    const backplate = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 1.45), mSilver);
    backplate.position.y = 0.36;
    g.add(backplate);
    const heatsink = new THREE.Mesh(new THREE.BoxGeometry(3.35, 0.38, 1.32), mSteel);
    heatsink.position.y = 0.12;
    g.add(heatsink);
    for (let p = -0.25; p <= 0.25; p += 0.25) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.4, 12), mCopper);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0, 0.08, p);
      g.add(pipe);
    }
    const shroud = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.36, 1.48), mDark);
    shroud.position.y = -0.14;
    g.add(shroud);
    [-0.85, 0.85].forEach(fx => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.04, 12, 32), mBlueGlow);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(fx, -0.33, 0);
      g.add(ring);

      const fanHub = new THREE.Group();
      fanHub.position.set(fx, -0.31, 0);
      fanHub.add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16), mSilver));
      for (let b = 0; b < 9; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.1), mSteel);
        const ang = (b / 9) * Math.PI * 2;
        blade.position.set(Math.cos(ang) * 0.28, 0, Math.sin(ang) * 0.28);
        blade.rotation.y = -ang + 0.35;
        fanHub.add(blade);
      }
      rotatingObjects.push({ obj: fanHub, axis: "y", speed: 0.09 });
      g.add(fanHub);
    });
    const pcie = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.16, 0.06), mGold);
    pcie.position.set(-0.55, -0.05, -0.78);
    g.add(pcie);
    reg("l1-gpu", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 2.9, 0.1),
      new THREE.MeshStandardMaterial({ map: createSurfaceTex("#090d16", "#10b981", "MOTHERBOARD", "ATX Z790", "#6ee7b7"), roughness: 0.4 })
    ));
    const socket = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.68, 0.12), mSilver);
    socket.position.set(-0.22, 0.62, 0.08);
    const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.25, 0.25), mSteel);
    vrmTop.position.set(-0.22, 1.15, 0.14);
    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.95, 0.25), mSteel);
    vrmLeft.position.set(-0.82, 0.62, 0.14);
    g.add(socket, vrmTop, vrmLeft);
    for (let r = 0; r < 4; r++) {
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.15, 0.16), r % 2 === 0 ? mBlueGlow : mSteel);
      slot.position.set(0.45 + r * 0.15, 0.62, 0.1);
      g.add(slot);
    }
    const pcieSlot = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.14, 0.18), mSilver);
    pcieSlot.position.set(-0.15, -0.25, 0.1);
    const chipset = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.68, 0.16), mDark);
    chipset.position.set(0.55, -0.85, 0.1);
    g.add(pcieSlot, chipset);
    reg("l1-mobo", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 0.85), mDark));
    const mKey = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.72), mGold);
    mKey.position.x = -1.45;
    const ctrl = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.45), mSilver);
    ctrl.position.x = -0.75;
    g.add(mKey, ctrl);
    [0.1, 0.85].forEach(nx => {
      const nand = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.14, 0.62),
        new THREE.MeshStandardMaterial({ map: createSurfaceTex("#1e1b4b", "#a855f7", "3D NAND", "NVMe 2TB", "#e9d5ff") })
      );
      nand.position.x = nx;
      g.add(nand);
    });
    reg("l1-ssd", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.25, 2.0),
      new THREE.MeshStandardMaterial({ map: createSurfaceTex("#111827", "#fbbf24", "PSU 850W", "80+ GOLD MODULAR", "#fde68a"), metalness: 0.75, roughness: 0.3 })
    ));
    const grill = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 12, 32), mSilver);
    grill.rotation.x = Math.PI / 2;
    grill.position.y = 0.64;
    g.add(grill);
    for (let m = 0; m < 6; m++) {
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.1), mDark);
      port.position.set(-0.7 + (m % 3) * 0.45, m < 3 ? 0.2 : -0.2, 1.02);
      g.add(port);
    }
    reg("l1-psu", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 0.45), mDark));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.06, 14, 36), mBlueGlow);
    ring.position.z = 0.24;
    g.add(ring);
    const rotor = new THREE.Group();
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.36, 20), mSilver);
    hub.rotation.x = Math.PI / 2;
    rotor.add(hub);
    for (let i = 0; i < 9; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.04), mSteel);
      const ang = (i / 9) * Math.PI * 2;
      blade.position.set(Math.cos(ang) * 0.56, Math.sin(ang) * 0.56, 0);
      blade.rotation.z = ang;
      blade.rotation.y = 0.45;
      rotor.add(blade);
    }
    rotatingObjects.push({ obj: rotor, axis: "z", speed: 0.08 });
    g.add(rotor);
    reg("l1-fan", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.8, 2.6), mSteel));
    const glassSide = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.45, 2.25), mGlass);
    glassSide.position.x = 0.86;
    const frontMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 2.65, 0.12),
      new THREE.MeshStandardMaterial({ map: createSurfaceTex("#090d16", "#4da2ff", "AIRFLOW", "MID-TOWER CASE", "#38bdf8") })
    );
    frontMesh.position.z = 1.32;
    g.add(glassSide, frontMesh);
    reg("l1-casing", g);
  }
  {
    const g = new THREE.Group();
    const coin = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 1.25, 0.24, 48),
      new THREE.MeshStandardMaterial({ map: createSurfaceTex("#e2e8f0", "#64748b", "CR2032", "LITHIUM 3V CMOS", "#0f172a"), metalness: 0.9, roughness: 0.15 })
    );
    coin.rotation.x = Math.PI / 2;
    g.add(coin);
    reg("l1-cmos", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.45, 0.95), mSteel));
    const pwrBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24), mBlueGlow);
    pwrBtn.position.set(-0.95, 0.25, 0);
    g.add(pwrBtn);
    [-0.25, 0.25].forEach(ux => {
      const usb = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.22), mBlueGlow);
      usb.position.set(ux, 0.24, 0);
      g.add(usb);
    });
    [0.8, 1.1].forEach((ax, idx) => {
      const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), idx === 0 ? mGreenGlow : mRedGlow);
      jack.position.set(ax, 0.24, 0);
      g.add(jack);
    });
    reg("l1-frontio", g);
  }

  // LEVEL 2: SOFTWARE
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), mBlueGlow));
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.045, 12, 40), mSilver);
    const r2 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.035, 12, 40), mGreenGlow);
    r2.rotation.x = Math.PI / 3;
    rotatingObjects.push({ obj: r1, axis: "y", speed: 0.025 }, { obj: r2, axis: "z", speed: 0.02 });
    g.add(r1, r2);
    reg("l2-kernel", g);
  }
  {
    const g = new THREE.Group();
    const src = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.25), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#0f172a", "#38bdf8", "SOURCE", "int main()", "#7dd3fc") }));
    src.position.x = -1.15;
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.55, 16), mGold);
    arrow.rotation.z = -Math.PI / 2;
    const bin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.25), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#022c22", "#10b981", "BINARY", "01101001", "#6ee7b7") }));
    bin.position.x = 1.15;
    g.add(src, arrow, bin);
    reg("l2-compiler", g);
  }
  {
    const g = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const page = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 1.3), i % 2 === 0 ? mBlueGlow : mSilver);
      page.position.y = -0.75 + i * 0.38;
      g.add(page);
    }
    reg("l2-vmem", g);
  }
  {
    const g = new THREE.Group();
    const root = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.65, 0.25), mGold);
    root.position.y = 0.85;
    const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.52, 0.2), mBlueGlow);
    f1.position.set(-0.9, -0.35, 0);
    const f2 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.52, 0.2), mGreenGlow);
    f2.position.set(0.9, -0.35, 0);
    g.add(root, f1, f2);
    reg("l2-fs", g);
  }
  {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.9, 24), mSilver);
    body.rotation.z = Math.PI / 2;
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.45, 24), mGreenGlow);
    band.rotation.z = Math.PI / 2;
    g.add(body, band);
    reg("l2-driver", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.75, 0.14), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#0f172a", "#4da2ff", "GUI DESKTOP", "WINDOW & ICONS", "#e0f2fe") })));
    reg("l2-gui", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 0.14), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#022c22", "#10b981", ">$ TERMINAL", "sudo systemctl", "#6ee7b7") })));
    reg("l2-cli", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.1, 2.1), mGlass));
    const guest1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), mBlueGlow);
    guest1.position.x = -0.48;
    const guest2 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), mPurpleGlow);
    guest2.position.x = 0.48;
    g.add(guest1, guest2);
    reg("l2-vm", g);
  }
  {
    const g = new THREE.Group();
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.85, 0.22, 64, 16), mGold);
    rotatingObjects.push({ obj: knot, axis: "y", speed: 0.025 });
    g.add(knot);
    reg("l2-scheduler", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.26, 1.75), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#18181b", "#fbbf24", "UEFI BIOS", "BOOT FIRMWARE", "#fde68a") })));
    reg("l2-uefi", g);
  }

  // LEVEL 3: NETWORKING
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.42, 1.55), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#0f172a", "#4da2ff", "ROUTER", "DUAL-BAND WI-FI", "#38bdf8"), metalness: 0.6, roughness: 0.3 })));
    for (let i = 0; i < 4; i++) {
      const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.055, 1.45, 12), mSilver);
      ant.position.set(-0.95 + i * 0.63, 0.85, -0.65);
      g.add(ant);
    }
    reg("l3-router", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.48, 1.35), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#1e293b", "#10b981", "SWITCH", "8-PORT GIGABIT", "#6ee7b7"), metalness: 0.75, roughness: 0.25 })));
    for (let p = 0; p < 8; p++) {
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.08), p % 2 === 0 ? mGreenGlow : mGold);
      port.position.set(-1.18 + p * 0.34, 0, 0.69);
      g.add(port);
    }
    reg("l3-switch", g);
  }
  {
    const g = new THREE.Group();
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.0, 16), mBlueGlow);
    cable.rotation.z = Math.PI / 2;
    cable.position.x = -0.5;
    const plug = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.46, 0.46), mGlass);
    plug.position.x = 0.85;
    for (let pin = 0; pin < 8; pin++) {
      const pGold = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.03), mGold);
      pGold.position.set(1.12, 0.22, -0.17 + pin * 0.048);
      g.add(pGold);
    }
    g.add(cable, plug);
    reg("l3-rj45", g);
  }
  {
    const g = new THREE.Group();
    const jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.8, 20), mGold);
    jacket.rotation.z = Math.PI / 2;
    jacket.position.x = -0.55;
    const cladding = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.3, 20), mSilver);
    cladding.rotation.z = Math.PI / 2;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.95, 20), mBlueGlow);
    core.rotation.z = Math.PI / 2;
    g.add(jacket, cladding, core);
    reg("l3-fiber", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.85, 1.65), mDark));
    for (let u = 0; u < 5; u++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.42, 1.5), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#0f172a", "#4da2ff", `SERVER NODE 0${u + 1}`, "XEON CLOUD", "#93c5fd") }));
      blade.position.set(0, 1.0 - u * 0.5, 0.1);
      g.add(blade);
    }
    reg("l3-server", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.85, 0.28), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#450a0a", "#ef4444", "FIREWALL", "PACKET FILTER", "#fca5a5") })));
    reg("l3-firewall", g);
  }
  {
    const g = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 0.34, 36), mSilver);
    const ledRing = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.045, 12, 32), mBlueGlow);
    ledRing.rotation.x = Math.PI / 2;
    ledRing.position.y = 0.18;
    g.add(disc, ledRing);
    reg("l3-ap", g);
  }
  {
    const g = new THREE.Group();
    const header = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.45, 1.3), mGold);
    header.position.y = 0.52;
    const payload = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.95, 1.3), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#064e3b", "#10b981", "TCP/IP PACKET", "PAYLOAD DATA", "#a7f3d0") }));
    payload.position.y = -0.22;
    g.add(header, payload);
    reg("l3-packet", g);
  }
  {
    const g = new THREE.Group();
    const oct = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 0), mPurpleGlow);
    rotatingObjects.push({ obj: oct, axis: "y", speed: 0.02 });
    g.add(oct);
    reg("l3-dns", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.45, 1.35), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#18181b", "#10b981", "MODEM ONT", "ISP FIBER LINK", "#6ee7b7") })));
    reg("l3-modem", g);
  }

  // LEVEL 4: ALGORITHMS & DATA STRUCTURES
  {
    const g = new THREE.Group();
    const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 0), mGold);
    diamond.scale.set(1.25, 1.25, 0.32);
    g.add(diamond);
    reg("l4-flowchart", g);
  }
  {
    const g = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#0f172a", "#4da2ff", `[${i}]`, `DATA ${i * 10}`, "#38bdf8") }));
      box.position.x = -1.32 + i * 0.66;
      g.add(box);
    }
    reg("l4-array", g);
  }
  {
    const g = new THREE.Group();
    for (let s = 0; s < 5; s++) {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.28, 28), s === 4 ? mRedGlow : mSteel);
      plate.position.y = -0.75 + s * 0.38;
      g.add(plate);
    }
    reg("l4-stack", g);
  }
  {
    const g = new THREE.Group();
    for (let q = 0; q < 5; q++) {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), q === 0 ? mGreenGlow : mBlueGlow);
      node.position.x = -1.3 + q * 0.65;
      g.add(node);
    }
    reg("l4-queue", g);
  }
  {
    const g = new THREE.Group();
    const root = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 20), mGreenGlow);
    root.position.y = 0.85;
    const l1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 20), mBlueGlow);
    l1.position.set(-0.85, 0, 0);
    const r1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 20), mBlueGlow);
    r1.position.set(0.85, 0, 0);
    [[-1.3, -0.8], [-0.4, -0.8], [0.4, -0.8], [1.3, -0.8]].forEach(p => {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), mSilver);
      leaf.position.set(p[0], p[1], 0);
      g.add(leaf);
    });
    g.add(root, l1, r1);
    reg("l4-tree", g);
  }
  {
    const g = new THREE.Group();
    const coords = [[-1.0, 0.7, 0], [1.0, 0.7, 0.2], [0, 0, -0.3], [-0.9, -0.75, 0.2], [0.95, -0.7, -0.2]];
    coords.forEach((c, i) => {
      const v = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), i % 2 === 0 ? mPurpleGlow : mBlueGlow);
      v.position.set(c[0], c[1], c[2]);
      g.add(v);
    });
    reg("l4-graph", g);
  }
  {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.18, 16, 40), mBlueGlow);
    rotatingObjects.push({ obj: ring, axis: "z", speed: 0.035 });
    g.add(ring);
    reg("l4-loop", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.35, 0.38), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#0f172a", "#fbbf24", "AND GATE", "1 AND 0 = 0", "#fde68a") })));
    reg("l4-gate", g);
  }
  {
    const g = new THREE.Group();
    [0.45, 0.85, 1.25, 1.65, 2.05].forEach((h, i) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.38, h, 0.38), i === 4 ? mGreenGlow : mBlueGlow);
      bar.position.set(-1.1 + i * 0.55, h / 2 - 1.0, 0);
      g.add(bar);
    });
    reg("l4-sort", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.85, 0.45), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#1e1b4b", "#a855f7", "HASH TABLE", "O(1) LOOKUP", "#e9d5ff") })));
    reg("l4-hash", g);
  }

  // LEVEL 5: CYBER SECURITY, AI & IoT
  {
    const g = new THREE.Group();
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.14, 14, 28), mGold);
    bow.position.x = -0.85;
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.22, 0.16), mGold);
    shaft.position.x = 0.35;
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.16), mGold);
    t1.position.set(0.75, -0.22, 0);
    const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.42, 0.16), mGold);
    t2.position.set(1.05, -0.26, 0);
    g.add(bow, shaft, t1, t2);
    reg("l5-encrypt", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 1.55), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#064e3b", "#10b981", "ESP32 / ARDUINO", "MICROCONTROLLER", "#a7f3d0") })));
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.16, 0.75), mSilver);
    chip.position.set(-0.35, 0.16, 0);
    g.add(chip);
    reg("l5-mcu", g);
  }
  {
    const g = new THREE.Group();
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.05, 0.18), mBlueGlow);
    const eyeL = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.55, 24), mSilver);
    eyeL.rotation.x = Math.PI / 2;
    eyeL.position.set(-0.62, 0, 0.32);
    const eyeR = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.55, 24), mSilver);
    eyeR.rotation.x = Math.PI / 2;
    eyeR.position.set(0.62, 0, 0.32);
    g.add(pcb, eyeL, eyeR);
    reg("l5-sensor", g);
  }
  {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), mPurpleGlow);
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.045, 12, 36), mBlueGlow);
    rotatingObjects.push({ obj: core, axis: "y", speed: 0.02 }, { obj: orbit, axis: "x", speed: 0.025 });
    g.add(core, orbit);
    reg("l5-ai", g);
  }
  {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.15, 0.45), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#065f46", "#34d399", "2FA LOCK", "OTP VERIFIED", "#ecfdf5") }));
    body.position.y = -0.35;
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.11, 14, 30, Math.PI), mSilver);
    shackle.position.y = 0.25;
    g.add(body, shackle);
    reg("l5-2fa", g);
  }
  {
    const g = new THREE.Group();
    const servoBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.15, 0.75), mSteel);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.16, 0.25), mSilver);
    arm.position.y = 0.68;
    rotatingObjects.push({ obj: arm, axis: "y", speed: 0.045 });
    g.add(servoBox, arm);
    reg("l5-actuator", g);
  }
  {
    const g = new THREE.Group();
    for (let d = 0; d < 3; d++) {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.45, 32), d === 1 ? mSilver : mBlueGlow);
      disk.position.y = -0.58 + d * 0.58;
      g.add(disk);
    }
    reg("l5-db", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.85, 2.0, 0.26), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#450a0a", "#ef4444", "ANTI-PHISHING", "URL GUARD", "#fecaca") })));
    reg("l5-phishing", g);
  }
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.05, 0.25), new THREE.MeshStandardMaterial({ map: createSurfaceTex("#0f172a", "#38bdf8", "BIOMETRIC", "FINGERPRINT ID", "#7dd3fc") })));
    reg("l5-biometric", g);
  }
  {
    const g = new THREE.Group();
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 0.45, 36), mSilver);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.05, 12, 32), mGreenGlow);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.24;
    g.add(hub, ring);
    reg("l5-hub", g);
  }
}

function initThreeJS() {
  if (threeInitialized) return;
  const container = document.getElementById("three-canvas-container");
  const width = container.clientWidth || 480;
  const height = container.clientHeight || 345;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  camera.position.set(0, 1.8, 5.2);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 3.0;
  controls.maxDistance = 8.5;

  scene.add(new THREE.AmbientLight(0xf0f9ff, 1.05));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(4, 7, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x4da2ff, 1.15);
  rimLight.position.set(-5, 3, -5);
  scene.add(rimLight);

  buildSingleQuizModels(scene);
  threeInitialized = true;

  window.addEventListener("resize", () => {
    if (!container.clientWidth) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  animate3D();
}

function animate3D() {
  requestAnimationFrame(animate3D);

  rotatingObjects.forEach(item => {
    item.obj.rotation[item.axis] += item.speed;
  });

  if (activePartMesh) {
    activePartMesh.rotation.y += 0.008;
    activePartMesh.position.y = Math.sin(Date.now() * 0.003) * 0.07;
  }

  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}