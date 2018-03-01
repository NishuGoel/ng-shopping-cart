import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DropdownValue } from '../../interfaces/dropdown-value';
import { AddToCartPosition, AddToCartType } from '../../types';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../classes/cart-item';

@Component({
  selector: 'add-to-cart', // tslint:disable-line component-selector
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnChanges {
  private _quantity = 1;
  private _editorQuantity = 1;

  labelSet = false;
  @Input() id: any;
  @Input() name: string;
  @Input() price: number;
  @Input() data: any;
  @Input() label = 'Add to cart';
  @Input() buttonClass = 'add-to-cart-button';
  @Output() quantityChange = new EventEmitter<number>();
  @Input() type: AddToCartType = 'button';
  @Input() position: AddToCartPosition = 'left';
  @Output() add = new EventEmitter();
  @Input() dropdown: DropdownValue[] = [{ label: '1 item', value: 1 }, { label: '2 item', value: 2 }, { label: '5 items', value: 5 }];

  @Input() get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    if (this.type === 'button') {
      this._quantity = value;
    }
  }

  get editorQuantity(): number {
    return this._editorQuantity;
  }

  set editorQuantity(value: number) {
    this._editorQuantity = value;
    this._quantity = this.editorQuantity;
    this.quantityChange.emit(this._quantity);
  }

  constructor(private cartService: CartService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['label']) {
      this.labelSet = true;
    }
    if (changes['type'] && changes['type'].currentValue === 'dropdown' && this.dropdown.length) {
      const match = this.dropdown.find(i => i.value === this._quantity);
      if (!match) {
        this.editorQuantity = this.dropdown[0].value;
      }
    }
  }

  addToCart(evt) {
    evt.stopPropagation();
    const quantity = parseFloat(this._quantity.toString());
    const item = this.cartService.addItem(this.id, this.name, this.price, quantity, this.data);
    this.add.emit(item);
  }

}