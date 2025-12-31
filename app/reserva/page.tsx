"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { SERVICES } from "../../lib/service";

type Service = {
  id: string;
  name: string;
  price: number;
  durationMin: number;
};

type Step = 1 | 2 | 3;



const TIME_SLOTS = ["10:00", "12:00", "14:30", "16:30", "18:30"];

// Abono fijo según tu política (imagen)
const DEPOSIT_CLP = 10000;
const WHATSAPP_NUMBER_INTL = "56931133370"; // +56 9 3113 3370 (sin +, sin espacios)

function formatUYU(amount: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCLP(amount: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1);
}

function daysInMonth(d: Date) {
  return endOfMonth(d).getDate();
}

// Monday-first index: Mon=0..Sun=6
function dayIndexMondayFirst(date: Date) {
  const js = date.getDay(); // Sun=0..Sat=6
  return (js + 6) % 7; // Mon=0..Sun=6
}

function Calendar({
  value,
  onChange,
  minDate,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  minDate?: Date;
}) {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState<Date>(() => startOfMonth(value ?? today));

  useEffect(() => {
    if (value) setView(startOfMonth(value));
  }, [value]);

  const monthStart = startOfMonth(view);
  const dim = daysInMonth(view);
  const firstDow = dayIndexMondayFirst(monthStart);
  const totalCells = Math.ceil((firstDow + dim) / 7) * 7;

  const monthLabel = view.toLocaleDateString("es-UY", { month: "long", year: "numeric" });

  const canGoPrev = useMemo(() => {
    if (!minDate) return true;
    const prev = addMonths(view, -1);
    const prevEnd = endOfMonth(prev);
    return prevEnd >= new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
  }, [view, minDate]);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => canGoPrev && setView(addMonths(view, -1))}
          disabled={!canGoPrev}
          className={cn(
            "h-10 w-10 rounded-xl border border-white/10 bg-white/[0.03] grid place-items-center transition",
            "hover:bg-white/[0.06]",
            !canGoPrev && "opacity-40 cursor-not-allowed"
          )}
          aria-label="Mes anterior"
        >
          <span className="text-white/80">‹</span>
        </button>

        <div className="text-sm sm:text-base font-semibold text-white capitalize">{monthLabel}</div>

        <button
          type="button"
          onClick={() => setView(addMonths(view, 1))}
          className={cn(
            "h-10 w-10 rounded-xl border border-white/10 bg-white/[0.03] grid place-items-center transition",
            "hover:bg-white/[0.06]"
          )}
          aria-label="Mes siguiente"
        >
          <span className="text-white/80">›</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 text-center text-[11px] sm:text-xs text-white/55">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: totalCells }).map((_, idx) => {
          const dayNum = idx - firstDow + 1;
          const inMonth = dayNum >= 1 && dayNum <= dim;

          const cellDate = new Date(view.getFullYear(), view.getMonth(), clamp(dayNum, 1, dim));
          const isDisabled =
            !inMonth ||
            (minDate
              ? cellDate < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
              : false);

          const selected = value && inMonth && isSameDay(cellDate, value);
          const isToday = inMonth && isSameDay(cellDate, today);

          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => inMonth && !isDisabled && onChange(new Date(view.getFullYear(), view.getMonth(), dayNum))}
              className={cn(
                "h-10 sm:h-11 rounded-xl text-sm transition relative",
                "border border-transparent",
                inMonth ? "text-white/85" : "text-white/25",
                !isDisabled && "hover:bg-white/[0.06] hover:border-white/10",
                isDisabled && "opacity-40 cursor-not-allowed",
                selected && "bg-white/[0.12] border-white/20 text-white",
                isToday && !selected && "ring-1 ring-white/20"
              )}
              aria-label={inMonth ? `Día ${dayNum}` : "Fuera de mes"}
            >
              {inMonth ? dayNum : ""}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-white/55">Seleccioná una fecha para ver horarios disponibles.</div>
    </div>
  );
}

function StepPill({
  step,
  current,
  label,
}: {
  step: Step;
  current: Step;
  label: string;
}) {
  const active = step === current;
  const done = step < current;

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative h-10 w-10 rounded-2xl grid place-items-center border",
          "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          "transition-colors duration-300",
          done
            ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
            : active
              ? "bg-white/[0.10] border-white/25 text-white"
              : "bg-white/[0.03] border-white/10 text-white/55"
        )}
      >
        {(active || done) && (
          <span
            className={cn(
              "absolute inset-0 -z-10 rounded-2xl blur-xl opacity-60",
              done ? "bg-emerald-400/25" : "bg-white/15"
            )}
          />
        )}

        <span className={cn("text-sm font-semibold", done && "text-emerald-200")}>
          {done ? "✓" : step}
        </span>
      </div>

      <div className="min-w-0">
        <div
          className={cn(
            "text-sm font-semibold leading-tight",
            done ? "text-emerald-200" : active ? "text-white" : "text-white/60"
          )}
        >
          {label}
        </div>

        <div
          className={cn(
            "text-[11px] leading-tight",
            done ? "text-emerald-200/70" : active ? "text-white/55" : "text-white/35"
          )}
        >
          {done ? "Completado" : active ? "En progreso" : "Pendiente"}
        </div>
      </div>
    </div>
  );
}

function Modal({
  open,
  children,
  onClose,
  className,
  primaryAction,
}: {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  primaryAction?: React.ReactNode;
}) {
  // ESC + bloquear scroll del body
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Wrapper */}
      <div className="absolute inset-0 flex items-stretch sm:items-center justify-center p-0 sm:p-6">
        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Modal"
          className={cn(
            // Base
            "w-full border border-white/10 bg-[#0b0b0f]/95 shadow-[0_30px_90px_rgba(0,0,0,0.65)] overflow-hidden",
            // Mobile fullscreen
            "h-[100dvh] rounded-none",
            // Desktop compacto
            "sm:h-auto sm:max-h-[85dvh] sm:max-w-2xl sm:rounded-3xl",
            // Layout
            "flex flex-col",
            className
          )}
        >
          {/* Header (minimal, ocupa poco) */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              {/* Si querés ocultar esto en mobile, cambiá a: "hidden sm:block" */}
              <div className="text-sm text-white/85 font-semibold truncate">
                Confirmación
              </div>
              <div className="text-xs text-white/55 truncate">
                Condiciones de abono
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition grid place-items-center"
              aria-label="Cerrar modal"
            >
              <span className="text-white/80">✕</span>
            </button>
          </div>

          {/* Body scrolleable (solo acá scrollea) */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4">
            {children}
          </div>

          {/* Footer fijo abajo */}
          <div className="px-4 sm:px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition text-sm font-semibold text-white/90 px-5"
            >
              Cerrar
            </button>

            {primaryAction}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CrearReservaPage() {
  const [step, setStep] = useState<Step>(1);

  // Ref para scrollear al “top del flujo”
  const topRef = useRef<HTMLDivElement | null>(null);

  function scrollToTop() {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Paso 1
  const [serviceId, setServiceId] = useState<string>(SERVICES[0].id);
  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0],
    [serviceId]
  );

  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Teléfono Chile: guardamos solo dígitos nacionales (sin +56)
  const [phoneCL, setPhoneCL] = useState("");

  useEffect(() => {
    if (!designFile) {
      setDesignPreview(null);
      return;
    }
    const url = URL.createObjectURL(designFile);
    setDesignPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [designFile]);

  // Paso 2
  const minDate = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(null);
  }, [date?.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps

  // Paso 3: modal de éxito
  const [successOpen, setSuccessOpen] = useState(false);

  const clientFullName = useMemo(() => {
    const n = `${firstName}`.trim();
    const a = `${lastName}`.trim();
    return [n, a].filter(Boolean).join(" ");
  }, [firstName, lastName]);

  const canGoStep2 =
    selectedService?.id &&
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    phoneCL.trim().length >= 8; // tolerante (8-9)

  const canGoStep3 = Boolean(date && time);

  function next() {
    if (step === 1 && canGoStep2) {
      setStep(2);
      scrollToTop();
      return;
    }
    if (step === 2 && canGoStep3) {
      setStep(3);
      scrollToTop();
      return;
    }
  }

  function back() {
    if (step === 2) {
      setStep(1);
      scrollToTop();
      return;
    }
    if (step === 3) {
      setStep(2);
      scrollToTop();
      return;
    }
  }

  function resetAll() {
    setStep(1);
    setServiceId(SERVICES[0].id);
    setDesignFile(null);
    setDate(null);
    setTime(null);
    setFirstName("");
    setLastName("");
    setPhoneCL("");
    setSuccessOpen(false);
    scrollToTop();
  }

  const handlePhoneChange = (value: string) => {
    // solo números, y limitamos largo típico CL (9)
    const digits = value.replace(/\D/g, "").slice(0, 9);
    setPhoneCL(digits);
  };

  function formatDateForMessage(d: Date | null) {
    if (!d) return "—";
    // Mensaje más natural para Chile
    return d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const whatsappMessage = useMemo(() => {
    const fechaMsg = formatDateForMessage(date);
    const horaMsg = time ?? "—";
    const servicio = selectedService?.name ?? "servicio";
    const nombre = clientFullName || "—";

    return `Hola soy ${nombre}, quiero abonar la agenda de ${servicio} para el ${fechaMsg} a las ${horaMsg}, puedes pasarme datos de transferencia? Gracias!`;
  }, [clientFullName, date, time, selectedService]);

  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent(whatsappMessage);
    return `https://wa.me/${WHATSAPP_NUMBER_INTL}?text=${text}`;
  }, [whatsappMessage]);


  useEffect(() => {
    if (successOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [successOpen]);



  return (
    <main className="min-h-screen text-white">
      {/* Background premium con imagen */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero44.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(236,72,153,0.16)_0%,rgba(0,0,0,0)_60%),radial-gradient(50%_50%_at_80%_10%,rgba(56,189,248,0.12)_0%,rgba(0,0,0,0)_60%)]" />
      </div>

      {/* Modal éxito */}
      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        className="sm:max-w-lg" // opcional, ya tiene max-w-2xl por default
        primaryAction={
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 rounded-2xl font-semibold px-6 inline-flex items-center justify-center bg-white text-black hover:bg-white/90"
          >
            Abonar
          </a>
        }
      >

        <div className="flex h-full flex-col">
          {/* Header mobile opcional */}
          <div className="sm:hidden px-5 pt-4 text-center">
            <div className="text-base font-semibold text-white">
              Reserva exitosa
            </div>
          </div>

          {/* CONTENIDO SCROLLEABLE */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-6 pt-4 overscroll-contain">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div className="text-sm sm:text-base text-white/85 font-semibold">
                Reserva exitosa, si no abonas la reserva se perderá.
              </div>

              <div className="mt-4 space-y-3 text-sm text-white/70 leading-relaxed">
                <p>
                  Para agendar debes abonar{" "}
                  <span className="font-semibold text-white/90">
                    {formatCLP(DEPOSIT_CLP)}
                  </span>{" "}
                  por servicio, monto que será descontado del valor total.
                </p>

                <p>
                  Solo habrá reembolso si cancelas tu cita con mínimo 24 horas de anticipación.
                </p>

                <p>
                  Pasadas 24 horas, pierdes tu abono y deberás realizar uno nuevo.
                </p>

                <p className="font-semibold text-white/85">
                  Pierdes tu abono si no llegas a tu cita.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs text-white/55">Servicio</div>
                  <div className="mt-1 text-sm text-white/90 font-semibold">
                    {selectedService.name}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs text-white/55">Fecha y hora</div>
                  <div className="mt-1 text-sm text-white/90 font-semibold">
                    {date ? formatDateForMessage(date) : "—"} · {time ?? "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-white/55">
                El botón “Abonar” abrirá WhatsApp con el mensaje listo para enviar.
              </div>
            </div>
          </div>
        </div>

      </Modal>

      {/* Ancla para scroll-to-top */}
      <div ref={topRef} />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] tracking-[0.28em] uppercase text-white/70 backdrop-blur">
            Crear reserva
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] leading-[1.06]">
              Reservá tu turno en 3 pasos
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl">
              Ingresá tus datos, elegí fecha/hora y confirmá para recibir instrucciones de abono.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-7 sm:mt-9 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between">
            <StepPill step={1} current={step} label="Datos" />
            <div className="hidden sm:block h-px sm:h-auto sm:w-px bg-white/10" />
            <StepPill step={2} current={step} label="Fecha" />
            <div className="hidden sm:block h-px sm:h-auto sm:w-px bg-white/10" />
            <StepPill step={3} current={step} label="Confirmar" />
          </div>
        </div>

        {/* Content Card */}
        <div className="mt-6 sm:mt-8 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-7">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">Datos personales</h2>
                <p className="mt-2 text-sm sm:text-base text-white/70">
                  Ingresá tu información y seleccioná el servicio.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-sm font-medium text-white/85">Datos del cliente</div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nombre */}
                      <label className="grid gap-2">
                        <span className="text-sm text-white/70">Nombre</span>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Ej: Ana"
                          className={cn(
                            "h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none",
                            "focus:border-white/25 focus:ring-2 focus:ring-white/10"
                          )}
                        />
                      </label>

                      {/* Apellido */}
                      <label className="grid gap-2">
                        <span className="text-sm text-white/70">Apellido</span>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Ej: Rodríguez"
                          className={cn(
                            "h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none",
                            "focus:border-white/25 focus:ring-2 focus:ring-white/10"
                          )}
                        />
                      </label>

                      {/* Teléfono Chile */}
                      <label className="grid gap-2 sm:col-span-2">
                        <span className="text-sm text-white/70">Teléfono</span>

                        <div className="flex h-12 rounded-2xl border border-white/10 bg-black/30 overflow-hidden focus-within:ring-2 focus-within:ring-white/10">
                          <div className="flex items-center gap-2 px-3 text-sm text-white/70 border-r border-white/10 bg-black/40">
                            🇨🇱 +56
                          </div>

                          <input
                            type="tel"
                            inputMode="numeric"
                            value={phoneCL}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="9XXXXXXXX"
                            className="flex-1 bg-transparent px-3 text-white outline-none"
                          />
                        </div>

                        <div className="text-[11px] text-white/45">
                          Ejemplo: 9XXXXXXXX (sin +56).
                        </div>
                      </label>
                    </div>
                  </div>


                  {/*Servicios disponibles*/}
                  <label className="grid gap-2 w-full min-w-0">
                    <span className="text-sm font-medium text-white/85">
                      Seleccionar servicio
                    </span>

                    <div className="relative w-full min-w-0">
                      <select
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        className={cn(
                          "w-full min-w-0 max-w-full",
                          "h-12 rounded-2xl border border-white/10 bg-black/30 px-4 pr-10",
                          "text-white outline-none appearance-none",
                          "focus:border-white/25 focus:ring-2 focus:ring-white/10"
                        )}
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.id} className="bg-black">
                            {s.name} — {formatUYU(s.price)} · {s.durationMin} min
                          </option>
                        ))}
                      </select>

                      {/* Flecha custom (evita overflow visual) */}
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-sm">
                        ▾
                      </span>
                    </div>
                  </label>


                  {/* Imagen de referencia (opcional) */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-sm font-medium text-white/85">Subir imagen de diseño (opcional)</div>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">JPG/PNG. Se mostrará una vista previa local.</p>

                    <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
                      <label
                        className={cn(
                          "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3",
                          "border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition cursor-pointer"
                        )}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setDesignFile(e.target.files?.[0] ?? null)}
                        />
                        <span className="text-sm font-semibold text-white/90">Elegir imagen</span>
                      </label>

                      {designFile && (
                        <button
                          type="button"
                          onClick={() => setDesignFile(null)}
                          className="inline-flex items-center justify-center rounded-2xl px-4 py-3 border border-white/10 bg-black/30 hover:bg-white/[0.06] transition text-sm text-white/80"
                        >
                          Quitar
                        </button>
                      )}

                      <div className="sm:ml-auto text-xs text-white/55">
                        {designFile ? designFile.name : "Sin imagen seleccionada"}
                      </div>
                    </div>

                    {designPreview && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={designPreview} alt="Vista previa del diseño" className="h-48 w-full object-cover sm:h-56" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="text-sm text-white/60">Resumen</div>
                  <div className="mt-2 text-lg font-semibold text-white">{selectedService.name}</div>
                  <div className="mt-1 text-sm text-white/70">
                    {formatUYU(selectedService.price)} · {selectedService.durationMin} min
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs text-white/55">Abono para agendar</div>
                    <div className="mt-1 text-2xl font-semibold">{formatCLP(DEPOSIT_CLP)}</div>
                    <div className="mt-2 text-xs text-white/55">
                      Se descuenta del valor total. La hora queda disponible hasta que se abone.
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={next}
                      disabled={!canGoStep2}
                      className={cn(
                        "w-full h-12 rounded-2xl font-semibold transition",
                        "bg-white text-black hover:bg-white/90",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      Siguiente
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-white/55">Paso 1 de 3</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-7">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">Fecha</h2>
                <p className="mt-2 text-sm sm:text-base text-white/70">
                  Elegí un día y luego un horario disponible (ficticio) para continuar.
                </p>

                <div className="mt-6">
                  <Calendar value={date} onChange={(d) => setDate(d)} minDate={minDate} />
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white/85">Horarios</div>
                    <div className="text-xs text-white/55">
                      {date
                        ? date.toLocaleDateString("es-UY", { weekday: "long", day: "2-digit", month: "long" })
                        : "Seleccioná una fecha"}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TIME_SLOTS.map((slot) => {
                      const disabled = !date;
                      const active = time === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={disabled}
                          onClick={() => setTime(slot)}
                          className={cn(
                            "h-11 rounded-2xl border text-sm font-semibold transition",
                            active
                              ? "bg-white text-black border-white/20"
                              : "bg-black/25 text-white/80 border-white/10 hover:bg-white/[0.06] hover:border-white/15",
                            disabled && "opacity-40 cursor-not-allowed hover:bg-black/25"
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="text-sm text-white/60">Resumen</div>
                  <div className="mt-2 text-lg font-semibold text-white">{selectedService.name}</div>
                  <div className="mt-1 text-sm text-white/70">
                    {formatUYU(selectedService.price)} · {selectedService.durationMin} min
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs text-white/55">Fecha y hora</div>
                    <div className="mt-1 text-sm text-white/85">
                      {date ? formatDateForMessage(date) : "—"} · {time ?? "—"}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs text-white/55">Abono para agendar</div>
                    <div className="mt-1 text-2xl font-semibold">{formatCLP(DEPOSIT_CLP)}</div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={back}
                      className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition text-sm font-semibold text-white/90"
                    >
                      Atrás
                    </button>

                    <button
                      type="button"
                      onClick={next}
                      disabled={!canGoStep3}
                      className={cn(
                        "h-12 rounded-2xl font-semibold transition",
                        "bg-white text-black hover:bg-white/90",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      Siguiente
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-white/55">Paso 2 de 3</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 (nuevo) */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-7">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">Resumen</h2>
                <p className="mt-2 text-sm sm:text-base text-white/70">
                  Revisá los datos y confirmá. Luego podrás abonar por WhatsApp.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <div className="text-sm font-medium text-white/85">Datos del cliente</div>
                    <div className="mt-3 text-sm text-white/80">
                      <div><span className="text-white/55">Nombre:</span> {clientFullName || "—"}</div>
                      <div className="mt-1"><span className="text-white/55">Teléfono:</span> +56 {phoneCL || "—"}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <div className="text-sm font-medium text-white/85">Servicio</div>
                    <div className="mt-2 text-lg font-semibold text-white">{selectedService.name}</div>
                    <div className="mt-1 text-sm text-white/70">
                      {formatUYU(selectedService.price)} · {selectedService.durationMin} min
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <div className="text-sm font-medium text-white/85">Fecha y hora</div>
                    <div className="mt-2 text-sm text-white/85 font-semibold">
                      {date ? formatDateForMessage(date) : "—"} · {time ?? "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <div className="text-sm font-medium text-white/85">Abono para agendar</div>
                    <div className="mt-2 text-2xl font-semibold">{formatCLP(DEPOSIT_CLP)}</div>
                    <div className="mt-2 text-xs text-white/55">
                      Al confirmar se mostrará el detalle de condiciones y el botón para abonar por WhatsApp.
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <div className="text-sm text-white/60">Acciones</div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={back}
                      className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition text-sm font-semibold text-white/90"
                    >
                      Atrás
                    </button>

                    <button
                      type="button"
                      onClick={() => setSuccessOpen(true)}
                      disabled={!canGoStep3}
                      className={cn(
                        "h-12 rounded-2xl font-semibold transition",
                        "bg-white text-black hover:bg-white/90",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      Confirmar
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={resetAll}
                    className="mt-3 w-full h-11 rounded-2xl border border-white/10 bg-black/25 hover:bg-white/[0.06] transition text-sm text-white/75"
                  >
                    Reiniciar
                  </button>

                  <div className="mt-3 text-xs text-white/55">Paso 3 de 3</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
