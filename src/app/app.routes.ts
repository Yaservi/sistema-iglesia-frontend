import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AcercadeComponent } from './acercade/acercade.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MiembrosComponent } from './miembros/miembros.component';
import { EventosComponent } from './eventos/eventos.component';
import { TransaccionesComponent } from './transacciones/transacciones.component';
import { BautizosComponent } from './bautizos/bautizos.component';
import { MinisteriosComponent } from './ministerios/ministerios.component';
import { VisitantesComponent } from './visitantes/visitantes.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'starthome', pathMatch: 'full' },
  { path: 'starthome', component: HomeComponent },
  { path: 'acercade', component: AcercadeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // Protected routes
  { path: 'miembros', component: MiembrosComponent, canActivate: [AuthGuard] },
  { path: 'eventos', component: EventosComponent, canActivate: [AuthGuard] },
  { path: 'diezmos', component: TransaccionesComponent, canActivate: [AuthGuard] },
  { path: 'bautizos', component: BautizosComponent, canActivate: [AuthGuard] },
  { path: 'ministerios', component: MinisteriosComponent, canActivate: [AuthGuard] },
  { path: 'visitantes', component: VisitantesComponent, canActivate: [AuthGuard] },
  // Routes for future implementation
  { path: 'configuracion', component: DashboardComponent, canActivate: [AuthGuard] },
  // Wildcard route for 404 page
  { path: '**', redirectTo: 'starthome' }
];
