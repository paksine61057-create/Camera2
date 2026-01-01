
export type BackgroundStyle = 'color' | 'blur' | 'gradient';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface AppState {
  isCameraActive: boolean;
  bgStyle: BackgroundStyle;
  isLocked: boolean;
}

export interface SwiftFile {
  name: string;
  content: string;
}
