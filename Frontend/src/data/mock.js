export const SERVICES = [
    { id: "cut", name: "Corte clásico", durationMin: 30, price: 8 },
    { id: "shave", name: "Afeitado tradicional", durationMin: 20, price: 6 },
    { id: "combo", name: "Corte + Barba", durationMin: 45, price: 12 },
];

export const BARBERS = [
    { id: "b1", name: "Luis", services: ["cut", "combo"], rating: 4.7 },
    { id: "b2", name: "Carlos", services: ["cut", "shave"], rating: 4.5 },
    { id: "b3", name: "María", services: ["shave", "combo"], rating: 4.9 },
];
