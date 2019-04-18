import { Config } from "../config";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Grocery } from "./grocery";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "tns-core-modules/ui/page/page";

@Injectable()
export class GroceryListService {
    private baseUrl = Config.apiUrl + "appdata/" + Config.appKey + "/Groceries";

    constructor(private http: HttpClient) { };

    public load() {
        return this.http.get(this.baseUrl, {
            headers: this.getCommonHeaders()
        })
            .pipe(
                map((data: any[]) => {
                    const groceryList = data.sort((a, b) => {
                        return a._kmd.lmt > b._kmd.lmt ? -1 : 1;
                    })
                        .map(grocery => new Grocery(grocery._id, grocery.Name));

                    return groceryList;
                }),
                catchError(this.handleErrors)
            );
    }

    public add(groceryName: string) {
        return this.http.post(this.baseUrl, JSON.stringify({ Name: groceryName }), { headers: this.getCommonHeaders() })
            .pipe(
                map((data: any) => {
                    return new Grocery(data._id, data.Name);
                }),
                catchError(this.handleErrors));
    }

    public delete(grocery: Grocery) {
        return this.http.delete(this.baseUrl + "/" + grocery.id, { headers: this.getCommonHeaders() })
            .pipe(
                map(data => {
                    return data;
                }),
                catchError(this.handleErrors)
            );
    }

    private getCommonHeaders() {
        return new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": "Kinvey " + Config.token
        });
    }

    private handleErrors(error: HttpErrorResponse) {
        console.log(error);
        return throwError(error);
    }
}