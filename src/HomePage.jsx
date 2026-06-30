import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, Train, Cpu, Radio, Zap, BarChart3,
  CheckCircle2, ArrowRight, ChevronDown, Activity, AlertTriangle,
  Lock, Eye, Clock, Star, Menu, X, Play, TrendingUp,
  ExternalLink, GitBranch, Share2, Database, Globe
} from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return y;
}

function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Realistic Train Control Simulation ──────────────────────────────────── */

const CORRIDOR = {
  totalKm: 48,
  stations: [
    { id: 'NDLS', km: 0,   pct: 3,  name: 'New Delhi',    platform: 'P1' },
    { id: 'FDB',  km: 8.5, pct: 18, name: 'Faridabad',    platform: 'P2' },
    { id: 'PWL',  km: 18,  pct: 38, name: 'Palwal',       platform: 'P1-P4' },
    { id: 'KSV',  km: 29,  pct: 62, name: 'Kosi Kalan',   platform: 'P1' },
    { id: 'MTJ',  km: 38,  pct: 80, name: 'Mathura Jn',   platform: 'P2' },
    { id: 'AGC',  km: 48,  pct: 97, name: 'Agra Cantt',   platform: 'P1-P3' },
  ],
  signals: [
    { km: 4,  pct: 9 },
    { km: 13, pct: 28 },
    { km: 23, pct: 49 },
    { km: 34, pct: 72 },
    { km: 43, pct: 90 },
  ],
};

const MAX_SPEED = 120; // km/h
const ACCEL = 0.8;     // km/h per tick
const BRAKE_DECEL = 1.6;
const EBRAKE_DECEL = 3.2;
const TICK_MS = 60;

function useRealisticSim() {
  const [state, setState] = useState({
    trains: [
      { id: '1042', name: 'Rajdhani Exp', line: 1, x: 5,  dir: 1,  speed: 0, targetSpeed: MAX_SPEED, color: '#22c55e', braking: false, ebrake: false, atStation: 'NDLS', dwellTicks: 40, distKm: 0,   throttle: 100 },
      { id: '2087', name: 'Shatabdi Exp', line: 1, x: 92, dir: -1, speed: 0, targetSpeed: MAX_SPEED, color: '#ef4444', braking: false, ebrake: false, atStation: 'AGC', dwellTicks: 40, distKm: 48,  throttle: 100 },
      { id: '3156', name: 'Duronto Exp',  line: 2, x: 15, dir: 1,  speed: 0, targetSpeed: MAX_SPEED, color: '#3b82f6', braking: false, ebrake: false, atStation: 'FDB', dwellTicks: 60, distKm: 8.5, throttle: 100 },
    ],
    risk: 4,
    phase: 'clear',
    guardianMode: 'MONITORING',
    signals: CORRIDOR.signals.map(s => ({ ...s, state: 'green' })),
    events: [
      { t: Date.now(), msg: 'SYSTEM INIT — AI Guardian v3.2 online', lvl: 'sys', code: 'SYS-001' },
      { t: Date.now() - 1000, msg: 'All corridor signals: GREEN', lvl: 'ok', code: 'SIG-100' },
    ],
    clock: new Date(),
    uptime: 0,
  });

  const tickRef = useRef(0);
  const prevPhaseRef = useRef('clear');

  useEffect(() => {
    const iv = setInterval(() => {
      tickRef.current++;
      const tick = tickRef.current;

      setState(prev => {
        const next = { ...prev, uptime: prev.uptime + 1, clock: new Date() };

        // Physics step for each train
        let updatedTrains = prev.trains.map(t => {
          let train = { ...t };

          // Station dwell
          if (train.dwellTicks > 0) {
            train.dwellTicks--;
            train.speed = 0;
            train.atStation = train.dwellTicks > 0 ? train.atStation : null;
            return train;
          }

          // Calculate distance between L1 trains
          const otherL1 = prev.trains.find(o => o.line === 1 && o.id !== train.id);
          let separationPct = otherL1 ? Math.abs(train.x - otherL1.x) : 100;
          let approaching = otherL1 && ((train.dir > 0 && otherL1.x > train.x && otherL1.dir < 0) ||
                                         (train.dir < 0 && otherL1.x < train.x && otherL1.dir > 0) ||
                                         separationPct < 20);

          // AI speed management
          let targetSpeed = MAX_SPEED;
          train.braking = false;
          train.ebrake = false;

          if (train.line === 1 && approaching) {
            if (separationPct < 10) {
              targetSpeed = 0;
              train.ebrake = true;
              train.braking = true;
            } else if (separationPct < 20) {
              targetSpeed = 25;
              train.braking = true;
            } else if (separationPct < 35) {
              targetSpeed = 60;
              train.braking = true;
            }
          }

          // Station approach braking
          const nextStation = CORRIDOR.stations.find(s => {
            if (train.dir > 0) return s.pct > train.x + 2 && s.pct < train.x + 15;
            return s.pct < train.x - 2 && s.pct > train.x - 15;
          });

          if (nextStation && !train.atStation) {
            const distToStation = Math.abs(train.x - nextStation.pct);
            if (distToStation < 5) {
              targetSpeed = 0;
              train.braking = true;
            } else if (distToStation < 12) {
              targetSpeed = Math.min(targetSpeed, 40);
              train.braking = true;
            }
          }

          train.targetSpeed = targetSpeed;

          // Physics: acceleration / deceleration
          if (train.speed < targetSpeed) {
            train.speed = Math.min(targetSpeed, train.speed + ACCEL);
          } else if (train.speed > targetSpeed) {
            const decel = train.ebrake ? EBRAKE_DECEL : BRAKE_DECEL;
            train.speed = Math.max(targetSpeed, train.speed - decel);
          }

          // Position update
          const pctPerTick = (train.speed / MAX_SPEED) * 0.45;
          train.x += train.dir * pctPerTick;
          train.distKm += pctPerTick * 0.48;
          train.throttle = targetSpeed > 0 ? Math.round((train.speed / MAX_SPEED) * 100) : 0;

          // Check station arrival
          CORRIDOR.stations.forEach(s => {
            if (Math.abs(train.x - s.pct) < 1.5 && train.speed < 5 && !train.atStation) {
              train.atStation = s.id;
              train.dwellTicks = 30 + Math.floor(Math.random() * 40);
              train.speed = 0;
            }
          });

          // Boundary bounce
          if (train.x >= 98) { train.x = 97; train.dir = -1; train.speed = 0; }
          if (train.x <= 2)  { train.x = 3;  train.dir = 1;  train.speed = 0; }

          return train;
        });

        // Risk calculation
        const l1Trains = updatedTrains.filter(t => t.line === 1);
        const sep = l1Trains.length === 2 ? Math.abs(l1Trains[0].x - l1Trains[1].x) : 100;
        let newRisk, newPhase, newGuardian;

        if (sep < 10) {
          newRisk = 85 + Math.round(Math.random() * 12);
          newPhase = 'danger';
          newGuardian = 'E-BRAKE';
        } else if (sep < 20) {
          newRisk = 55 + Math.round(Math.random() * 15);
          newPhase = 'warning';
          newGuardian = 'SPEED CAP';
        } else if (sep < 35) {
          newRisk = 22 + Math.round(Math.random() * 10);
          newPhase = 'caution';
          newGuardian = 'WATCHING';
        } else {
          newRisk = 2 + Math.round(Math.random() * 6);
          newPhase = 'clear';
          newGuardian = 'MONITORING';
        }

        // Signal states
        const updatedSignals = CORRIDOR.signals.map(sig => {
          const nearTrain = updatedTrains.find(t => Math.abs(t.x - sig.pct) < 8);
          if (nearTrain && nearTrain.braking && nearTrain.ebrake) return { ...sig, state: 'red' };
          if (nearTrain && nearTrain.braking) return { ...sig, state: 'yellow' };
          return { ...sig, state: 'green' };
        });

        // Event logging
        let newEvents = [...prev.events];
        if (newPhase !== prevPhaseRef.current) {
          prevPhaseRef.current = newPhase;
          const eventMap = {
            danger:  { msg: 'EMERGENCY — Auto-brake deployed, trains halting', lvl: 'danger', code: 'EMG-001' },
            warning: { msg: 'PROXIMITY ALERT — Speed restricted to 25 km/h', lvl: 'warn', code: 'PRX-042' },
            caution: { msg: 'Advisory — Trains approaching, monitoring gap', lvl: 'caution', code: 'ADV-019' },
            clear:   { msg: 'Corridor clear — Normal operations resumed', lvl: 'ok', code: 'CLR-000' },
          };
          const ev = eventMap[newPhase];
          newEvents = [{ t: Date.now(), ...ev }, ...newEvents].slice(0, 6);
        }

        // Random telemetry events
        if (tick % 120 === 0) {
          const randomMsgs = [
            { msg: `Signal ${updatedSignals[Math.floor(Math.random() * 5)].km}km — aspect verified`, lvl: 'sys', code: 'SIG-V' },
            { msg: `Track circuit ${Math.floor(Math.random() * 12) + 1} — integrity OK`, lvl: 'sys', code: 'TRK-CHK' },
            { msg: `Balise read confirmed — position calibrated`, lvl: 'ok', code: 'BAL-001' },
            { msg: `ATP supervision: all trains within speed envelope`, lvl: 'ok', code: 'ATP-OK' },
          ];
          const rm = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
          newEvents = [{ t: Date.now(), ...rm }, ...newEvents].slice(0, 6);
        }

        return {
          ...next,
          trains: updatedTrains,
          risk: newRisk,
          phase: newPhase,
          guardianMode: newGuardian,
          signals: updatedSignals,
          events: newEvents,
        };
      });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, []);

  return state;
}

/* Sub-components */

function SignalIndicator({ signal }) {
  const colors = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };
  return (
    <div className="rtc-signal" style={{ left: `${signal.pct}%` }} title={`Signal ${signal.km}km`}>
      <div className="rtc-signal-post" />
      <div
        className="rtc-signal-head"
        style={{
          background: colors[signal.state],
          boxShadow: `0 0 6px ${colors[signal.state]}88, 0 0 12px ${colors[signal.state]}44`,
        }}
      />
    </div>
  );
}

function TrainMarker({ train }) {
  const stationName = train.atStation
    ? CORRIDOR.stations.find(s => s.id === train.atStation)?.name
    : null;
  return (
    <motion.div
      className={`rtc-train ${train.ebrake ? 'rtc-train--ebrake' : train.braking ? 'rtc-train--braking' : ''}`}
      style={{
        left: `${train.x}%`,
        '--train-color': train.color,
      }}
      animate={{ left: `${train.x}%` }}
      transition={{ duration: 0.06, ease: 'linear' }}
    >
      <div className="rtc-train-body" style={{ background: train.color }}>
        <span style={{ display: 'flex', transform: `scaleX(${train.dir > 0 ? 1 : -1})` }}>
          <Train size={12} color="#fff" strokeWidth={2.5} />
        </span>
      </div>
      <div className="rtc-train-tag">
        <span className="rtc-train-id">{train.id}</span>
        {train.speed > 0 && <span className="rtc-train-speed">{Math.round(train.speed)}</span>}
        {train.atStation && <span className="rtc-train-dwell">● STOP</span>}
      </div>
      {train.ebrake && (
        <motion.div
          className="rtc-ebrake-ring"
          style={{ borderColor: train.color }}
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
      {stationName && (
        <div className="rtc-train-station-label">{stationName}</div>
      )}
    </motion.div>
  );
}

function SpeedGauge({ speed, maxSpeed, label, color, braking, ebrake }) {
  const pct = Math.min(100, (speed / maxSpeed) * 100);
  const speedZone = speed > 90 ? 'high' : speed > 40 ? 'mid' : 'low';
  return (
    <div className="rtc-gauge">
      <div className="rtc-gauge-header">
        <div className="rtc-gauge-dot" style={{ background: color }} />
        <span className="rtc-gauge-label">{label}</span>
        {ebrake && <span className="rtc-badge rtc-badge--danger">E-BRK</span>}
        {!ebrake && braking && <span className="rtc-badge rtc-badge--warn">BRK</span>}
      </div>
      <div className="rtc-gauge-value">
        <motion.span
          key={Math.round(speed)}
          initial={{ opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rtc-gauge-num"
        >
          {Math.round(speed)}
        </motion.span>
        <span className="rtc-gauge-unit">km/h</span>
      </div>
      <div className="rtc-gauge-bar-wrap">
        <div className="rtc-gauge-bar-bg">
          <motion.div
            className={`rtc-gauge-bar-fill rtc-gauge-bar-fill--${speedZone}`}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.15 }}
            style={{ background: color }}
          />
        </div>
        <div className="rtc-gauge-bar-marks">
          <span>0</span><span>40</span><span>80</span><span>120</span>
        </div>
      </div>
    </div>
  );
}

function LiveSim() {
  const sim = useRealisticSim();
  const { trains, risk, phase, guardianMode, signals, events, clock, uptime } = sim;

  const l1Trains = trains.filter(t => t.line === 1);
  const l2Trains = trains.filter(t => t.line === 2);

  const phaseColors = {
    danger:  { fg: '#ef4444', bg: '#fef2f2', border: '#fca5a5', glow: 'rgba(239,68,68,0.08)' },
    warning: { fg: '#b45309', bg: '#fffbeb', border: '#fde047', glow: 'rgba(217,119,6,0.06)' },
    caution: { fg: '#c2410c', bg: '#fff7ed', border: '#fed7aa', glow: 'rgba(249,115,22,0.05)' },
    clear:   { fg: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', glow: 'rgba(22,163,74,0.04)' },
  };
  const pc = phaseColors[phase] || phaseColors.clear;

  const sep = l1Trains.length === 2 ? Math.abs(l1Trains[0].x - l1Trains[1].x) : 100;
  const gapKm = (sep * 0.48).toFixed(1);

  const formatTime = d => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const formatUptime = s => { const m = Math.floor(s * TICK_MS / 60000); const ss = Math.floor((s * TICK_MS % 60000) / 1000); return `${m}m ${ss}s`; };

  return (
    <div className="rtc-panel" style={{ borderColor: pc.border, boxShadow: `0 0 40px ${pc.glow}` }}>

      {/* ── Top Bar ── */}
      <div className="rtc-topbar">
        <div className="rtc-topbar-left">
          <span className={`rtc-live-beacon rtc-live-beacon--${phase}`} />
          <span className="rtc-topbar-title">UNDISCOVEREDPATH CONTROL CENTRE</span>
          <span className="rtc-topbar-sep">|</span>
          <span className="rtc-topbar-sub">AI-POWERED TRAIN PROTECTION</span>
        </div>
        <div className="rtc-topbar-right">
          <span className="rtc-topbar-clock">{formatTime(clock)}</span>
          <span className="rtc-topbar-uptime">↑ {formatUptime(uptime)}</span>
        </div>
      </div>

      {/* ── Status Strip ── */}
      <div className="rtc-status-strip" style={{ background: pc.bg, borderColor: pc.border }}>
        <div className="rtc-status-left">
          <motion.span
            className="rtc-status-phase"
            style={{ color: pc.fg }}
            animate={phase === 'danger' ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ● {phase.toUpperCase()}
          </motion.span>
          <span className="rtc-status-guardian" style={{ color: pc.fg }}>
            <ShieldAlert size={12} /> {guardianMode}
          </span>
        </div>
        <div className="rtc-status-right">
          <span className="rtc-status-risk-label">RISK INDEX</span>
          <div className="rtc-mini-risk-bar">
            <motion.div
              className="rtc-mini-risk-fill"
              animate={{ width: `${risk}%`, background: pc.fg }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.span className="rtc-status-risk-val" style={{ color: pc.fg }}>
            {risk}%
          </motion.span>
        </div>
      </div>

      {/* ── Track Schematic ── */}
      <div className="rtc-schematic">
        {/* Line 1 */}
        <div className="rtc-track-row">
          <div className="rtc-track-label">
            <span className="rtc-track-id">L1</span>
            <span className="rtc-track-name">Main Line</span>
          </div>
          <div className="rtc-track-canvas">
            {/* km markers */}
            {[0, 10, 20, 30, 40, 48].map(km => (
              <div key={km} className="rtc-km-mark" style={{ left: `${(km / 48) * 94 + 3}%` }}>
                <div className="rtc-km-tick" />
                <span className="rtc-km-num">{km}</span>
              </div>
            ))}
            {/* Track bed */}
            <div className="rtc-trackbed">
              <div className="rtc-rail rtc-rail--top" />
              <div className="rtc-ballast">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className="rtc-tie" />
                ))}
              </div>
              <div className="rtc-rail rtc-rail--bot" />
            </div>
            {/* Signals */}
            {signals.map((s, i) => <SignalIndicator key={i} signal={s} />)}
            {/* Stations */}
            {CORRIDOR.stations.map(st => (
              <div key={st.id} className="rtc-station" style={{ left: `${st.pct}%` }}>
                <div className="rtc-station-platform" />
                <span className="rtc-station-id">{st.id}</span>
              </div>
            ))}
            {/* Gap zone */}
            {phase !== 'clear' && l1Trains.length === 2 && (
              <motion.div
                className={`rtc-gap-zone rtc-gap-zone--${phase}`}
                style={{
                  left: `${Math.min(l1Trains[0].x, l1Trains[1].x)}%`,
                  width: `${Math.abs(l1Trains[0].x - l1Trains[1].x)}%`,
                }}
                animate={phase === 'danger' ? { opacity: [0.3, 0.7, 0.3] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
            {/* Trains */}
            {l1Trains.map(t => <TrainMarker key={t.id} train={t} />)}
          </div>
        </div>

        {/* Line 2 */}
        <div className="rtc-track-row">
          <div className="rtc-track-label">
            <span className="rtc-track-id">L2</span>
            <span className="rtc-track-name">Loop</span>
          </div>
          <div className="rtc-track-canvas">
            <div className="rtc-trackbed">
              <div className="rtc-rail rtc-rail--top" />
              <div className="rtc-ballast">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className="rtc-tie" />
                ))}
              </div>
              <div className="rtc-rail rtc-rail--bot" />
            </div>
            {CORRIDOR.stations.filter(s => ['NDLS','PWL','AGC'].includes(s.id)).map(st => (
              <div key={st.id} className="rtc-station" style={{ left: `${st.pct}%` }}>
                <div className="rtc-station-platform" />
                <span className="rtc-station-id">{st.id}</span>
              </div>
            ))}
            {l2Trains.map(t => <TrainMarker key={t.id} train={t} />)}
          </div>
        </div>
      </div>

      {/* ── Bottom Grid: Gauges + Events ── */}
      <div className="rtc-bottom-grid">

        {/* Gauges */}
        <div className="rtc-gauges">
          {trains.map(t => (
            <SpeedGauge
              key={t.id}
              speed={t.speed}
              maxSpeed={MAX_SPEED}
              label={`${t.id} ${t.name}`}
              color={t.color}
              braking={t.braking}
              ebrake={t.ebrake}
            />
          ))}
        </div>

        {/* Event Log */}
        <div className="rtc-eventlog">
          <div className="rtc-eventlog-header">
            <Activity size={11} /> SYSTEM LOG
          </div>
          <div className="rtc-eventlog-list">
            <AnimatePresence initial={false}>
              {events.slice(0, 5).map(ev => (
                <motion.div
                  key={ev.t + ev.code}
                  className={`rtc-evt rtc-evt--${ev.lvl}`}
                  initial={{ opacity: 0, x: -8, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="rtc-evt-time">{new Date(ev.t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                  <span className="rtc-evt-code">[{ev.code}]</span>
                  <span className="rtc-evt-msg">{ev.msg}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Footer Bar ── */}
      <div className="rtc-footer">
        <div className="rtc-foot-item"><Train size={11} /> <strong>{trains.length}</strong> Active</div>
        <div className="rtc-foot-sep" />
        <div className="rtc-foot-item"><Radio size={11} /> Gap: <strong>{gapKm} km</strong></div>
        <div className="rtc-foot-sep" />
        <div className="rtc-foot-item"><ShieldAlert size={11} /> Guardian: <strong style={{ color: pc.fg }}>{guardianMode}</strong></div>
        <div className="rtc-foot-sep" />
        <div className="rtc-foot-item"><Cpu size={11} /> ATP/ETCS L2</div>
      </div>
    </div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────────────── */
function Navbar({ onLaunch }) {
  const scrollY = useScrollY();
  const [open, setOpen] = useState(false);
  const scrolled = scrollY > 40;

  const go = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className={`pf-nav ${scrolled ? 'pf-nav--scrolled' : ''}`}>
      <div className="pf-nav-inner">
        <div className="pf-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="pf-logo-icon" style={{ background: 'transparent' }}>
            <img src="https://t3.ftcdn.net/jpg/04/32/54/24/360_F_432542454_kfzQHjWPgdi4sx9EfXqOLPzSXFiJBf8l.jpg" alt="UNDISCOVEREDPATH Logo" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
          </div>
          <span className="pf-logo-text">UNDISCOVEREDPATH</span>
        </div>

        <div className={`pf-links ${open ? 'pf-links--open' : ''}`}>
          {['features', 'how-it-works', 'stats', 'testimonials'].map(id => (
            <button key={id} className="pf-link" onClick={() => go(id)}>
              {id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
          <div className="pf-nav-divider" />
          <button className="pf-nav-btn" onClick={onLaunch} id="nav-launch-btn">
            Open Dashboard <ArrowRight size={14} />
          </button>
        </div>

        <button className="pf-burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}

/* ─── Feature Card ────────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, description, accent, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className="fc-card"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3 }}
    >
      <div className="fc-icon-wrap" style={{ background: accent + '14' }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <h3 className="fc-title">{title}</h3>
      <p className="fc-desc">{description}</p>
      <div className="fc-arrow">
        <ArrowRight size={14} />
      </div>
    </motion.div>
  );
}

/* ─── Stat ────────────────────────────────────────────────────────────────── */
function StatItem({ value, suffix, label, icon, accent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="st-item"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="st-icon" style={{ color: accent }}>{icon}</div>
      <div className="st-num" style={{ color: accent }}>
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div className="st-label">{label}</div>
    </motion.div>
  );
}

/* ─── Step ────────────────────────────────────────────────────────────────── */
function Step({ num, icon, title, desc, accent, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className="step-card"
      initial={{ opacity: 0, x: num % 2 === 0 ? 30 : -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div className="step-num" style={{ background: accent + '15', color: accent }}>0{num}</div>
      <div className="step-body">
        <div className="step-icon" style={{ color: accent }}>{icon}</div>
        <h3 className="step-title">{title}</h3>
        <p className="step-desc">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Testimonial ─────────────────────────────────────────────────────────── */
function Testimonial({ name, role, org, quote, initials, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className="tm-card"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
    >
      <div className="tm-stars">
        {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
      </div>
      <p className="tm-quote">"{quote}"</p>
      <div className="tm-author">
        <div className="tm-avatar">{initials}</div>
        <div>
          <div className="tm-name">{name}</div>
          <div className="tm-role">{role} · {org}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tech Pill ───────────────────────────────────────────────────────────── */
function TechPill({ label, sub, color, icon }) {
  return (
    <motion.div
      className="tp-pill"
      whileHover={{ y: -2, borderColor: color }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="tp-dot" style={{ background: color }} />
      <div>
        <div className="tp-label" style={{ color }}>{label}</div>
        <div className="tp-sub">{sub}</div>
      </div>
    </motion.div>
  );
}

/* ─── AdSense Placeholder ─────────────────────────────────────────────────── */
function AdBanner({ slotId }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense push error", e);
    }
  }, []);

  return (
    <div style={{ margin: '40px auto', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
      <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Advertisement</p>
      <ins className="adsbygoogle"
           style={{ display: 'block', minHeight: '90px' }}
           data-ad-client="ca-pub-2538738703402430"
           data-ad-slot={slotId || "auto"}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function HomePage({ onLaunch, onNavigate }) {
  const features = [
    { icon: <Cpu size={22} />, title: 'Predictive Collision AI', description: 'Neural networks analyse speed, trajectory and track topology to flag hazards 10–20 seconds before impact.', accent: '#2563eb', delay: 0 },
    { icon: <Zap size={22} />, title: 'Autonomous Emergency Braking', description: 'When risk exceeds critical thresholds the system engages brakes independently — no human reaction time required.', accent: '#7c3aed', delay: 0.06 },
    { icon: <Radio size={22} />, title: 'IoT Sensor Network', description: 'GPS, accelerometers and proximity sensors on every train stream continuous telemetry to the central AI engine.', accent: '#0891b2', delay: 0.12 },
    { icon: <Eye size={22} />, title: 'Live Operations Dashboard', description: 'Track every train in real time, review AI decision logs and issue manual overrides from one unified interface.', accent: '#059669', delay: 0.18 },
    { icon: <Lock size={22} />, title: 'Triple-Redundant Safety', description: 'Three independent layers ensure that if one subsystem fails, two backups activate instantly — zero single point of failure.', accent: '#dc2626', delay: 0.24 },
    { icon: <BarChart3 size={22} />, title: 'Predictive Analytics', description: 'Incident history and pattern recognition continuously sharpen prediction accuracy with every operational cycle.', accent: '#d97706', delay: 0.30 },
  ];

  const stats = [
    { value: 99, suffix: '.9%', label: 'System Uptime SLA', icon: <Activity size={24} />, accent: '#2563eb' },
    { value: 12,  suffix: 's',  label: 'Avg. Alert Lead Time', icon: <Clock size={24} />, accent: '#7c3aed' },
    { value: 0,   suffix: '',   label: 'Collisions Under AI Watch', icon: <ShieldAlert size={24} />, accent: '#059669' },
    { value: 240, suffix: '+',  label: 'Trains Monitored Daily', icon: <Train size={24} />, accent: '#d97706' },
  ];

  const steps = [
    { num: 1, icon: <Radio size={20} />, title: 'Sensor Telemetry', desc: 'IoT devices on every train stream GPS, speed and proximity data to the cloud server in sub-100 ms intervals.', accent: '#2563eb', delay: 0 },
    { num: 2, icon: <Cpu size={20} />, title: 'AI Risk Assessment', desc: 'The ML engine scores collision probability for every train pair using real-time trajectory prediction models.', accent: '#7c3aed', delay: 0.08 },
    { num: 3, icon: <Zap size={20} />, title: 'Automated Intervention', desc: 'If risk exceeds 80 %, the system autonomously engages brakes, reroutes signals and alerts operators — in milliseconds.', accent: '#dc2626', delay: 0.16 },
    { num: 4, icon: <Eye size={20} />, title: 'Operator Review', desc: 'Human operators monitor system state, audit AI decisions, issue manual overrides and analyse incident reports live.', accent: '#059669', delay: 0.24 },
  ];

  const testimonials = [
    { name: 'Rajesh Mehta', role: 'Chief Safety Officer', org: 'IndiaRail', initials: 'RM', quote: 'UNDISCOVEREDPATH reduced near-miss incidents by 94 % in our first quarter of deployment — the most impactful safety technology we have adopted in decades.', delay: 0 },
    { name: 'Dr. Priya Sharma', role: 'AI Researcher', org: 'IIT Delhi', initials: 'PS', quote: 'The 12-second prediction lead time is exceptional. That margin is more than enough for autonomous intervention — a genuine game changer for rail safety.', delay: 0.08 },
    { name: 'James Woolworth', role: 'Operations Director', org: 'TransEu Rail', initials: 'JW', quote: 'ROI was visible within two months — both in safety outcomes and measurable operational efficiency. Deploying across all 14 stations was the right call.', delay: 0.16 },
  ];

  const tech = [
    { label: 'React 19', sub: 'Frontend UI', color: '#2563eb' },
    { label: 'Node.js', sub: 'Backend Server', color: '#16a34a' },
    { label: 'WebSocket', sub: 'Real-time Data', color: '#d97706' },
    { label: 'TensorFlow', sub: 'AI Risk Engine', color: '#ea580c' },
    { label: 'GPS / GNSS', sub: 'Train Tracking', color: '#0891b2' },
    { label: 'Redis', sub: 'Live Cache', color: '#dc2626' },
    { label: 'PostgreSQL', sub: 'Audit Logs', color: '#7c3aed' },
    { label: 'Docker', sub: 'Deployment', color: '#0284c7' },
  ];

  return (
    <div className="pf-root">
      <Navbar onLaunch={onLaunch} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="pf-hero" id="hero">


        <div className="pf-hero-inner">
          {/* Left copy */}
          <motion.div
            className="pf-hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="pf-eyebrow">
              <ShieldAlert size={13} />
              AI-Powered Railway Safety Platform
            </div>

            <h1 className="pf-h1">
              Zero collisions.<br />
              <span className="pf-h1-gradient">Engineered in.</span>
            </h1>

            <p className="pf-hero-sub">
              The world's most advanced predictive collision avoidance system for rail operations.
              Real-time AI monitoring, autonomous braking, and intelligent operator controls — unified.
            </p>

            <div className="pf-hero-btns">
              <motion.button
                id="hero-launch-btn"
                className="pf-btn-primary"
                onClick={onLaunch}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={16} /> Open Live Dashboard
              </motion.button>
              <motion.button
                className="pf-btn-ghost"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore features <ChevronDown size={16} />
              </motion.button>
            </div>

            <div className="pf-trust-row">
              {[
                '0 collisions under AI supervision',
                '99.9% uptime SLA',
                '12 s average alert lead time',
              ].map((t, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="pf-trust-sep" />}
                  <span className="pf-trust-item">
                    <CheckCircle2 size={13} color="#2563eb" />
                    {t}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Right sim card */}
          <motion.div
            className="pf-hero-visual"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <LiveSim />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="pf-scroll-cue"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4 }}
          onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown size={22} />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="pf-stats" id="stats">
        <div className="pf-container">
          <div className="pf-stats-grid">
            {stats.map((s, i) => <StatItem key={i} {...s} />)}
          </div>
        </div>
      </section>

      <div className="pf-container"><AdBanner slotId="1234567890" /></div>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="pf-section pf-bg-white" id="features">
        <div className="pf-container">
          <motion.div className="pf-section-hd" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="pf-tag">Platform Features</div>
            <h2 className="pf-h2">Everything required for<br /><span className="pf-gradient-text">zero-risk rail operations</span></h2>
            <p className="pf-section-sub">A complete safety intelligence stack — from raw sensor telemetry to autonomous intervention.</p>
          </motion.div>
          <div className="pf-feat-grid">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      <div className="pf-container"><AdBanner slotId="0987654321" /></div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="pf-section pf-section--alt pf-bg-gray" id="how-it-works">
        <div className="pf-container">
          <motion.div className="pf-section-hd" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="pf-tag">The Process</div>
            <h2 className="pf-h2">Sensor to safe stop<br /><span className="pf-gradient-text">in milliseconds</span></h2>
          </motion.div>
          <div className="pf-steps-grid">
            {steps.map((s, i) => <Step key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────────────────────────────── */}
      <section className="pf-section pf-tech-band">
        <div className="pf-container">
          <motion.div className="pf-section-hd" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="pf-tag">Technology Stack</div>
            <h2 className="pf-h2">Built on <span className="pf-gradient-text">enterprise-grade</span> infrastructure</h2>
          </motion.div>
          <div className="pf-tech-grid">
            {tech.map((t, i) => <TechPill key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="pf-section pf-section--alt" id="testimonials">
        <div className="pf-container">
          <motion.div className="pf-section-hd" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="pf-tag">Testimonials</div>
            <h2 className="pf-h2">Trusted by <span className="pf-gradient-text">rail safety experts</span><br />worldwide</h2>
          </motion.div>
          <div className="pf-tm-grid">
            {testimonials.map((t, i) => <Testimonial key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="pf-cta">
        <div className="pf-cta-inner">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="pf-tag">Get Started</div>
            <h2 className="pf-cta-h2">Ready to eliminate<br />railway collisions?</h2>
            <p className="pf-cta-sub">
              Jump into the live dashboard and see AI-powered collision prevention in action — right now.
            </p>
            <motion.button
              id="cta-launch-btn"
              className="pf-cta-btn"
              onClick={onLaunch}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Play size={18} /> Open Live Dashboard
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="pf-footer">
        <div className="pf-container">
          <div className="pf-footer-top">
            <div className="pf-footer-brand">
              <div className="pf-logo">
                <div className="pf-logo-icon" style={{ background: 'transparent' }}><img src="https://t3.ftcdn.net/jpg/04/32/54/24/360_F_432542454_kfzQHjWPgdi4sx9EfXqOLPzSXFiJBf8l.jpg" alt="UNDISCOVEREDPATH Logo" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} /></div>
                <span className="pf-logo-text">UNDISCOVEREDPATH</span>
              </div>
              <p className="pf-footer-tagline">Zero Collisions. Engineered In.</p>
              <div className="pf-footer-socials">
                <a href="#" className="pf-social" onClick={e => { e.preventDefault(); onNavigate('links'); }}><GitBranch size={15} /></a>
                <a href="#" className="pf-social" onClick={e => { e.preventDefault(); onNavigate('links'); }}><Share2 size={15} /></a>
                <a href="#" className="pf-social" onClick={e => { e.preventDefault(); onNavigate('links'); }}><ExternalLink size={15} /></a>
              </div>
            </div>
            <div className="pf-footer-links">
              {[
                { heading: 'Product', links: ['Features', 'Architecture', 'Roadmap', 'Changelog'] },
                { heading: 'Technology', links: ['AI Engine', 'IoT Sensors', 'API Docs', 'Security'] },
                { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              ].map(col => (
                <div key={col.heading} className="pf-footer-col">
                  <div className="pf-footer-col-hd">{col.heading}</div>
                  {col.links.map(l => (
                    <a 
                      key={l} 
                      href="#" 
                      className="pf-footer-link"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigate && (col.heading === 'Company' || col.heading === 'Product')) {
                          onNavigate(l.toLowerCase());
                        }
                      }}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="pf-footer-bottom">
            <span>© 2026 UNDISCOVEREDPATH Railway Intelligence.</span>
            <div className="pf-footer-legal">
              <a href="#" onClick={e => { e.preventDefault(); onNavigate('privacy'); }}>Privacy</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate('terms'); }}>Terms</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate('cookies'); }}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
