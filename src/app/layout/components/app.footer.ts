import { Component, inject, computed } from '@angular/core';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    standalone: true,
    selector: '[app-footer]',
    template: `
        <div class="footer-start">
            <img [src]="logoUrl()" alt="logo" style="height: 2rem" />
            <span class="app-name">DapperTech</span>
        </div>
        <div class="footer-right">
            <span>© DapperTechnologies</span>
        </div>`,
    host: {
        class: 'layout-footer'
    }
})
export class AppFooter {
    layoutService = inject(LayoutService);

    // Definimos la lógica igual a la de tu Header
    logoUrl = computed(() => {
        const path = '/layout/images/';
        // Si es tema oscuro o el color primario domina, usa el logo blanco
        const logo = this.layoutService.isDarkTheme() ||
            this.layoutService.layoutConfig().layoutTheme === 'primaryColor'
            ? 'logo-white.svg'
            : 'logo-dark.svg';

        return path + logo;
    });
}
