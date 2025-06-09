export interface DashboardInfo {
  firstName: string;
  lastName: string;
  locations:Array<Location>;
  contaminants: Array<Contaminant>
  // add other properties as needed
}


export interface Location {
    id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
}

export interface Contaminant {
  id: number;
  key: string;
  name: string;
  units: string;
  access_tags?: string;
  type?: string;      
}