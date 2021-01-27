import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import {
  Device,
  DeviceCommand,
  DeviceStatus,
  SavedDevice,
} from './models/device';
import { DevicePermission } from './models/device-permission';
import { Group, GroupSummary } from './models/group';

@Injectable({ providedIn: 'root' })
export class GroupSandbox {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  private processDevice(
    device: SavedDevice & { properties: any[] }
  ): SavedDevice {
    let status: DeviceStatus;
    let available: boolean;
    let data = {};
    if (!device.properties) {
      return device;
    }
    for (const property of device.properties) {
      if (property.name === 'status') {
        status = property.value;
      } else if (property.name === 'available') {
        available = property.value;
      } else if (property.name === 'temperature') {
        data = { temperature: property.value };
      }
    }

    return { ...device, status, available, data };
  }

  getGroups(): Observable<GroupSummary[]> {
    const url = `${environment.apiUrl}/groups`;
    return this.http.get(url).pipe(map((response: any) => response.groups));
  }

  getGroup(id: string): Observable<Group> {
    const url = `${environment.apiUrl}/groups/${id}`;
    return this.http.get(url).pipe(
      map((response: any) => ({
        ...response.group,
        devices: response.group.devices.map((device) =>
          this.processDevice(device)
        ),
      }))
    );
  }

  getGroupSummary(id: string): Observable<GroupSummary> {
    const url = `${environment.apiUrl}/groups/${id}/summary`;
    return this.http.get(url).pipe(map((response: any) => response.group));
  }

  createGroup(name: string): Observable<Group> {
    const url = `${environment.apiUrl}/groups`;
    return this.http
      .post(url, { name })
      .pipe(map((response: any) => response.group));
  }

  discover(id: string): Observable<Device[]> {
    const url = `${environment.apiUrl}/groups/${id}/discover`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) =>
          response.devices.map((device) => this.processDevice(device))
        )
      );
  }

  addDevice(
    groupId: string,
    deviceId: string,
    nickname: string
  ): Observable<Device> {
    const url = `${environment.apiUrl}/groups/${groupId}/devices`;
    return this.http
      .post(url, { deviceId, nickname })
      .pipe(map((response: any) => response.device));
  }

  joinGroup(id: string): Observable<void> {
    const url = `${environment.apiUrl}/groups/${id}/members`;
    return this.http.post(url, {}).pipe(
      map(() => {
        return;
      })
    );
  }

  joinGroupAsVisitor(id: string, name: string): Observable<void> {
    const url = `${environment.apiUrl}/groups/${id}/members`;
    return this.http.post(url, { name }).pipe(
      map((response: any) => {
        const visitor = response.visitor;
        const token = response.token;
        this.cookieService.set('wet-token', token);
        this.authService.user.next(visitor);
      })
    );
  }

  setPermissions(
    groupId: string,
    permissions: DevicePermission
  ): Observable<Group> {
    const url = `${environment.apiUrl}/groups/${groupId}/permissions`;
    return this.http
      .post(url, { permissions })
      .pipe(map((response: any) => response.group));
  }

  controlDevice(
    groupId: string,
    deviceId: string,
    command: DeviceCommand,
    input: any
  ): Observable<SavedDevice> {
    const url = `${environment.apiUrl}/groups/${groupId}/devices/${deviceId}/command`;
    return this.http
      .post(url, { command, input })
      .pipe(map((response: any) => response.device));
  }
}
