export interface StreamSource {
  id: string;
  stream: MediaStream;
  name: string;
  type: 'camera' | 'screen';
}

export enum LayoutType {
  Solo = 'solo',
  Split = 'split',
  PictureInPicture = 'pip',
}

export enum OverlayTemplate {
  Classic = 'classic',
  Ticker = 'ticker',
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
}

export interface YouTubeSettings {
  title: string;
  description: string;
  privacy: 'public' | 'unlisted' | 'private';
}
