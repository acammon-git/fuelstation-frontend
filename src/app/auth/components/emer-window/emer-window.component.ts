import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'emer-window',
  templateUrl: './emer-window.component.html',
  styleUrls: ['./emer-window.component.css']
})
export class EmerWindowComponent{
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string) {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title);
  }
}
