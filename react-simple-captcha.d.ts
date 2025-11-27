declare module 'react-simple-captcha' {
  export function loadCaptchaEnginge(length: number): void;
  export function LoadCanvasTemplate(props?: { reloadColor?: string }): JSX.Element;
  export function validateCaptcha(userInput: string, reload?: boolean): boolean;
  export function LoadCanvasTemplateNoReload(props?: { reloadColor?: string }): JSX.Element;
}
