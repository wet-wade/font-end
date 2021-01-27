import { Device, SavedDevice } from './device';
import { DevicePermission } from './device-permission';
import { GroupMember } from './user';

export interface GroupSummary {
  id: string;
  name: string;
  ownerId: string;
}
export interface Group extends GroupSummary {
  members: GroupMember[];
  devices: SavedDevice[];
  permissions: DevicePermission[];
}
