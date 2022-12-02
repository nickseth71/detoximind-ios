import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    // canLoad: [AuthGuard] // Secure all child pages

  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    // canLoad: [IntroGuard, AutoLoginGuard] // Check if we should show the introduction or forward to insi
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'forgetpassword',
    loadChildren: () => import('./forgetpassword/forgetpassword.module').then(m => m.ForgetpasswordPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'meditation',
    loadChildren: () => import('./meditation/meditation.module').then(m => m.MeditationPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'askmebuddy',
    loadChildren: () => import('./askmebuddy/askmebuddy.module').then(m => m.AskmebuddyPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'journal',
    loadChildren: () => import('./journal/journal.module').then(m => m.JournalPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'openpage/:id',
    loadChildren: () => import('./openpage/openpage.module').then(m => m.OpenpagePageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'blogs',
    loadChildren: () => import('./blogs/blogs.module').then(m => m.BlogsPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'chatroom',
    loadChildren: () => import('./chatroom/chatroom.module').then(m => m.ChatroomPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'chatpage/:id',
    loadChildren: () => import('./chatpage/chatpage.module').then(m => m.ChatpagePageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'post/:id',
    loadChildren: () => import('./post/post.module').then(m => m.PostPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'workshop',
    loadChildren: () => import('./workshop/workshop.module').then(m => m.WorkshopPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
