import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Grocery } from '~/app/shared/grocery/grocery';
import { GroceryListService } from '~/app/shared/grocery/grocery-list.service';
import { TextField } from "tns-core-modules/ui/text-field";

@Component({
    selector: 'list',
    providers: [GroceryListService],
    templateUrl: 'app/pages/list/list.component.html',
    styleUrls: ['app/pages/list/list-common.css', 'app/pages/list/list.css']
})
export class ListComponent implements OnInit {

    public groceryList: Grocery[] = [];
    public grocery: string = '';
    public isLoading: boolean = false;
    public listLoaded: boolean = false;
    @ViewChild('groceryTextField') groceryTextField: ElementRef;

    constructor(private groceryListService: GroceryListService) { };

    ngOnInit(): void {
        this.isLoading = true;
        this.groceryListService.load()
            .subscribe(groceries => {
                groceries.forEach(grocery => this.groceryList.push(grocery));
            });
        this.isLoading = false;
        this.listLoaded = true;
    }

    public add() {
        if (this.grocery.trim() === '') {
            alert('Enter a grocery item.');
            return;
        }

        // Dismiss the keyboard
        let textField = <TextField>this.groceryTextField.nativeElement;
        textField.dismissSoftInput();

        this.groceryListService.add(this.grocery)
            .subscribe(
                createdGrocery => {
                    this.groceryList.unshift(createdGrocery);
                    this.grocery = '';
                },
                () => {
                    alert({
                        message: 'And error occurred while adding an item to your list.',
                        okButtonText: 'OK'
                    });
                    this.grocery = '';
                }
            );
    }
}