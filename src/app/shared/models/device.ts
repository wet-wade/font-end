export enum DeviceType {
  LIGHTBULD = 'lightbulb',
  HVAC = 'hvac',
  DOOR = 'door',
  OUTLET = 'outlet',
}

export enum DeviceStatus {
  ON = 'on',
  OFF = 'off',
}

export interface Device {
  id: string;
  name: string;
  type: string;
  available: boolean;
  status: DeviceStatus;
  data?: any;
}

export type LightbulbDevice = Device;

export interface HvacDevice extends Device {
  data: {
    temperature: number;
  };
}

export type OutletDevice = Device;

export interface DoorDevice {
  data: {
    locked: boolean;
  };
}
