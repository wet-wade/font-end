export enum DeviceType {
  LIGHTBULD = 'lightbulb',
  HVAC = 'hvac',
  DOOR = 'door',
  OUTLET = 'outlet',
}

export enum DeviceCommand {
  ON = 'ON',
  OFF = 'OFF',
  SET_TEMPERATURE = 'SET_TEMPERATURE',
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
}

export enum DeviceStatus {
  ON = 'on',
  OFF = 'off',
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
}

export interface SavedDevice extends Device {
  nickname: string;
  available: boolean;
  status: DeviceStatus;
  data?: any;
}

export type LightbulbDevice = SavedDevice;

export interface HvacDevice extends SavedDevice {
  data: {
    temperature: number;
  };
}

export type OutletDevice = SavedDevice;

export interface DoorDevice extends SavedDevice {
  data: {
    locked: boolean;
  };
}
