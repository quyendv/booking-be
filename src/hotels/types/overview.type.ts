export type HotelOverview = {
  rooms: {
    total: number;
    minPrice: number | null;
  };
  reviews: {
    total: number;
    average: number;
  };
};
