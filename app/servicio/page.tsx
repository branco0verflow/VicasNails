// app/servicios-y-valores/page.tsx
// Página 100% responsive (Next.js App Router) con datos mockeados.
// Cuando esté la API real, reemplazás el objeto SERVICES_DATA por un fetch.

import Image from "next/image";
import Link from "next/link";

type ServiceItem = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string; // ruta en /public
  precio: number; // en pesos, sin puntos
};

type ServiceGroup = {
  id: "reservables" | "extras" | "retiros";
  titulo: string;
  subtitulo: string;
  items: ServiceItem[];
};

const formatUYU = (value: number) =>
  new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(value);

const SERVICES_DATA: ServiceGroup[] = [
  {
    id: "reservables",
    titulo: "Servicios reservables",
    subtitulo:
      "Elegí tu servicio principal. Diseños y efectos se agregan como extra según el estilo que quieras.",
    items: [
      {
        id: "manicure_sin_esmalte",
        nombre: "Manicure sin esmaltado",
        descripcion:
          "Limpieza y preparación de uñas, cuidado de cutículas y acabado prolijo.",
        imagen: "/imagen.png",
        precio: 12000,
      },
      {
        id: "manicure_perm",
        nombre: "Manicure esmaltado permanente",
        descripcion:
          "Esmaltado de larga duración con terminación brillante y uniforme.",
        imagen: "/imagen.png",
        precio: 18000,
      },
      {
        id: "manicure_perm_francesa",
        nombre: "Manicure permanente francesa",
        descripcion:
          "Clásica francesa con líneas definidas y estética elegante.",
        imagen: "/imagen.png",
        precio: 24000,
      },
      {
        id: "manicure_perm_degrade",
        nombre: "Manicure permanente degradé",
        descripcion:
          "Efecto degradé suave y moderno, ideal para un look delicado.",
        imagen: "/imagen.png",
        precio: 28000,
      },
      {
        id: "manicure_perm_hardgel",
        nombre: "Manicure permanente + Hardgel",
        descripcion:
          "Refuerzo con hardgel para mayor resistencia y mejor estructura.",
        imagen: "/imagen.png",
        precio: 22000,
      },
      {
        id: "manicure_perm_ojo_gato",
        nombre: "Manicure permanente ojo de gato",
        descripcion:
          "Efecto “cat eye” con brillo y profundidad, según el tono elegido.",
        imagen: "/imagen.png",
        precio: 20000,
      },
      {
        id: "pedicure_perm",
        nombre: "Pedicure esmaltado permanente",
        descripcion:
          "Pedicure con esmaltado permanente para un acabado duradero y prolijo.",
        imagen: "/imagen.png",
        precio: 22000,
      },
      {
        id: "lifting_pestanas",
        nombre: "Lifting + tinte de pestañas",
        descripcion:
          "Curvatura + color para realzar la mirada con un resultado natural.",
        imagen: "/imagen.png",
        precio: 20000,
      },
    ],
  },
  {
    id: "extras",
    titulo: "Extras de diseño y efectos",
    subtitulo:
      "Se suman al servicio principal. El valor depende del nivel de detalle.",
    items: [
      {
        id: "diseno_simple",
        nombre: "Diseño simple / efecto",
        descripcion:
          "Detalles mínimos, efectos sutiles o diseños simples por uña.",
        imagen: "/imagen.png",
        precio: 1000,
      },
      {
        id: "diseno_medio",
        nombre: "Diseño medio",
        descripcion:
          "Mayor detalle o combinación de efectos (según propuesta del diseño).",
        imagen: "/imagen.png",
        precio: 1500,
      },
      {
        id: "diseno_complejo",
        nombre: "Diseño complejo / decoración",
        descripcion:
          "Diseños avanzados, decoraciones o trabajos con alto nivel de detalle.",
        imagen: "/imagen.png",
        precio: 2000,
      },
      {
        id: "parche_hardgel",
        nombre: "Parche Hardgel",
        descripcion:
          "Refuerzo puntual para reparación o protección específica.",
        imagen: "/imagen.png",
        precio: 1000,
      },
      {
        id: "arreglo_unia_picada",
        nombre: 'Arreglo "uña picada"',
        descripcion:
          "Reparación de uña dañada para recuperar forma y prolijidad.",
        imagen: "/imagen.png",
        precio: 2000,
      },
    ],
  },
  {
    id: "retiros",
    titulo: "Retiros",
    subtitulo:
      "Servicios para remover trabajos previos. Elegí la opción que corresponda.",
    items: [
      {
        id: "retiro_vicas_sin_servicio",
        nombre: "Retiro Vica’s Nails (sin servicio)",
        descripcion:
          "Retiro de trabajo previo realizado en Vica’s Nails, sin nuevo servicio.",
        imagen: "/imagen.png",
        precio: 3000,
      },
      {
        id: "retiro_perm_externo",
        nombre: "Retiro esmaltado permanente externo",
        descripcion:
          "Retiro de permanente realizado en otro lugar, con cuidado y prolijidad.",
        imagen: "/imagen.png",
        precio: 4000,
      },
      {
        id: "retiro_extensiones",
        nombre: "Retiro extensiones de uñas",
        descripcion:
          "Retiro de extensiones con técnica segura para proteger la uña natural.",
        imagen: "/imagen.png",
        precio: 12000,
      },
    ],
  },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] tracking-[0.26em] uppercase text-white/80 backdrop-blur">
      {children}
    </span>
  );
}

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.06] shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-white/[0.08]">
      {/* Imagen */}
      <div className="relative h-44 w-full sm:h-48 md:h-52">
        <Image
          src={item.imagen}
          alt={item.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/0" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <h3 className="text-pretty text-base font-semibold leading-tight text-white">
            {item.nombre}
          </h3>

          <div className="shrink-0 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur">
            {formatUYU(item.precio)}
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-white/75">
          {item.descripcion}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href="/reserva"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
          >
            Reservar turno
          </a>

        
        </div>
      </div>

      {/* Glow sutil */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>
    </article>
  );
}

export default function ServiciosYValoresPage() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/bg-servicee.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <Chip>Servicios y valores</Chip>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur transition hover:bg-white/10"
            >
              Volver
            </Link>
          </div>

          {/* CTA */}
          <div className="select-none text-center flex flex-col items-center">
            <div className="relative w-[540px] sm:w-[500px] aspect-[3/1]">
          
                  <Image
                    src="/logo.png"
                    alt="VICA'S NAILS"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
          </div>

          
        </header>

        {/* Groups */}
        <div className="mt-2 space-y-12 sm:mt-12">
          {SERVICES_DATA.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">
                    {group.titulo}
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/70">
                    {group.subtitulo}
                  </p>
                </div>

                <div className="mt-3 sm:mt-0">
                  <a
                    href="#top"
                    className="text-xs font-semibold text-white/70 transition hover:text-white"
                  >
                    Subir
                  </a>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <ServiceCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <footer className="mt-12 rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-5 text-xs text-white/65 backdrop-blur sm:mt-14">
          <div className="font-semibold text-white/85">Notas</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Duración promedio de esmaltado permanente: 3 semanas.</li>
            <li>Garantía: 3 días (según condiciones).</li>
            <li>No domicilios. No se reembolsan servicios realizados.</li>
          </ul>
        </footer>
      </div>

      {/* Ancla para "Subir" */}
      <div id="top" />
    </main>
  );
}
