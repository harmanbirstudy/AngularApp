// Used by `ng serve` / development builds via the fileReplacements in angular.json.
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/",
  returnUrl: "http://localhost:4200/login",
  // Next.js recommendations API (RecommedationSystem/api)
  recommendationApiUrl: "http://localhost:3001/",
  // Geoapify address autocomplete key (free at geoapify.com). Empty = use the slower Photon API
  geoapifyApiKey: ""
};
