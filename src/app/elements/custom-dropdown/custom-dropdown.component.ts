import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css']
})
export class CustomDropdownComponent {
  @Input() label: string = ''
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Wybierz opcję';
  @Output() selectedChange = new EventEmitter<string>();
  
  selectedIndex: number = -1;
  // isOpen = false;

  // toggleDropdown() {
  //   this.isOpen = !this.isOpen;
  // }

  selectOption(optionIndex: number) {
    const selected =this.options[optionIndex];
    this.selectedChange.emit(selected);
    this.selectedIndex = optionIndex;
  }

}
