import {Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Post} from '../../types/IKonachan';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LightboxComponent} from '../lightbox/lightbox.component';

@Component({
  selector: 'app-gallery-image',
  templateUrl: './gallery-image.component.html',
  styleUrls: ['./gallery-image.component.css'],
  animations: [
    trigger('animateHovered', [
      state('false', style({opacity: 0})),
      state('true', style({opacity: 1})),
      transition('false <=> true', [
        animate(250)
      ])
    ]),
    trigger('animateLoaded', [
      state('false', style({opacity: 0})),
      state('true', style({opacity: 1})),
      transition('false <=> true', [
        animate(250)
      ])
    ])
  ]
})
export class GalleryImageComponent implements OnInit {

  @Input()
  post: Post;

  @Input()
    container: ViewContainerRef;

  isHovered = false;
  isLoaded = false;

  constructor(private electron: ElectronService, private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  download(fileUrl) {
    this.electron.ipcRenderer.send('download-btn', {url: fileUrl});
  }

  createLightbox(fileUrl: string, tags: string) {
    this.container.clear();

    const factory: ComponentFactory<LightboxComponent> = this.resolver.resolveComponentFactory(LightboxComponent);
    const component: ComponentRef<LightboxComponent> = this.container.createComponent(factory);

    component.instance.fileUrl = fileUrl;
    component.instance.tags = tags.split(' ');
    component.instance.destroyCheck
      .subscribe(v => {
        if (v === 'kill me') {
          component.destroy();
        }
      });
  }
}