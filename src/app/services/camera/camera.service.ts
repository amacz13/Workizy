import {Injectable} from '@angular/core';
import {CameraPhoto, CameraResultType, FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';

const { Camera, Filesystem } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  newPicture(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      let result: CameraPhoto = await Camera.getPhoto({resultType: CameraResultType.Base64, presentationStyle: 'popover', allowEditing: true, width: 400, height: 150, preserveAspectRatio: true});
      if (result && result.base64String) {
        let fileName: string;
        do {
          fileName = Math.random().toString(36).substr(2, 9);
        } while (await this.fileExists(fileName + '.pic'));
        try {
          await Filesystem.writeFile({
            path: fileName+'.pic',
            data: 'data:image/jpg;base64,'+result.base64String,
            directory: FilesystemDirectory.Cache,
            encoding: FilesystemEncoding.UTF8
          })
          resolve(fileName);
        } catch (e) {
          reject('I/O Error');
        }
      }
      reject('Cancelled');
    });
  }

  getPicture(fileName: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      let fileExists = await this.fileExists(fileName);
      if (!fileExists) reject('Not found');
      let contents = await Filesystem.readFile({
        path: fileName+'.pic',
        directory: FilesystemDirectory.Cache,
        encoding: FilesystemEncoding.UTF8
      });
      if (contents && contents.data) resolve(contents.data);
      reject('I/O Error');
    })
  }

  async deletePicture(fileName: string) {
    await Filesystem.deleteFile({
      path: fileName+'.pic',
      directory: FilesystemDirectory.Cache
    });
  }

  private fileExists(fileName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let ret = await Filesystem.stat({
          path: fileName+'.pic',
          directory: FilesystemDirectory.Cache
        });
        if (ret) resolve(true);
        resolve(false);
      } catch(e) {
        resolve(false);
      }
    })
  }
}
