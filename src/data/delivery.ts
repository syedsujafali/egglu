export type DeliveryArea = { pincode: string; area: string };

/** Egglu currently delivers across Hyderabad & Secunderabad. */
export const hyderabadAreas: DeliveryArea[] = [
  { pincode: "500001", area: "Tank Bund, Secunderabad" },
  { pincode: "500004", area: "Koti" },
  { pincode: "500008", area: "Sultan Bazaar" },
  { pincode: "500013", area: "Golconda, Shankarpet" },
  { pincode: "500015", area: "Ashok Nagar" },
  { pincode: "500016", area: "Banjara Hills" },
  { pincode: "500019", area: "Jubilee Hills" },
  { pincode: "500020", area: "Somajiguda" },
  { pincode: "500027", area: "Tarnaka" },
  { pincode: "500028", area: "Sainikpuri" },
  { pincode: "500032", area: "Karkhana" },
  { pincode: "500033", area: "Timberlayout, S R Nagar" },
  { pincode: "500034", area: "Kondapur" },
  { pincode: "500035", area: "Ameenpur" },
  { pincode: "500038", area: "Yousufguda" },
  { pincode: "500044", area: "Kukatpally" },
  { pincode: "500046", area: "Wasserpet, Lingampally" },
  { pincode: "500049", area: "Miyapur" },
  { pincode: "500050", area: "Uppal" },
  { pincode: "500055", area: "Quthbullapur" },
  { pincode: "500072", area: "Uppal Kalan" },
  { pincode: "500078", area: "Kompally" },
  { pincode: "500081", area: "Gachibowli, Nanakramguda" },
  { pincode: "500084", area: "Narsingi" },
  { pincode: "500091", area: "Madhapur, Inorbit" },
  { pincode: "500092", area: "Kokapet" },
  { pincode: "502032", area: "Shamirpet" },
];

export const isServiceable = (pincode: string) =>
  hyderabadAreas.some((a) => a.pincode === pincode.trim());
