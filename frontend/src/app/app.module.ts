import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { AllBlogsComponent } from './component/all-blogs/all-blogs.component';
import { CustomErrorHandle } from './core/ErrorHandle';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AllBlogsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    HttpClient,
    { provide: ErrorHandler, useClass: CustomErrorHandle },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
