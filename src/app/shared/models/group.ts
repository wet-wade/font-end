import { Device } from './device';
import { DevicePermission } from './device-permission';
import { GroupMember } from './user';

export interface GroupSummary {
  id: string;
  name: string;
  creatorId: string;
}
export interface Group extends GroupSummary {
  members: GroupMember[];
  devices: Device[];
  permissions: DevicePermission[];
}
