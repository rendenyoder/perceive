import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { BibleService } from './shared/services/bible.service';
import { SearchComponent } from './search/search.component';
import { StandardComponent } from './views/standard/standard.component';
import { ColumnComponent } from './views/column/column.component';
import { RotateComponent } from './views/rotate/rotate.component';
import { ViewSelectionComponent } from './shared/components/view-selection/view-selection.component';
import { AccentComponent } from './shared/components/accent/accent.component';
import { DarkModeComponent } from './shared/components/dark-mode/dark-mode.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    StandardComponent,
    ColumnComponent,
    RotateComponent,
    ViewSelectionComponent,
    AccentComponent,
    DarkModeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [BibleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
