import { Device } from './device';
import { DevicePermission } from './device-permission';
import { GroupMember } from './user';

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  devices: Device[];
  permissions: DevicePermission[];
}
