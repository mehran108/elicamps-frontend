import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHTML implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(style: any) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}
