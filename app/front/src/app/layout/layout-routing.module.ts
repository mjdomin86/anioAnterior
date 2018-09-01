import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            // Accounts
            { path: 'accounts/providers', loadChildren: './accounts/providers/providers.module#ProvidersModule' },
            { path: 'accounts/balances', loadChildren: './accounts/balances/balances.module#BalancesModule' },
            // General
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
            { path: 'general/todos', loadChildren: './todos/todos.module#TodosModule' },
            { path: 'general/charts', loadChildren: './general/charts/charts.module#ChartsModule' },
            { path: 'general/api-docs', loadChildren: './api-docs/api-docs.module#ApiDocsModule' },
            { path: 'general/users', loadChildren: './general/users/users.module#UsersModule' },
            { path: 'general/contact', loadChildren: './general/contact/contact.module#ContactModule'},
            { path: 'general/settings', loadChildren: './general/settings/settings.module#SettingsModule' },
            { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
