export type TTripFilterRequest = {
  destination?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  minBudget?: number | undefined;
  maxBudget?: number | undefined;
  searchTerm?: string | undefined;
  tripType?: string | undefined;
};
