import {Injectable} from '@angular/core';
import {CameraPhoto, CameraResultType, Plugins} from '@capacitor/core';

const { Camera } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  getPhoto(): Promise<CameraPhoto> {
    return Camera.getPhoto({resultType: CameraResultType.Base64, presentationStyle: 'popover', allowEditing: true, width: 400, height: 150, preserveAspectRatio: true});
  }
}
