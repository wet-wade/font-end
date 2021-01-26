import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import {
  Device,
  DeviceStatus,
  DeviceType,
  SavedDevice,
} from '../models/device';
import { DevicePermission } from '../models/device-permission';
import { Group, GroupSummary } from '../models/group';
import { GroupMember } from '../models/user';
import { MOCK_USERS } from './auth.interceptor';

const MOCK_DEVICES: SavedDevice[] = [
  {
    id: '1',
    name: 'SmartBulb',
    nickname: 'Bec in sufragerie',
    type: DeviceType.LIGHTBULD,
    status: DeviceStatus.ON,
    available: true,
  },
  {
    id: '2',
    nickname: 'AC in dormitor',
    name: 'HVAC Device',
    type: DeviceType.HVAC,
    status: DeviceStatus.ON,
    available: true,
    data: { temperature: 22 },
  },
  {
    id: '3',
    nickname: 'Usa la balcon',
    name: 'Smart Door Lock',
    type: DeviceType.DOOR,
    status: DeviceStatus.OFF,
    available: true,
    data: { locked: false },
  },
  {
    id: '4',
    nickname: 'Priza dormitor',
    name: 'Smart Outlet',
    type: DeviceType.OUTLET,
    status: DeviceStatus.ON,
    available: false,
  },
];

const MOCK_DISCOVER: Device[] = [
  {
    id: '5',
    name: 'Xiaomi Smart Door Lock',
    type: DeviceType.DOOR,
  },
  {
    id: '6',
    name: 'Bosch Smart Outlet 3000',
    type: DeviceType.OUTLET,
  },
];

const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    creatorId: '1',
    name: 'Apartament centru',
    devices: MOCK_DEVICES.slice(0, 1),
    members: MOCK_USERS.map((user) => ({ id: user.id, name: user.name })),
    permissions: [
      { deviceId: '1', memberId: '1', manage: true, read: true, write: true },
      { deviceId: '1', memberId: '2', manage: false, read: true, write: true },
      { deviceId: '1', memberId: '3', manage: false, read: true, write: false },
    ],
  },
  {
    id: '2',
    creatorId: '2',
    name: 'Acasa Suceava',
    devices: MOCK_DEVICES.slice(1, 3),
    members: MOCK_USERS.slice(0, 2).map((user) => ({
      id: user.id,
      name: user.name,
    })),
    permissions: [
      { deviceId: '2', memberId: '1', manage: false, read: true, write: true },
      { deviceId: '2', memberId: '2', manage: true, read: true, write: true },
      { deviceId: '3', memberId: '1', manage: false, read: true, write: true },
      { deviceId: '3', memberId: '2', manage: true, read: true, write: true },
    ],
  },
];

@Injectable()
export class GroupsInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    const path = url.split('/');

    // wrap in delayed observable to simulate server api call
    return (
      of(null)
        .pipe(mergeMap(handleRoute))
        // call materialize and dematerialize to ensure delay
        //  (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(100))
        .pipe(dematerialize())
    );

    function handleRoute() {
      switch (true) {
        case url.endsWith('/groups') && method === 'GET':
          return getGroups();

        // GET /groups/:groupId
        case /.*\/groups\/[^/]$/g.test(url) && method === 'GET':
          const getGroupId = path[path.length - 1];
          return getGroup(getGroupId);

        // GET /groups/:groupId/summary
        case /.*\/groups\/[^/]\/summary$/g.test(url) && method === 'GET':
          const getGroupSummaryId = path[path.length - 2];
          return getGroupSummary(getGroupSummaryId);

        // POST /groups
        case url.endsWith('/groups') && method === 'POST':
          return createGroup();

        // GET /groups/:groupId/discover
        case url.endsWith('/discover') && method === 'GET':
          const discoverGroupId = path[path.length - 2];
          return discover(discoverGroupId);

        // POST /groups/:groupId/devices
        case /.*\/groups\/[^/]\/devices$/g.test(url) && method === 'POST':
          const addDeviceGroupId = path[path.length - 2];
          return addDevice(addDeviceGroupId);

        // POST /groups/:groupId/members
        case /.*\/groups\/[^/]\/members$/g.test(url) && method === 'POST':
          const joinGroupId = path[path.length - 2];
          return joinGroup(joinGroupId);

        // POST /groups/:groupId/permissions
        case /.*\/groups\/[^/]\/permissions$/g.test(url) && method === 'POST':
          const permissionsGroupId = path[path.length - 2];
          return setPermissions(permissionsGroupId);
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getGroups() {
      const user = getAuth();
      if (!user) {
        return unauthorized();
      }

      const groupsSummary: GroupSummary[] = MOCK_GROUPS.filter((group) =>
        group.members.some((member) => member.id === user.id)
      ).map((group) => ({
        id: group.id,
        name: group.name,
        creatorId: group.creatorId,
      }));

      return ok({
        groups: groupsSummary,
      });
    }

    function createGroup() {
      const user = getAuth();
      if (!user) {
        return unauthorized();
      }

      const newGroup: Group = {
        id: String(MOCK_GROUPS.length + 1),
        creatorId: user.id,
        name: body.name,
        members: [{ id: user.id, name: user.name }],
        devices: [],
        permissions: [],
      };

      MOCK_GROUPS.push(newGroup);

      return ok({ group: newGroup });
    }

    function getGroup(id: string) {
      const user = getAuth();
      if (!user) {
        return unauthorized();
      }

      const group = MOCK_GROUPS.find((other) => other.id === id);
      if (!group) {
        return notFound();
      }

      if (!group.members.some((other) => other.id === user.id)) {
        return unauthorized();
      }

      return ok({
        group: {
          id: group.id,
          name: group.name,
          creatorId: group.creatorId,
          members: group.members,
          devices: group.devices,
          permissions: group.permissions,
        },
      });
    }
    function getGroupSummary(id: string) {
      const group = MOCK_GROUPS.find((other) => other.id === id);
      if (!group) {
        return notFound();
      }

      return ok({
        group: {
          id: group.id,
          name: group.name,
        },
      });
    }

    function discover(id: string) {
      const user = getAuth();
      if (!user) {
        return unauthorized();
      }

      const group = MOCK_GROUPS.find((other) => other.id === id);
      if (!group) {
        return notFound();
      }

      if (group.creatorId !== user.id) {
        return unauthorized();
      }

      return ok({
        devices: MOCK_DISCOVER.filter(
          (device) => !group.devices.some((other) => other.id === device.id)
        ),
      });
    }

    function addDevice(groupId: string) {
      const user = getAuth();
      if (!user) {
        return unauthorized();
      }

      const group = MOCK_GROUPS.find((other) => other.id === groupId);
      if (!group) {
        return notFound();
      }

      if (group.creatorId !== user.id) {
        return unauthorized();
      }

      const device = MOCK_DISCOVER.find((other) => other.id === body.deviceId);
      const data = generateDeviceData(device);
      const savedDevice: SavedDevice = {
        ...device,
        ...data,
        nickname: body.nickname,
      };
      group.devices.push(savedDevice);
      group.permissions.push({
        memberId: group.creatorId,
        deviceId: device.id,
        manage: true,
        write: true,
        read: true,
      });

      return ok({ device: savedDevice });
    }

    function joinGroup(groupId: string) {
      console.log('CALLING JOIN GROUP');
      console.log(groupId);
      console.log(MOCK_GROUPS);
      const user = getAuth();
      if (!user && !body.name) {
        return throwError({
          status: 401,
          error: { message: 'Invalid request' },
        });
      }
      let newMember: GroupMember;
      let token: string;
      if (user) {
        newMember = { id: user.id, name: user.name };
      } else if (body.name) {
        newMember = {
          id: String(MOCK_USERS.length + 1),
          name: body.name,
        };

        token = 'jwt-' + newMember.id;
        MOCK_USERS.push({
          ...newMember,
          password: '',
          jwt: token,
        });
      }

      const group = MOCK_GROUPS.find((other) => other.id === groupId);
      group.members.push(newMember);

      return ok(body.name ? { visitor: newMember, token } : {});
    }

    function setPermissions(groupId: string) {
      const permissions: DevicePermission = body.permissions;
      const user = getAuth();
      if (!user) {
        return unauthorized();
      }
      const group = MOCK_GROUPS.find((other) => other.id === groupId);
      if (!group) {
        return notFound();
      }

      const device = group.devices.find(
        (other) => other.id === permissions.deviceId
      );
      if (!device) {
        return notFound();
      }

      const member = group.members.find(
        (other) => other.id === permissions.memberId
      );
      if (!member) {
        return notFound();
      }

      if (
        !group.permissions.some(
          (other) =>
            other.memberId === user.id &&
            other.deviceId === device.id &&
            other.manage
        )
      ) {
        return unauthorized();
      }

      group.permissions = group.permissions
        .filter(
          (other) =>
            other.memberId !== permissions.memberId &&
            other.deviceId !== permissions.deviceId
        )
        .concat({
          memberId: permissions.memberId,
          deviceId: permissions.deviceId,
          read: permissions.read,
          write: permissions.write,
          manage: permissions.manage,
        });

      return ok({ group });
    }

    // helper functions

    function generateDeviceData(device: Device) {
      const status = Math.random() >= 0.5 ? DeviceStatus.ON : DeviceStatus.OFF;
      const available = Math.random() >= 0.2;
      let data = {};
      if (device.type === DeviceType.DOOR) {
        data = { lock: Math.random() >= 0.5 };
      } else if (device.type === DeviceType.HVAC) {
        data = { temperature: Math.random() * 10 + 15 };
      }
      return { status, available, data };
    }

    function ok(resBody?: any) {
      return of(new HttpResponse({ status: 200, body: resBody }));
    }

    function error(message: string) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorized' } });
    }

    function notFound() {
      return throwError({ status: 404, error: { message: 'Not found' } });
    }

    function getAuth() {
      const head = headers.get('Authorization');
      const incomingJWT = head && head.replace('Bearer ', '');
      const user = MOCK_USERS.find(({ jwt }) => jwt === incomingJWT);
      return user;
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1], 10);
    }
  }
}
