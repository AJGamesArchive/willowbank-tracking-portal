// Defining params for default filtering on the view all badges page
export interface BadgeFiltersParams extends Record<string, string> {
  mode: string
  filter: string;
};