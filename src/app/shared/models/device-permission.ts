export interface DevicePermission {
  memberId: string;
  deviceId: string;
  read: boolean;
  write: boolean;
  manage: boolean;
}
