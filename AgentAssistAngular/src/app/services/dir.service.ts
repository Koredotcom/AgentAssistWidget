import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirService {

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setDirection(dir: 'ltr' | 'rtl') {
    // Set the `dir` attribute on the `<body>` tag
    this.renderer.setAttribute(document.body, 'dir', dir);
  }
}
