import { Injectable } from '@angular/core';

@Injectable()
export class DeezerSong {

  title: string;
  artist: string;
  previewUrl: string;
  coverUrl: string;

  constructor(t: string, a: string, p: string, c: string) {
    this.title = t;
    this.artist = a;
    this.previewUrl = p;
    this.coverUrl = c;
  }

}
