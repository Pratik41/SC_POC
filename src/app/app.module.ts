import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule here
import { AppComponent } from './app.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';  // <-- Import RightSidebarComponent

@NgModule({
  declarations: [
    AppComponent,
    RightSidebarComponent  // <-- Declare the component here
  ],
  imports: [
    BrowserModule,
    FormsModule  // <-- Add FormsModule to imports to use ngModel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
