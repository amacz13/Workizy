import { Injectable } from '@angular/core';
import {Media, MediaObject} from "@ionic-native/media";
import {ListItem} from "../list-item/list-item";
import {MyApp} from "../../app/app.component";
import {MusicControls} from "@ionic-native/music-controls";

@Injectable()
export class AudioManager {

  currentMusic: string = null;

  audioMedia: MediaObject;
  jsAudio : any;

  constructor(public media: Media, public musicControls: MusicControls) {
  }

  playOrStopMusic(item: ListItem) {
    let musicURL = item.musicURL.toString();
    console.log("Playing song : ",musicURL);
    if (MyApp.os == "osx"){
      if (this.currentMusic == null) {
        this.jsAudio = new Audio(musicURL);
        this.currentMusic = musicURL;
        this.jsAudio.play();
        this.jsAudio.onended = (event) => {
          console.log("End of playback !");
          this.currentMusic = null;
          document.title = "Workizy";
        };
        if (item.title != null && item.textContent != null) document.title = item.title + " - " + item.textContent;
        else if (item.title != null) document.title = item.title.toString();
        else if (item.textContent != null) document.title = item.textContent.toString();
      } else {
        this.jsAudio.pause();
        this.currentMusic = null;
      }
    } else {
      if (this.currentMusic == null) {
        this.audioMedia = this.media.create(musicURL);
        this.currentMusic = musicURL;
        this.audioMedia.onStatusUpdate.subscribe(status => {
          console.log("Audio status : ",status);
          if (status == 4) {
            console.log("Audio Stopped !");
            this.currentMusic = null;
            this.musicControls.updateIsPlaying(false);
            this.musicControls.updateDismissable(true);
          }
        });
        this.audioMedia.play();
        this.displayMusicControls(item);
      } else {
        this.audioMedia.stop();
        this.currentMusic = null;
      }
    }
  }

  displayMusicControls(item: ListItem){
    let trackTitle: string = "Workizy";
    let trackArtist: string = "Unknown Song";
    let trackImg: string = "assets/imgs/logo.png";
    if (item.title != null) trackTitle = item.title.toString();
    if (item.textContent != null) trackArtist = item.textContent.toString();
    if (item.picture != null) trackImg = item.picture.toString();
    this.musicControls.create({
      track       : trackTitle,        // optional, default : ''
      artist      : trackArtist,                       // optional, default : ''
      cover       : trackImg,      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying   : true,                         // optional, default : true
      dismissable : false,                         // optional, default : false

      // hide previous/next/close buttons:
      hasPrev   : false,      // show previous button, optional, default: true
      hasNext   : false,      // show next button, optional, default: true
      hasClose  : true,       // show close button, optional, default: false

      // iOS only, optional
      album       : 'Unknown Album',     // optional, default: ''
      //duration : 60, // optional, default: 0
      //elapsed : 10, // optional, default: 0
      //hasSkipForward : true,  // show skip forward button, optional, default: false
      //hasSkipBackward : true, // show skip backward button, optional, default: false
      //skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      //skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
      //hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated, optional
      ticker    : 'Now playing "'+trackTitle+'"',
      // All icons default to their built-in android equivalents
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    });

    this.musicControls.subscribe().subscribe(action => {
      const message = JSON.parse(action).message;
      switch(message) {
        case 'music-controls-next':
        case 'music-controls-previous':
          break;
        case 'music-controls-pause':
          this.audioMedia.stop();
          this.musicControls.updateIsPlaying(false);
          this.musicControls.updateDismissable(true);
          break;
        case 'music-controls-play':
          this.audioMedia.play();
          this.musicControls.updateIsPlaying(true);
          this.musicControls.updateDismissable(false);
          break;
        case 'music-controls-destroy':
          this.musicControls.destroy();
          break;
      }
    });
    this.musicControls.listen();
  }

}
