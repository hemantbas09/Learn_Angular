import { Directive, ElementRef, HostListener, Renderer2 } from "@angular/core";

@Directive({
    selector: '[highlight]',
    standalone: true
})

export class HighlightDirective {

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('mouseenter') onMouseEnter() {
        this.setBackgroundColor('yellow');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.setBackgroundColor(null);
    }

    private setBackgroundColor(color: string | null) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    }
}