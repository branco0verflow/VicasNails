type Service = {
  id: string;
  name: string;
  price: number;
  durationMin: number;
};

export const SERVICES: Service[] = [
  {
    id: "manicure_sin_esmalte",
    name: "Manicure sin esmaltado",
    price: 12000,
    durationMin: 45,
  },
  {
    id: "manicure_perm",
    name: "Manicure esmaltado permanente",
    price: 18000,
    durationMin: 60,
  },
  {
    id: "manicure_perm_francesa",
    name: "Manicure permanente francesa",
    price: 24000,
    durationMin: 75,
  },
  {
    id: "manicure_perm_degrade",
    name: "Manicure permanente degradé",
    price: 28000,
    durationMin: 90,
  },
  {
    id: "manicure_perm_hardgel",
    name: "Manicure permanente + Hardgel",
    price: 22000,
    durationMin: 90,
  },
  {
    id: "manicure_perm_ojo_gato",
    name: "Manicure permanente ojo de gato",
    price: 20000,
    durationMin: 75,
  },
  {
    id: "pedicure_perm",
    name: "Pedicure esmaltado permanente",
    price: 22000,
    durationMin: 60,
  },
  {
    id: "lifting_pestanas",
    name: "Lifting + tinte de pestañas",
    price: 20000,
    durationMin: 60,
  },
];